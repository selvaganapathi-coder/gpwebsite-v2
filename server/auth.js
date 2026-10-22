import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

function resolveJwtSecret() {
  const fromEnv = process.env.JWT_SECRET?.trim()
  if (fromEnv && fromEnv.length >= 24 && fromEnv !== 'gp-cms-dev-secret-change-me') {
    return fromEnv
  }
  if (process.env.NETLIFY === 'true' || process.env.NODE_ENV === 'production') {
    console.error(
      '[security] JWT_SECRET is missing or weak. Set a long random JWT_SECRET in the environment.',
    )
  }
  if (!globalThis.__gpJwtDevSecret) {
    globalThis.__gpJwtDevSecret = crypto.randomBytes(48).toString('hex')
    console.warn('[security] Using ephemeral JWT secret for this process (dev only).')
  }
  return globalThis.__gpJwtDevSecret
}

const JWT_SECRET = resolveJwtSecret()
const JWT_EXPIRY = process.env.JWT_EXPIRY || '4h'
const BCRYPT_ROUNDS = 12

export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY },
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
    const payload = jwt.verify(token, JWT_SECRET)
    if (!payload?.sub || !payload?.role) {
      res.status(401).json({ error: 'Invalid session.' })
      return
    }
    req.user = payload
    next()
  } catch {
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

export async function ensureDefaultUsers(store) {
  if (store.users?.length) return store

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
  return store
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
