const TOKEN_KEY = 'gp_cms_token'
const USER_KEY = 'gp_cms_user'
export const CMS_CHANNEL = 'gp-cms-updated'

export function getApiBase() {
  return import.meta.env.VITE_CMS_API_URL || ''
}

function apiUrl(path) {
  return `${getApiBase()}${path}`
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function getAdminUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export async function logout() {
  const token = getToken()
  try {
    if (token) {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
    }
  } catch {
    /* ignore network errors on logout */
  } finally {
    clearSession()
  }
}

export function notifyCmsUpdated(updatedAt) {
  const stamp = updatedAt || new Date().toISOString()
  try {
    localStorage.setItem(CMS_CHANNEL, stamp)
  } catch {
    /* ignore */
  }
  try {
    const ch = new BroadcastChannel(CMS_CHANNEL)
    ch.postMessage({ updatedAt: stamp })
    ch.close()
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new CustomEvent(CMS_CHANNEL, { detail: { updatedAt: stamp } }))
  } catch {
    /* ignore */
  }
}

export async function login(email, password) {
  let res
  try {
    res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new Error('Cannot reach CMS API. Start the server (port 3001), then try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Login failed')
  sessionStorage.setItem(TOKEN_KEY, data.token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data
}

export async function fetchAdminContent() {
  const token = getToken()
  if (!token) throw new Error('Not signed in')
  const res = await fetch(apiUrl('/api/content'), {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (res.status === 401) {
    clearSession()
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error('Could not load content')
  return res.json()
}

export async function saveAdminContent(content, { mode = 'publish' } = {}) {
  const token = getToken()
  if (!token) throw new Error('Not signed in')
  const res = await fetch(apiUrl('/api/content'), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ ...content, _publishMode: mode }),
  })
  if (res.status === 401) {
    clearSession()
    throw new Error('Session expired')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Save failed')
  if (mode === 'publish') notifyCmsUpdated(data.updatedAt)
  return data
}

import { compressImageForWeb } from './compressImage'

export async function uploadImage(file) {
  const token = getToken()
  if (!token) throw new Error('Not signed in')
  const optimized = await compressImageForWeb(file)
  const body = new FormData()
  body.append('file', optimized)
  const res = await fetch(apiUrl('/api/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    clearSession()
    throw new Error('Session expired')
  }
  if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')
  return data
}

export async function submitEnquiry(payload) {
  const res = await fetch(apiUrl('/api/enquiries'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not submit enquiry')
  return data
}

export async function updateEnquiryStatus(id, status) {
  const token = getToken()
  if (!token) throw new Error('Not signed in')
  const res = await fetch(apiUrl(`/api/enquiries/${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  if (res.status === 401) {
    clearSession()
    throw new Error('Session expired')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Update failed')
  return data
}

export async function fetchPublicContent() {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch(apiUrl('/api/content/public'), {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`CMS ${res.status}`)
    return res.json()
  } finally {
    window.clearTimeout(timer)
  }
}

export async function fetchCmsHealth() {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), 3000)
  try {
    const res = await fetch(apiUrl('/api/health'), {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error('health failed')
    return res.json()
  } finally {
    window.clearTimeout(timer)
  }
}
