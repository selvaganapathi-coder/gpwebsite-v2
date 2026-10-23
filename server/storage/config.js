/**
 * One place to choose where CMS data lives.
 *
 * CMS_STORAGE=
 *   json      → server/data/cms.json (local / VPS default)
 *   blobs     → Netlify Blobs (automatic on Netlify when USE_NETLIFY_BLOBS=1)
 *   mongodb   → MongoDB Atlas (set MONGODB_URI). Also selected when MONGODB_URI
 *               is set and CMS_STORAGE is left unset, so Vercel does not silently
 *               stay on ephemeral memory.
 *   memory    → In-process store seeded from defaults (Vercel only when no URI)
 *
 * Changing the driver does not change the website or Admin UI —
 * only where the same JSON document is stored.
 */

export function getStorageMode() {
  const raw = String(process.env.CMS_STORAGE || '').trim().toLowerCase()
  if (raw === 'mongodb' || raw === 'mongo') return 'mongodb'
  if (raw === 'blobs' || raw === 'blob') return 'blobs'
  if (raw === 'json' || raw === 'file') return 'json'
  if (raw === 'memory' || raw === 'none' || raw === 'mem') return 'memory'

  // URI present, driver not pinned: use MongoDB instead of the Vercel memory default.
  if (process.env.MONGODB_URI?.trim()) return 'mongodb'

  // Vercel serverless with no database configured yet.
  if (process.env.VERCEL === '1' || process.env.VERCEL === 'true') return 'memory'

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
    uri: process.env.MONGODB_URI?.trim() || '',
    dbName: process.env.MONGODB_DB?.trim() || 'gp_pharmacy',
    collection: process.env.MONGODB_COLLECTION?.trim() || 'cms',
    docId: process.env.MONGODB_DOC_ID?.trim() || 'cms-main',
    mediaBucket: process.env.MONGODB_MEDIA_BUCKET?.trim() || 'cms_uploads',
  }
}

export function describeStorage() {
  const mode = getStorageMode()
  if (mode === 'mongodb') {
    const { dbName, collection, docId, mediaBucket } = getMongoConfig()
    return `mongodb://${dbName}.${collection} (${docId}) media=${mediaBucket}`
  }
  if (mode === 'blobs') return 'netlify-blobs:gp-cms/cms-data'
  if (mode === 'memory') return 'memory (no database — resets on cold start)'
  return 'file:server/data/cms.json'
}
