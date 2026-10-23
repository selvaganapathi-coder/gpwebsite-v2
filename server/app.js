import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware, authenticateUser, ensureDefaultUsers, signToken } from './auth.js'
import {
  appendActivity,
  getPublicContent,
  loadStoreAsync,
  saveStoreAsync,
  storageErrorMessage,
} from './store.js'
import { ensureUploadDir, uploadImage, getUploadedFile } from './upload.js'
import { getStorageMode } from './storage/config.js'
import { sanitizeDeep } from './sanitize.js'
import {
  securityHeaders,
  rateLimit,
  checkLoginAllowed,
  recordLoginFailure,
  clearLoginFailures,
  safeParams,
} from './security.js'

function resolveDirname() {
  try {
    if (typeof import.meta?.url === 'string' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url))
    }
  } catch {
    /* bundled CJS */
  }
  return path.join(process.cwd(), 'server')
}

const __dirname = resolveDirname()

function noStore(_req, res, next) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('CDN-Cache-Control', 'no-store')
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
  next()
}

async function readStore(res) {
  try {
    return await loadStoreAsync()
  } catch (err) {
    console.error('[cms] read failed:', err)
    if (!res.headersSent) res.status(500).json({ error: storageErrorMessage(err) })
    return null
  }
}

async function writeStore(res, data) {
  try {
    return await saveStoreAsync(data)
  } catch (err) {
    console.error('[cms] write failed:', err)
    if (!res.headersSent) res.status(500).json({ error: storageErrorMessage(err) })
    return null
  }
}

/**
 * Create the CMS Express app.
 * MongoDB mode reloads the document on every request so one Vercel instance
 * cannot serve a snapshot from before another instance saved.
 * Default users are written once, only when the user list is empty.
 */
