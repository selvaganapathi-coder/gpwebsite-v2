/**
 * MongoDB Atlas driver for the CMS document plus GridFS uploads.
 *
 * The CMS is one JSON document. Uploaded images go in GridFS (bucket
 * cms_uploads) so they survive Vercel's read-only filesystem and stay under
 * the 16 MB BSON document limit. Each image is still capped at 5 MB.
 *
 * Env:
 *   CMS_STORAGE=mongodb
 *   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
 *   MONGODB_DB=gp_pharmacy
 *   MONGODB_COLLECTION=cms
 *   MONGODB_DOC_ID=cms-main
 *   MONGODB_MEDIA_BUCKET=cms_uploads
 */

import { GridFSBucket, MongoClient } from 'mongodb'
import { getMongoConfig } from './config.js'

const CLIENT_OPTIONS = {
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 10_000,
  serverSelectionTimeoutMS: 12_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 20_000,
  waitQueueTimeoutMS: 10_000,
  retryWrites: true,
  retryReads: true,
}

const MISSING_URI =
  'MONGODB_URI is missing. Set MONGODB_URI on the API host (Vercel project gpwebsite-v2-api) to a MongoDB Atlas connection string, and set CMS_STORAGE=mongodb. Refusing to use in-memory storage, because admin edits would disappear on cold start and would not be shared across instances.'

function requireUri() {
  const uri = getMongoConfig().uri
  if (!uri) throw new Error(MISSING_URI)
  return uri
}

function slotMatches(slot, uri, dbName) {
  return Boolean(slot && slot.uri === uri && slot.dbName === dbName && slot.promise)
}

async function getHandle() {
  const uri = requireUri()
  const { dbName } = getMongoConfig()
  const current = globalThis.__gpMongoCms
  if (slotMatches(current, uri, dbName)) {
    await current.promise
    return current
  }
  if (current?.client) {
    current.client.close().catch(() => {})
  }

  const client = new MongoClient(uri, CLIENT_OPTIONS)
  const slot = {
    uri,
    dbName,
    client,
    promise: client.connect().then(() => client.db(dbName)),
    indexes: null,
  }
  globalThis.__gpMongoCms = slot
  try {
    await slot.promise
  } catch (err) {
    if (globalThis.__gpMongoCms === slot) globalThis.__gpMongoCms = undefined
    await client.close().catch(() => {})
    throw err
  }
  return slot
}

async function ensureIndexes(db) {
  const { collection, mediaBucket } = getMongoConfig()
  await db.collection(collection).createIndex({ updatedAt: -1 }, { name: 'cms_updatedAt' })
  // Match the indexes GridFSBucket expects so the driver does not create a second pair.
  await db.collection(`${mediaBucket}.files`).createIndex(
    { filename: 1, uploadDate: 1 },
    { name: 'uploads_filename' },
  )
  await db.collection(`${mediaBucket}.chunks`).createIndex(
    { files_id: 1, n: 1 },
    { name: 'uploads_chunks', unique: true },
  )
}

async function getDb() {
  const slot = await getHandle()
  const db = await slot.promise
  if (!slot.indexes) {
    slot.indexes = ensureIndexes(db).catch((err) => {
      slot.indexes = null
      throw err
    })
  }
  await slot.indexes
  return db
}

async function getCollection() {
  const { collection } = getMongoConfig()
  const db = await getDb()
  return db.collection(collection)
}

function stripId(row) {
  if (!row) return null
  const { _id, ...data } = row
  return data
}

/**
 * Load the CMS document. Seeds default content only when the document is absent.
 * A concurrent first boot that loses the insert race reads the winner instead of
 * replacing it.
 */
export async function loadMongo(createEmpty) {
  const { docId } = getMongoConfig()
  const col = await getCollection()
  const row = await col.findOne({ _id: docId })
  if (row) return stripId(row)

  const initial = await Promise.resolve(createEmpty())
  if (!initial || typeof initial !== 'object' || Array.isArray(initial)) {
    throw new Error('Refusing to seed MongoDB with an invalid CMS document.')
  }
  const { _id, ...rest } = initial
  try {
    await col.insertOne({ _id: docId, ...rest })
  } catch (err) {
    if (err?.code === 11000) {
      const winner = await col.findOne({ _id: docId })
      if (winner) return stripId(winner)
    }
    throw err
  }
  return rest
}

export async function saveMongo(data) {
  const { docId } = getMongoConfig()
  const col = await getCollection()
  const { _id, ...rest } = data || {}
  const clean = JSON.parse(JSON.stringify(rest))
  await col.replaceOne({ _id: docId }, { _id: docId, ...clean }, { upsert: true })
  return data
}

export async function mongoDocumentExists() {
  const { docId } = getMongoConfig()
  const col = await getCollection()
  const row = await col.findOne({ _id: docId }, { projection: { _id: 1 } })
  return Boolean(row)
}

/** One-shot import of a full CMS JSON object into MongoDB. */
export async function importMongoDocument(data) {
  return saveMongo(data)
}

async function getBucket() {
  const db = await getDb()
  const { mediaBucket } = getMongoConfig()
  return new GridFSBucket(db, { bucketName: mediaBucket })
}

export async function saveMongoFile(filename, buffer, contentType) {
  const bucket = await getBucket()
  await new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      metadata: { contentType },
    })
    stream.on('error', reject)
    stream.on('finish', () => resolve(stream.id))
    stream.end(buffer)
  })
  return `/uploads/${filename}`
}

export async function readMongoFile(filename) {
  const safe = String(filename || '')
  if (!safe || safe.includes('/') || safe.includes('\\') || safe.includes('\0')) return null
  const bucket = await getBucket()
  const files = await bucket.find({ filename: safe }).sort({ uploadDate: -1 }).limit(1).toArray()
  if (!files.length) return null
  const file = files[0]
  const body = await new Promise((resolve, reject) => {
    const chunks = []
    const stream = bucket.openDownloadStream(file._id)
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
  return {
    body,
    contentType: file.metadata?.contentType || 'application/octet-stream',
  }
}

export async function closeMongo() {
  const slot = globalThis.__gpMongoCms
  globalThis.__gpMongoCms = undefined
  if (slot?.client) await slot.client.close().catch(() => {})
}

export async function resetMongoCache() {
  await closeMongo()
}
