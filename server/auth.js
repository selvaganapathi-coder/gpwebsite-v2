import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const WEAK_SECRETS = new Set(['', 'gp-cms-dev-secret-change-me', 'change-me', 'secret'])

function isHostedRuntime() {
  return (
    process.env.VERCEL === '1' ||
    process.env.VERCEL === 'true' ||
    process.env.NETLIFY === 'true' ||
    process.env.NODE_ENV === 'production'
  )
}

/**
 * Read the signing key on every sign/verify. A secret captured once at import,
 * or a random key stored only in process memory, makes tokens from one Vercel
 * instance fail on the next instance.
 */
export function getJwtSecret() {
  const fromEnv = process.env.JWT_SECRET?.trim() || ''
  const strong = fromEnv.length >= 24 && !WEAK_SECRETS.has(fromEnv)
  if (strong) return fromEnv
  if (isHostedRuntime()) {
    throw new Error(
      'JWT_SECRET is missing or too short. Set JWT_SECRET on the API host to a random string of at least 32 characters. Admin sign-in stays disabled until then, because an in-memory secret is not shared across serverless instances.',
    )
  }
  if (!globalThis.__gpJwtDevSecret) {
    globalThis.__gpJwtDevSecret = crypto.randomBytes(48).toString('hex')
    console.warn('[security] Using ephemeral JWT secret for this process (dev only).')
  }
  return globalThis.__gpJwtDevSecret
}

function jwtExpiry() {
  return process.env.JWT_EXPIRY || '4h'
}

function bcryptRounds() {
  return process.env.NODE_ENV === 'test' ? 4 : 12
}

export async function hashPassword(password) {
  return bcrypt.hash(password, bcryptRounds())
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    getJwtSecret(),
    { expiresIn: jwtExpiry() },
  )
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Authentication required.' })
    return
  }
  try {
    const payload = jwt.verify(token, getJwtSecret())
    if (!payload?.sub || !payload?.role) {
      res.status(401).json({ error: 'Invalid session.' })
      return
    }
    req.user = payload
    next()
  } catch (err) {
    if (String(err?.message || '').includes('JWT_SECRET')) {
      res.status(500).json({ error: err.message })
      return
    }
    res.status(401).json({ error: 'Session expired. Please sign in again.' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'You do not have permission for this action.' })
      return
    }
    next()
  }
}

/** Seed the two default accounts only when the user list is empty. Returns true if it wrote users. */
export async function ensureDefaultUsers(store) {
  if (store.users?.length) return false

  store.users = [
    {
      id: 'user-admin',
      name: 'GP Admin',
      email: 'admin@gppharmacycollege.com',
      passwordHash: await hashPassword(process.env.CMS_ADMIN_PASSWORD || 'gpadmin2026'),
      role: 'admin',
      active: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'user-editor',
      name: 'Content Editor',
      email: 'editor@gppharmacycollege.com',
      passwordHash: await hashPassword(process.env.CMS_EDITOR_PASSWORD || 'editor2026'),
      role: 'editor',
      active: true,
      createdAt: '2026-01-01',
    },
  ]
  return true
}

export async function authenticateUser(store, email, password) {
  const normalized = String(email || '').trim().toLowerCase()
  const user = store.users?.find((u) => String(u.email || '').toLowerCase() === normalized && u.active)
  if (!user?.passwordHash) return null
  if (typeof password !== 'string' || password.length < 6 || password.length > 200) return null
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return null
  return user
}