export async function createApp() {
  const initial = await loadStoreAsync()
  if (await ensureDefaultUsers(initial)) {
    await saveStoreAsync(initial)
  }
  ensureUploadDir()

  const app = express()
  app.disable('x-powered-by')

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter(_req, file, cb) {
      if (!file.mimetype?.startsWith('image/')) {
        cb(new Error('Only image files are allowed.'))
        return
      }
      cb(null, true)
    },
  })

  const origins = (
    process.env.CORS_ORIGINS ||
    'http://localhost:3001,http://localhost:8080,http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const allowAllNetlify = process.env.NETLIFY === 'true' || process.env.ALLOW_NETLIFY_ORIGINS === '1'

  app.use(securityHeaders)
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true)
        if (origins.includes(origin)) return cb(null, true)
        if (allowAllNetlify && /\.netlify\.app$/i.test(origin)) return cb(null, true)
        if (process.env.VERCEL && /\.vercel\.app$/i.test(origin)) return cb(null, true)
        return cb(null, false)
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Pragma'],
      maxAge: 600,
    }),
  )
  app.use('/api', noStore)
  app.use(express.json({ limit: '2mb' }))

  const baseUrl = process.env.PUBLIC_URL || process.env.URL || `http://localhost:${process.env.PORT || 3001}`

  const publicLimit = rateLimit({ windowMs: 60_000, max: 120, message: 'Too many requests.' })
  const writeLimit = rateLimit({ windowMs: 60_000, max: 30, message: 'Too many write requests.' })
  const loginLimit = rateLimit({
    windowMs: 15 * 60_000,
    max: 20,
    message: 'Too many login attempts from this network.',
  })
  const uploadLimit = rateLimit({
    windowMs: 60_000,
    max: 15,
    message: 'Too many uploads. Wait a minute and try again.',
  })

  const enquiryLimit = rateLimit({
    windowMs: 60_000,
    max: 8,
    message: 'Too many enquiries. Please wait a minute.',
  })

  app.get('/api/health', publicLimit, async (_req, res) => {
    const store = await readStore(res)
    if (!store) return
    res.json({ ok: true, updatedAt: store.updatedAt, storage: getStorageMode() })
  })

  app.get('/api/content/public', publicLimit, async (_req, res) => {
    const store = await readStore(res)
    if (!store) return
    res.json(getPublicContent(store))
  })

  app.get('/api/content', authMiddleware, writeLimit, async (_req, res) => {
    const store = await readStore(res)
    if (!store) return
    const copy = structuredClone(store)
    copy.users = (copy.users || []).map(({ passwordHash, ...user }) => user)
    res.json(copy)
  })

  app.put('/api/content', authMiddleware, writeLimit, async (req, res) => {
    const store = await readStore(res)
    if (!store) return
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      res.status(400).json({ error: 'Invalid content payload.' })
      return
    }

    const cleaned = sanitizeDeep(req.body)
    const incomingUsers = cleaned.users
    const publishMode = cleaned._publishMode === 'draft' ? 'draft' : 'publish'
    delete cleaned._publishMode

    const next = {
      ...store,
      ...cleaned,
      users: store.users,
      enquiries: Array.isArray(cleaned.enquiries) ? cleaned.enquiries : store.enquiries,
      activityLog: store.activityLog,
    }

    // Never accept password hashes from the client
    if (Array.isArray(incomingUsers) && req.user.role === 'admin') {
      next.users = incomingUsers.map((user) => {
        const existing = store.users.find((item) => item.id === user.id)
        const { passwordHash: _ignored, password: _pw, ...safeUser } = user || {}
        return existing?.passwordHash ? { ...safeUser, passwordHash: existing.passwordHash } : safeUser
      })
    }

    if (publishMode === 'draft') {
      const {
        users: _u,
        enquiries: _e,
        activityLog: _a,
        cmsDraft: _d,
        ...draftBody
      } = { ...next }
      Object.assign(next, {
        site: store.site,
        website: store.website,
        admissions: store.admissions,
        notices: store.notices,
        events: store.events,
        news: store.news,
        placements: store.placements,
        research: store.research,
        gallery: store.gallery,
        media: store.media,
        achievements: store.achievements,
        activityLog: store.activityLog,
        enquiries: store.enquiries,
        users: store.users,
      })
      next.cmsDraft = draftBody
      appendActivity(next, {
        action: 'draft_saved',
        by: req.user?.email || req.user?.name || 'admin',
        note: 'Draft saved — not live on website',
      })
    } else {
      next.cmsDraft = null
      appendActivity(next, {
        action: 'published',
        by: req.user?.email || req.user?.name || 'admin',
        note: `Published · code ${next.site?.code || '—'} · ${next.site?.phoneDisplay || ''}`,
      })
    }

    const saved = await writeStore(res, next)
    if (!saved) return
    res.json({
      ok: true,
      updatedAt: saved.updatedAt,
      mode: publishMode,
      hasDraft: Boolean(saved.cmsDraft),
    })
  })

  app.post('/api/enquiries', enquiryLimit, async (req, res) => {
    const store = await readStore(res)
    if (!store) return
    const body = sanitizeDeep(req.body || {})
    const name = String(body.name || '').trim().slice(0, 120)
    const phone = String(body.phone || '').trim().slice(0, 40)
    const email = String(body.email || '').trim().slice(0, 120)
    const course = String(body.course || '').trim().slice(0, 80)
    const message = String(body.message || '').trim().slice(0, 2000)
    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone are required.' })
      return
    }
    const item = {
      id: `enq-${Date.now()}`,
      name,
      phone,
      email,
      course,
      message: message || '—',
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    store.enquiries = [item, ...(store.enquiries || [])].slice(0, 500)
    const saved = await writeStore(res, store)
    if (!saved) return
    res.json({ ok: true, id: item.id })
  })

  app.patch('/api/enquiries/:id', authMiddleware, writeLimit, async (req, res) => {
    const store = await readStore(res)
    if (!store) return
    const id = String(req.params.id || '')
    const status = String(req.body?.status || '').trim()
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      res.status(400).json({ error: 'Invalid status.' })
      return
    }
    const list = store.enquiries || []
    const idx = list.findIndex((e) => e.id === id)
    if (idx < 0) {
      res.status(404).json({ error: 'Enquiry not found.' })
      return
    }
    list[idx] = { ...list[idx], status, updatedAt: new Date().toISOString() }
    store.enquiries = list
    appendActivity(store, {
      action: 'enquiry_updated',
      by: req.user?.email || 'admin',
      note: `${id} → ${status}`,
    })
    const saved = await writeStore(res, store)
    if (!saved) return
    res.json({ ok: true, enquiry: list[idx] })
  })

  app.post('/api/auth/login', loginLimit, async (req, res) => {
    const store = await readStore(res)
    if (!store) return
    const { email, password } = req.body || {}
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' })
      return
    }

    const gate = checkLoginAllowed(email, req)
    if (!gate.ok) {
      res.status(429).json({ error: gate.error })
      return
    }

    const user = await authenticateUser(store, String(email).trim(), String(password))
    if (!user) {
      recordLoginFailure(gate.key)
      res.status(401).json({ error: 'Invalid email or password.' })
      return
    }

    clearLoginFailures(gate.key)
    let token
    try {
      token = signToken(user)
    } catch (err) {
      res.status(500).json({ error: err.message || 'Could not start a session.' })
      return
    }
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  })

  app.post('/api/auth/logout', authMiddleware, (_req, res) => {
    // Stateless JWT — client must discard token; endpoint exists for explicit logout UX/logging.
    res.json({ ok: true })
  })

  app.post('/api/upload', authMiddleware, uploadLimit, (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err.message || 'Upload rejected.' })
        return
      }
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' })
        return
      }

      try {
        const url = await uploadImage(req.file, baseUrl)
        const mediaItem = {
          id: `media-${Date.now()}`,
          url,
          name: String(req.file.originalname || 'upload').slice(0, 120),
          published: true,
          createdAt: new Date().toISOString(),
        }
        const store = await readStore(res)
        if (!store) return
        store.media = [mediaItem, ...(store.media || [])].slice(0, 300)
        appendActivity(store, {
          action: 'upload',
          by: req.user?.email || 'admin',
          note: mediaItem.name,
        })
        const saved = await writeStore(res, store)
        if (!saved) return
        res.json({ url, media: mediaItem })
      } catch (error) {
        console.error('[cms] upload failed:', error)
        if (res.headersSent) return
        const raw = String(error?.message || '')
        const db = /MONGODB_URI|mongo|ECONN|timed out|server selection|authentication failed/i.test(raw)
        res.status(400).json({ error: db ? storageErrorMessage(error) : raw || 'Upload failed.' })
      }
    })
  })

  app.get('/uploads/:name', publicLimit, safeParams, async (req, res) => {
    try {
      const file = await getUploadedFile(req.params.name)
      if (!file) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.setHeader('Content-Type', file.contentType || 'application/octet-stream')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Content-Disposition', 'inline')
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
      res.send(file.body)
    } catch (err) {
      console.error('[cms] upload read failed:', err)
      if (!res.headersSent) res.status(500).json({ error: storageErrorMessage(err) })
    }
  })

  // Local Node also serves legacy static HTML from repo root
  if (!process.env.NETLIFY && !process.env.VERCEL) {
    const siteRoot = path.join(__dirname, '..')
    app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
      fallthrough: true,
      setHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff')
      },
    }))
    app.use(express.static(siteRoot))
  }

  return app
}

/**
 * Default export for Vercel (Express preset, Root Directory = server).
 * Vercel picks up server/app.js and calls the default export for every request.
 * The app is created once per warm instance; local `node index.js` keeps using createApp().
 */
let appPromise
export default async function vercelHandler(req, res) {
  try {
    if (!appPromise) {
      appPromise = createApp().catch((err) => {
        appPromise = undefined
        throw err
      })
    }
    const app = await appPromise
    return app(req, res)
  } catch (err) {
    console.error('[cms] API failed to start:', err)
    const message = storageErrorMessage(err)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify({ error: message === 'Could not read or save CMS data.' ? 'API failed to start' : message }))
  }
}
