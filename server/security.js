/**
 * Security middleware for the CMS API — headers, rate limits, login lockout.
 */

const loginAttempts = new Map()
const routeHits = new Map()

function clientKey(req) {
  const xf = req.headers['x-forwarded-for']
  const ip = (typeof xf === 'string' ? xf.split(',')[0] : '') || req.ip || req.socket?.remoteAddress || 'unknown'
  return String(ip).trim()
}

function pruneMap(map, maxAgeMs) {
  const now = Date.now()
  for (const [key, value] of map.entries()) {
    const stamp = value.resetAt || value.until || 0
    if (stamp && stamp < now - maxAgeMs) map.delete(key)
  }
}

/** Express-compatible rate limiter (in-memory; fine for single/warm instances). */
export function rateLimit({ windowMs = 60_000, max = 60, message = 'Too many requests. Try again later.' } = {}) {
  return (req, res, next) => {
    pruneMap(routeHits, windowMs * 2)
    const key = `${req.path}:${clientKey(req)}`
    const now = Date.now()
    let entry = routeHits.get(key)
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs }
      routeHits.set(key, entry)
    }
    entry.count += 1
    res.setHeader('X-RateLimit-Limit', String(max))
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)))
    if (entry.count > max) {
      res.status(429).json({ error: message })
      return
    }
    next()
  }
}

/** Track failed logins; lock after threshold. */
export function checkLoginAllowed(email, req) {
  pruneMap(loginAttempts, 60 * 60_000)
  const key = `${clientKey(req)}:${String(email || '').toLowerCase()}`
  const entry = loginAttempts.get(key)
  if (entry?.until && entry.until > Date.now()) {
    const mins = Math.ceil((entry.until - Date.now()) / 60_000)
    return { ok: false, error: `Too many failed sign-ins. Try again in ${mins} minute(s).` }
  }
  return { ok: true, key }
}

export function recordLoginFailure(key) {
  const now = Date.now()
  const entry = loginAttempts.get(key) || { fails: 0, until: 0 }
  entry.fails += 1
  if (entry.fails >= 5) {
    entry.until = now + 15 * 60_000
    entry.fails = 0
  }
  loginAttempts.set(key, entry)
}

export function clearLoginFailures(key) {
  loginAttempts.delete(key)
}

/** Security headers for API responses. */
export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  res.removeHeader('X-Powered-By')
  if (process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  next()
}

/** Block obvious path traversal / null bytes on params. */
export function safeParams(req, res, next) {
  const name = req.params?.name
  if (name && (name.includes('..') || name.includes('\0') || name.includes('/') || name.includes('\\'))) {
    res.status(400).json({ error: 'Invalid path.' })
    return
  }
  next()
}
