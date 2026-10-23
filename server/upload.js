import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { getStorageMode } from './storage/config.js'
import { readMongoFile, saveMongoFile } from './storage/mongodbDriver.js'

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
const UPLOAD_DIR = path.join(__dirname, 'uploads')

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function isVercel() {
  return process.env.VERCEL === '1' || process.env.VERCEL === 'true'
}

function useNetlifyBlobs() {
  if (isVercel()) return false
  return (
    process.env.USE_NETLIFY_BLOBS === '1' ||
    process.env.NETLIFY === 'true' ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY_BLOBS_CONTEXT) ||
    Boolean(process.env.BLOBS_CONTEXT)
  )
}

function detectImageKind(buffer, mimetype) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' }
  }
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { ext: 'png', mime: 'image/png' }
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return { ext: 'gif', mime: 'image/gif' }
  }
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { ext: 'webp', mime: 'image/webp' }
  }
  if (mimetype && ALLOWED_MIME.has(mimetype)) {
    // Reject if magic bytes do not match claimed type
    return null
  }
  return null
}

export function assertSafeImage(file) {
  if (!file?.buffer) throw new Error('No file uploaded.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.')
  if (!ALLOWED_MIME.has(file.mimetype)) throw new Error('Only JPEG, PNG, WebP, or GIF images are allowed.')
  const kind = detectImageKind(file.buffer, file.mimetype)
  if (!kind) throw new Error('File content is not a valid image.')
  if (kind.mime !== file.mimetype) throw new Error('File type does not match contents.')
  return kind
}

function safeUploadName(originalName, ext) {
  const base = String(originalName || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .slice(0, 40)
  const rand = crypto.randomBytes(6).toString('hex')
  return `${Date.now()}-${base || 'image'}-${rand}.${ext}`
}

async function saveToBlobs(file, kind) {
  const safeName = safeUploadName(file.originalname, kind.ext)
  try {
    const blobStore = await getUploadBlobStore()
    await blobStore.set(safeName, file.buffer, {
      metadata: { contentType: kind.mime },
    })
    return `/uploads/${safeName}`
  } catch (err) {
    const b64 = file.buffer.toString('base64')
    console.warn('[cms] upload Blobs failed, using data URL:', err?.message || err)
    return `data:${kind.mime};base64,${b64}`
  }
}

async function getUploadBlobStore() {
  const { getStore } = await import('@netlify/blobs')
  const opts = { name: 'gp-uploads', consistency: 'strong' }
  const siteID = process.env.SITE_ID || process.env.NETLIFY_SITE_ID
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.BLOBS_TOKEN
  if (siteID && token) {
    opts.siteID = siteID
    opts.token = token
  }
  return getStore(opts)
}

export function ensureUploadDir() {
  if (useNetlifyBlobs() || isVercel() || getStorageMode() === 'mongodb') return
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function uploadImage(file, baseUrl) {
  const kind = assertSafeImage(file)

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (cloudName && apiKey && apiSecret) {
    return uploadToCloudinary(file, cloudName, apiKey, apiSecret)
  }

  // Atlas GridFS: persists across Vercel instances. Files stay out of the CMS
  // document (16 MB BSON limit). assertSafeImage already caps each file at 5 MB.
  if (getStorageMode() === 'mongodb') {
    const safeName = safeUploadName(file.originalname, kind.ext)
    return saveMongoFile(safeName, file.buffer, kind.mime)
  }

  if (useNetlifyBlobs()) {
    return saveToBlobs(file, kind)
  }

  // Vercel without MongoDB or Cloudinary: the disk is ephemeral, so keep a
  // size-capped data URL inside the CMS document until a database is configured.
  if (isVercel()) {
    return `data:${kind.mime};base64,${file.buffer.toString('base64')}`
  }

  return saveLocal(file, kind)
}

export async function getUploadedFile(name) {
  const safe = path.basename(String(name || ''))
  if (!safe || safe !== name || !/\.(jpe?g|png|gif|webp)$/i.test(safe)) return null

  if (getStorageMode() === 'mongodb') {
    return readMongoFile(safe)
  }

  if (useNetlifyBlobs()) {
    try {
      const blobStore = await getUploadBlobStore()
      const meta = await blobStore.getMetadata(safe)
      if (!meta) return null
      const body = await blobStore.get(safe, { type: 'arrayBuffer' })
      if (!body) return null
      return {
        body: Buffer.from(body),
        contentType: meta.metadata?.contentType || guessType(safe),
      }
    } catch {
      return null
    }
  }

  const target = path.join(UPLOAD_DIR, safe)
  if (!fs.existsSync(target)) return null
  return {
    body: fs.readFileSync(target),
    contentType: guessType(safe),
  }
}

function guessType(name) {
  if (/\.png$/i.test(name)) return 'image/png'
  if (/\.webp$/i.test(name)) return 'image/webp'
  if (/\.gif$/i.test(name)) return 'image/gif'
  return 'image/jpeg'
}

async function uploadToCloudinary(file, cloudName, apiKey, apiSecret) {
  const timestamp = Math.round(Date.now() / 1000)
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'gp-pharmacy'

  const params = new URLSearchParams({
    timestamp: String(timestamp),
    folder,
    transformation: 'f_auto,q_auto',
  })

  const signature = await import('crypto').then(({ createHmac }) =>
    createHmac('sha1', apiSecret).update(params.toString()).digest('hex'),
  )

  const body = new FormData()
  body.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname)
  body.append('api_key', apiKey)
  body.append('timestamp', String(timestamp))
  body.append('signature', signature)
  body.append('folder', folder)
  body.append('transformation', 'f_auto,q_auto')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  })

  const data = await response.json()
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Cloudinary upload failed.')
  }
  // Prefer compressed web delivery when using Cloudinary
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto:eco,w_1600,c_limit/')
}

function saveLocal(file, kind) {
  ensureUploadDir()
  const safeName = safeUploadName(file.originalname, kind.ext)
  const target = path.join(UPLOAD_DIR, safeName)
  fs.writeFileSync(target, file.buffer)
  return `/uploads/${safeName}`
}
