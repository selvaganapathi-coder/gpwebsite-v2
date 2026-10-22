async function getBlobStore() {
  const { getStore } = await import('@netlify/blobs')
  const opts = { name: 'gp-cms', consistency: 'strong' }
  const siteID = process.env.SITE_ID || process.env.NETLIFY_SITE_ID
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.BLOBS_TOKEN
  if (siteID && token) {
    opts.siteID = siteID
    opts.token = token
  }
  return getStore(opts)
}

export async function loadBlobs(createEmpty) {
  const blobStore = await getBlobStore()
  const data = await blobStore.get('cms-data', { type: 'json' })
  if (!data) {
    const initial = createEmpty()
    try {
      await blobStore.setJSON('cms-data', initial)
    } catch {
      /* read-only context */
    }
    return initial
  }
  return data
}

export async function saveBlobs(data) {
  const blobStore = await getBlobStore()
  await blobStore.setJSON('cms-data', data)
  return data
}
