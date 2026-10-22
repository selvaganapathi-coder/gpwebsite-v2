import 'dotenv/config'
import { createApp } from './app.js'

const PORT = Number(process.env.PORT) || 3001
const localUrl = `http://localhost:${PORT}`

const app = await createApp()
app.listen(PORT, async () => {
  console.log(`GP Pharmacy CMS API listening on ${localUrl}`)
  console.log(`Health: ${localUrl}/api/health`)
  console.log(`Admin UI (Vite): http://localhost:5173/admin`)
  try {
    const { describeStorage, getStorageMode } = await import('./storage/config.js')
    console.log(`CMS storage: ${getStorageMode()} → ${describeStorage()}`)
  } catch {
    /* ignore */
  }
})
