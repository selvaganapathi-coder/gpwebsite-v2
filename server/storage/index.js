import { describeStorage, getStorageMode } from './config.js'
import { loadJson, saveJson } from './jsonDriver.js'
import { loadBlobs, saveBlobs } from './blobsDriver.js'
import { loadMongo, saveMongo } from './mongodbDriver.js'

/**
 * Unified CMS storage — website + Admin always talk to /api.
 * Only this layer knows json / blobs / mongodb.
 */
export async function storageLoad(createEmpty) {
  const mode = getStorageMode()
  if (mode === 'mongodb') return loadMongo(createEmpty)
  if (mode === 'blobs') return loadBlobs(createEmpty)
  return loadJson(createEmpty)
}

export async function storageSave(data) {
  const mode = getStorageMode()
  if (mode === 'mongodb') return saveMongo(data)
  if (mode === 'blobs') return saveBlobs(data)
  return saveJson(data)
}

export { describeStorage, getStorageMode }
