#!/usr/bin/env node
/**
 * Transfer the full CMS document between storage backends.
 *
 * Examples:
 *   node scripts/migrate-cms.mjs export
 *   node scripts/migrate-cms.mjs status
 *   node scripts/migrate-cms.mjs to-mongo
 *   node scripts/migrate-cms.mjs from-mongo ./backup.json
 *
 * Always copies the ENTIRE cms document (site, pages, notices, events,
 * gallery, users hashes, media list, etc.) — Admin UI stays the same.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadStoreAsync, saveStore, mergeDefaults } from '../store.js'
import { describeStorage, getStorageMode } from '../storage/config.js'
import { getJsonPath, saveJson } from '../storage/jsonDriver.js'
import { importMongoDocument, loadMongo, mongoDocumentExists } from '../storage/mongodbDriver.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cmd = process.argv[2] || 'status'
const arg = process.argv[3]

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

async function exportJson() {
  const data = await loadStoreAsync()
  const out = path.join(__dirname, '..', 'backups', `cms-export-${stamp()}.json`)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(data, null, 2))
  console.log('Exported full CMS →', out)
  console.log('Keys:', Object.keys(data).join(', '))
  return out
}

async function toMongo() {
  const force = process.argv.includes('--force')
  if ((await mongoDocumentExists()) && !force) {
    console.error(
      'MongoDB already has a CMS document. Refusing to overwrite existing data. Re-run with --force only if you intend to replace it.',
    )
    process.exit(1)
  }
  const data = await loadStoreAsync()
  await importMongoDocument(data)
  console.log('Imported full CMS into MongoDB.')
  console.log('Set in server/.env (and on the Vercel API project):')
  console.log('  CMS_STORAGE=mongodb')
  console.log('  MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority')
  console.log('Startup seeds defaults only when that document is missing. It will not overwrite this import.')
}

async function fromMongo(filePath) {
  const data = await loadMongo(() => {
    throw new Error('MongoDB document missing — nothing to export')
  })
  const merged = mergeDefaults(data)
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2))
    console.log('Wrote', filePath)
  } else {
    await saveJson(merged)
    console.log('Wrote', getJsonPath())
  }
}

async function status() {
  console.log('Current CMS_STORAGE mode:', getStorageMode())
  console.log('Target:', describeStorage())
  console.log('JSON file:', getJsonPath())
  const data = await loadStoreAsync()
  console.log('updatedAt:', data.updatedAt)
  console.log('notices:', (data.notices || []).length)
  console.log('events:', (data.events || []).length)
  console.log('gallery:', (data.gallery || []).length)
  console.log('media:', (data.media || []).length)
}

const help = `
Usage:
  node scripts/migrate-cms.mjs status
  node scripts/migrate-cms.mjs export
  node scripts/migrate-cms.mjs to-mongo [--force]
  node scripts/migrate-cms.mjs from-mongo [outfile.json]

Copy an existing JSON/Blobs CMS into Atlas (skips the write if a document is already there):
  1) Set MONGODB_URI (and CMS_STORAGE=json if the source is still cms.json)
  2) node scripts/migrate-cms.mjs to-mongo
  3) On the API host set CMS_STORAGE=mongodb and MONGODB_URI
  4) Restart. An empty database is seeded from defaults; an existing document is left as-is.
     Pass --force only when you mean to replace the Atlas document.
`

try {
  if (cmd === 'export') await exportJson()
  else if (cmd === 'to-mongo') await toMongo()
  else if (cmd === 'from-mongo') await fromMongo(arg)
  else if (cmd === 'status') await status()
  else {
    console.log(help)
    process.exit(cmd === 'help' ? 0 : 1)
  }
} catch (err) {
  console.error('Migration failed:', err.message || err)
  process.exit(1)
}
