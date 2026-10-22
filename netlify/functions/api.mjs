import serverless from 'serverless-http'
import { createApp } from '../../server/app.js'

let cached

async function getHandler() {
  if (!cached) {
    const app = await createApp()
    cached = serverless(app, {
      binary: ['multipart/form-data', 'image/*', 'application/octet-stream'],
    })
  }
  return cached
}

export async function handler(event, context) {
  const h = await getHandler()
  return h(event, context)
}
