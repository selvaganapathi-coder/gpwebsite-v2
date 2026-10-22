/**
 * Cloud MongoDB driver — same CMS document as cms.json.
 * Install when you switch:  npm install mongodb --prefix server
 *
 * Env:
 *   CMS_STORAGE=mongodb
 *   MONGODB_URI=mongodb+srv://...
 *   MONGODB_DB=gp_pharmacy
 *   MONGODB_COLLECTION=cms
 *   MONGODB_DOC_ID=cms-main
 */

import { getMongoConfig } from './config.js'

let clientPromise = null

async function getCollection() {
  const { uri, dbName, collection } = getMongoConfig()
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in server/.env when CMS_STORAGE=mongodb.')
  }
  let MongoClient
  try {
    ;({ MongoClient } = await import('mongodb'))
  } catch {
    throw new Error('Install MongoDB driver: npm install mongodb --prefix server')
  }
  if (!clientPromise) {
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }
  const client = await clientPromise
  return client.db(dbName).collection(collection)
}

export async function loadMongo(createEmpty) {
  const { docId } = getMongoConfig()
  const col = await getCollection()
  const row = await col.findOne({ _id: docId })
  if (!row) {
    const initial = createEmpty()
    await col.replaceOne(
      { _id: docId },
      { _id: docId, ...initial },
      { upsert: true },
    )
    return initial
  }
  const { _id, ...data } = row
  return data
}

export async function saveMongo(data) {
  const { docId } = getMongoConfig()
  const col = await getCollection()
  const { _id, ...rest } = data
  await col.replaceOne({ _id: docId }, { _id: docId, ...rest }, { upsert: true })
  return data
}

/** One-shot import of a full CMS JSON object into MongoDB. */
export async function importMongoDocument(data) {
  return saveMongo(data)
}
