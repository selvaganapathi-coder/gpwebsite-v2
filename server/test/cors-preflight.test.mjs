import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { after, test } from 'node:test'

process.env.NODE_ENV = 'test'
process.env.CMS_STORAGE = 'memory'
process.env.VERCEL = '1'
process.env.JWT_SECRET = 'test-jwt-secret-must-be-32-characters-min'
delete process.env.MONGODB_URI

const { createApp } = await import('../app.js')
const app = await createApp()
const server = createServer(app)
await new Promise((resolve, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', resolve)
})
const base = `http://127.0.0.1:${server.address().port}`

after(() => new Promise((resolve) => server.close(resolve)))

async function preflight(pathname, requestHeaders) {
  return fetch(`${base}${pathname}`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://gpwebsite-v2.vercel.app',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': requestHeaders,
    },
  })
}

test('preflight from the public site allows cache-control', async () => {
  for (const pathname of ['/api/content/public', '/api/health']) {
    const res = await preflight(pathname, 'cache-control')
    assert.ok(res.status < 400, `${pathname} status ${res.status}`)
    assert.equal(
      res.headers.get('access-control-allow-origin'),
      'https://gpwebsite-v2.vercel.app',
    )
    const allow = (res.headers.get('access-control-allow-headers') || '').toLowerCase()
    assert.ok(allow.includes('cache-control'), `${pathname} allowed headers: ${allow}`)
  }

  const pragma = await preflight('/api/content/public', 'cache-control, pragma')
  assert.ok(pragma.status < 400, `pragma preflight status ${pragma.status}`)
  const allow = (pragma.headers.get('access-control-allow-headers') || '').toLowerCase()
  assert.ok(allow.includes('cache-control'), allow)
  assert.ok(allow.includes('pragma'), allow)
})
