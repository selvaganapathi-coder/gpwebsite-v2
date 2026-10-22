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
import { importMongoDocument, loadMongo } from '../storage/mongodbDriver.js'

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
  const data = await loadStoreAsync()
  await importMongoDocument(data)
  console.log('Imported full CMS into MongoDB.')
  console.log('Set in server/.env:')
  console.log('  CMS_STORAGE=mongodb')
  console.log('  MONGODB_URI=... (your cloud URI)')
  console.log('Then restart the CMS server. Website + Admin keep the same URLs.')
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
  node scripts/migrate-cms.mjs to-mongo
  node scripts/migrate-cms.mjs from-mongo [outfile.json]

Future cloud DB switch (one place):
  1) npm install mongodb --prefix server
  2) node scripts/migrate-cms.mjs to-mongo
  3) In server/.env set CMS_STORAGE=mongodb and MONGODB_URI=...
  4) Restart CMS — all data already transferred
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
