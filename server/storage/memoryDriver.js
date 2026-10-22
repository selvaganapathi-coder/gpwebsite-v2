/**
 * No-database driver: the CMS document lives in process memory only.
 * Used on Vercel until a real database is configured (CMS_STORAGE=mongodb).
 * Edits survive while the serverless instance is warm and reset on cold start.
 */
let doc = null

export async function loadMemory(createEmpty) {
  if (!doc) doc = createEmpty()
  return doc
}

export async function saveMemory(data) {
  doc = data
  return data
}
