import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mongod
let createApp
let serverA
let serverB
let baseA
let baseB

function listen(app) {
  const server = createServer(app)
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

function origin(server) {
  return `http://127.0.0.1:${server.address().port}`
}

async function api(base, pathname, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(`${base}${pathname}`, { method, headers, body: payload, cache: 'no-store' })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }
  return { status: res.status, headers: res.headers, data }
}

function close(server) {
  if (!server) return Promise.resolve()
  return new Promise((resolve) => server.close(resolve))
}

before(async () => {
  process.env.NODE_ENV = 'test'
  process.env.CMS_STORAGE = 'mongodb'
  process.env.JWT_SECRET = 'test-jwt-secret-must-be-32-characters-min'
  process.env.CMS_ADMIN_PASSWORD = 'gpadmin2026'
  process.env.CMS_EDITOR_PASSWORD = 'editor2026'
  process.env.MONGODB_DB = 'gp_pharmacy_test'
  process.env.MONGODB_COLLECTION = 'cms'
  process.env.MONGODB_DOC_ID = 'cms-main'
  process.env.MONGODB_MEDIA_BUCKET = 'cms_uploads'
  delete process.env.VERCEL
  delete process.env.NETLIFY
  delete process.env.CLOUDINARY_CLOUD_NAME
  delete process.env.CLOUDINARY_API_KEY
  delete process.env.CLOUDINARY_API_SECRET

  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()

  ;({ createApp } = await import('../app.js'))
  const appA = await createApp()
  const appB = await createApp()
  serverA = await listen(appA)
  serverB = await listen(appB)
  baseA = origin(serverA)
  baseB = origin(serverB)
})

after(async () => {
  await close(serverA)
  await close(serverB)
  const { closeMongo } = await import('../storage/mongodbDriver.js')
  await closeMongo()
  if (mongod) await mongod.stop()
})

