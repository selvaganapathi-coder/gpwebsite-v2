/**
 * Copy cms.json to a dated backup folder.
 * Usage: node server/scripts/backup-cms.cjs
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const source = path.join(root, 'data', 'cms.json')
const backupDir = path.join(root, 'backups')

if (!fs.existsSync(source)) {
  console.error('Missing', source)
  process.exit(1)
}

fs.mkdirSync(backupDir, { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const target = path.join(backupDir, `cms-${stamp}.json`)
fs.copyFileSync(source, target)

const files = fs
  .readdirSync(backupDir)
  .filter((name) => name.startsWith('cms-') && name.endsWith('.json'))
  .sort()
const keep = 30
if (files.length > keep) {
  for (const old of files.slice(0, files.length - keep)) {
    fs.unlinkSync(path.join(backupDir, old))
  }
}

console.log('Backup written:', target)
