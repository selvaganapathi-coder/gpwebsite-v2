/**
 * One place to choose where CMS data lives.
 *
 * CMS_STORAGE=
 *   json      → server/data/cms.json (local / VPS default)
 *   blobs     → Netlify Blobs (automatic on Netlify when USE_NETLIFY_BLOBS=1)
 *   mongodb   → Cloud MongoDB (set MONGODB_URI)
 *
 * Changing the driver does not change the website or Admin UI —
 * only where the same JSON document is stored.
 */

export function getStorageMode() {
  const raw = String(process.env.CMS_STORAGE || '').trim().toLowerCase()
  if (raw === 'mongodb' || raw === 'mongo') return 'mongodb'
  if (raw === 'blobs' || raw === 'blob') return 'blobs'
  if (raw === 'json' || raw === 'file') return 'json'

  // Auto: Netlify → blobs, else json
  if (
    process.env.USE_NETLIFY_BLOBS === '1' ||
    process.env.NETLIFY === 'true' ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY_BLOBS_CONTEXT) ||
    Boolean(process.env.BLOBS_CONTEXT)
  ) {
    return 'blobs'
  }
  return 'json'
}

export function getMongoConfig() {
  return {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.MONGODB_DB || 'gp_pharmacy',
    collection: process.env.MONGODB_COLLECTION || 'cms',
    docId: process.env.MONGODB_DOC_ID || 'cms-main',
  }
}

export function describeStorage() {
  const mode = getStorageMode()
  if (mode === 'mongodb') {
    const { dbName, collection, docId } = getMongoConfig()
    return `mongodb://${dbName}.${collection} (${docId})`
  }
  if (mode === 'blobs') return 'netlify-blobs:gp-cms/cms-data'
  return 'file:server/data/cms.json'
}