describe('cms mongodb', { concurrency: 1 }, () => {
test('hosted runtime refuses an in-memory JWT secret', async () => {
  const prevVercel = process.env.VERCEL
  const prevSecret = process.env.JWT_SECRET
  process.env.VERCEL = '1'
  process.env.JWT_SECRET = 'short'
  try {
    const { signToken } = await import('../auth.js')
    assert.throws(
      () => signToken({ id: 'u', email: 'a@b.c', role: 'admin', name: 'A' }),
      /JWT_SECRET/,
    )
  } finally {
    if (prevVercel === undefined) delete process.env.VERCEL
    else process.env.VERCEL = prevVercel
    process.env.JWT_SECRET = prevSecret
  }
})

test('empty database is seeded once and a second boot does not rewrite it', async () => {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  try {
    const col = client.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION)
    assert.equal(await col.countDocuments(), 1)
    const healthA = await api(baseA, '/api/health')
    const healthB = await api(baseB, '/api/health')
    assert.equal(healthA.status, 200)
    assert.equal(healthA.data.storage, 'mongodb')
    assert.match(healthA.headers.get('cache-control') || '', /no-store/)
    assert.equal(healthA.data.updatedAt, healthB.data.updatedAt)

    const beforeBoot = healthA.data.updatedAt
    await createApp()
    const afterBoot = await api(baseB, '/api/health')
    assert.equal(afterBoot.data.updatedAt, beforeBoot)

    const row = await col.findOne({ _id: 'cms-main' })
    assert.equal(row.users.length, 2)
    const pub = await api(baseA, '/api/content/public')
    assert.ok(pub.data.notices.some((item) => item.title === 'Counselling Code 889 — Admissions open'))
    assert.equal(pub.data.users, undefined)
    assert.equal(JSON.stringify(pub.data).includes('passwordHash'), false)
  } finally {
    await client.close()
  }
})

test('admin create, edit, and delete are returned by the other instance public API', async () => {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  try {
    const db = client.db(process.env.MONGODB_DB)
    const col = db.collection(process.env.MONGODB_COLLECTION)
    const existing = await col.findOne({ _id: 'cms-main' })
    const hash = existing.users[0].passwordHash

    await col.updateOne(
      { _id: 'cms-main' },
      {
        $set: {
          'site.name': 'Custom College',
          'site.code': '111',
          notices: [],
          updatedAt: '2020-01-01T00:00:00.000Z',
        },
        $unset: { website: '' },
      },
    )

    const untouched = await api(baseB, '/api/content/public')
    assert.equal(untouched.status, 200)
    assert.equal(untouched.data.site.name, 'Custom College')
    assert.equal(untouched.data.site.code, '111')
    assert.deepEqual(untouched.data.notices, [])
    const stored = await col.findOne({ _id: 'cms-main' })
    assert.equal(stored.updatedAt, '2020-01-01T00:00:00.000Z')
    assert.equal(stored.website, undefined)
    assert.deepEqual(stored.notices, [])
    assert.equal(stored.users[0].passwordHash, hash)

    const login = await api(baseA, '/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@gppharmacycollege.com', password: 'gpadmin2026' },
    })
    assert.equal(login.status, 200, JSON.stringify(login.data))
    const token = login.data.token

    const adminOnB = await api(baseB, '/api/content', { token })
    assert.equal(adminOnB.status, 200)
    assert.equal(adminOnB.data.site.name, 'Custom College')
    assert.equal(JSON.stringify(adminOnB.data).includes('passwordHash'), false)

    const content = adminOnB.data
    content.site.name = 'Custom College Edited'
    content.notices = [
      {
        id: 'notice-keep',
        title: 'Persisted notice',
        summary: 'saved in mongodb',
        date: '2026-10-23',
        published: true,
      },
      {
        id: 'notice-drop',
        title: 'Delete me',
        summary: 'temporary',
        date: '2026-10-22',
        published: true,
      },
    ]
    const created = await api(baseA, '/api/content', { method: 'PUT', token, body: content })
    assert.equal(created.status, 200, JSON.stringify(created.data))

    content.notices = content.notices.filter((item) => item.id !== 'notice-drop')
    const deleted = await api(baseA, '/api/content', { method: 'PUT', token, body: content })
    assert.equal(deleted.status, 200, JSON.stringify(deleted.data))

    const pub = await api(baseB, '/api/content/public')
    assert.match(pub.headers.get('cache-control') || '', /no-store/)
    assert.equal(pub.data.site.name, 'Custom College Edited')
    assert.deepEqual(
      pub.data.notices.map((item) => item.id),
      ['notice-keep'],
    )

    const enquiry = await api(baseA, '/api/enquiries', {
      method: 'POST',
      body: { name: 'Parent', phone: '9443437487', message: 'Seat availability?' },
    })
    assert.equal(enquiry.status, 200, JSON.stringify(enquiry.data))
    const adminAfter = await api(baseB, '/api/content', { token })
    assert.ok(adminAfter.data.enquiries.some((item) => item.id === enquiry.data.id))

    const form = new FormData()
    form.append('file', new Blob([PNG], { type: 'image/png' }), 'dot.png')
    const uploadRes = await fetch(`${baseA}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    const upload = await uploadRes.json()
    assert.equal(uploadRes.status, 200, JSON.stringify(upload))
    assert.match(upload.url, /^\/uploads\/.+\.png$/)

    const imageRes = await fetch(`${baseB}${upload.url}`)
    assert.equal(imageRes.status, 200)
    assert.match(imageRes.headers.get('content-type') || '', /image\/png/)
    assert.match(imageRes.headers.get('cache-control') || '', /immutable/)
    const bytes = Buffer.from(await imageRes.arrayBuffer())
    assert.deepEqual(bytes, PNG)

    const filename = path.basename(upload.url)
    assert.equal(fs.existsSync(path.join(__dirname, '..', 'uploads', filename)), false)
    const gridFile = await db.collection('cms_uploads.files').findOne({ filename })
    assert.ok(gridFile)
    assert.equal(gridFile.metadata.contentType, 'image/png')

    const indexes = await col.indexes()
    assert.ok(indexes.some((index) => index.name === 'cms_updatedAt'))
    const fileIndexes = await db.collection('cms_uploads.files').indexes()
    assert.ok(fileIndexes.some((index) => index.key && index.key.filename === 1 && index.key.uploadDate === 1))

    const { loadStoreAsync } = await import('../store.js')
    const reloaded = await loadStoreAsync()
    assert.equal(reloaded.site.name, 'Custom College Edited')
    assert.deepEqual(
      reloaded.notices.map((item) => item.id),
      ['notice-keep'],
    )
    assert.ok(reloaded.media.some((item) => item.url === upload.url))
    const finalRow = await col.findOne({ _id: 'cms-main' })
    assert.equal(finalRow.users[0].passwordHash, hash)
    assert.equal(await col.countDocuments(), 1)
  } finally {
    await client.close()
  }
})

test('missing MONGODB_URI fails clearly and does not fall back to memory', async () => {
  const prevUri = process.env.MONGODB_URI
  const prevMode = process.env.CMS_STORAGE
  const { getStorageMode } = await import('../storage/config.js')
  const { resetMongoCache, loadMongo } = await import('../storage/mongodbDriver.js')
  const { loadStoreAsync } = await import('../store.js')
  try {
    delete process.env.CMS_STORAGE
    assert.equal(getStorageMode(), 'mongodb')
    process.env.CMS_STORAGE = 'memory'
    assert.equal(getStorageMode(), 'memory')
    process.env.CMS_STORAGE = 'mongodb'
    delete process.env.MONGODB_URI
    await resetMongoCache()
    await assert.rejects(() => loadMongo(() => ({ version: 1 })), /MONGODB_URI is missing/)
    await assert.rejects(() => loadStoreAsync(), /MONGODB_URI is missing/)
  } finally {
    process.env.MONGODB_URI = prevUri
    process.env.CMS_STORAGE = prevMode
    await resetMongoCache()
  }
})
})
