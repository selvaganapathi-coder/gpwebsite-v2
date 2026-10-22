import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function resolveServerDir() {
  try {
    if (typeof import.meta?.url === 'string' && import.meta.url) {
      return path.dirname(path.dirname(fileURLToPath(import.meta.url)))
    }
  } catch {
    /* ignore */
  }
  return path.join(process.cwd(), 'server')
}

const DATA_DIR = path.join(resolveServerDir(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'cms.json')

export function getJsonPath() {
  return DATA_FILE
}

export async function loadJson(createEmpty) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    const initial = createEmpty()
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2))
    return initial
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

export async function saveJson(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  return data
}
