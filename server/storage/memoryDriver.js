/**
 * No-database driver: the CMS document lives in process memory only.
 * Used on Vercel only when CMS_STORAGE=memory, or when neither CMS_STORAGE nor
 * MONGODB_URI is set. Prefer CMS_STORAGE=mongodb so edits survive cold starts.
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
