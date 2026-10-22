/**
 * Sanitize CMS payload strings — strip script/event-handler XSS vectors.
 */

const DANGEROUS_ATTR = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
const SCRIPT_TAG = /<\s*\/?\s*script\b[^>]*>/gi
const IFRAME_TAG = /<\s*\/?\s*iframe\b[^>]*>/gi
const OBJECT_TAG = /<\s*\/?\s*(object|embed|link|meta|base)\b[^>]*>/gi
const JS_URL = /(href|src|action)\s*=\s*(["'])\s*javascript:[^"']*\2/gi
const DATA_HTML = /(href|src)\s*=\s*(["'])\s*data:text\/html[^"']*\2/gi

export function sanitizeString(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(SCRIPT_TAG, '')
    .replace(IFRAME_TAG, '')
    .replace(OBJECT_TAG, '')
    .replace(DANGEROUS_ATTR, '')
    .replace(JS_URL, '$1=$2#$2')
    .replace(DATA_HTML, '$1=$2#$2')
}

export function sanitizeDeep(input, depth = 0) {
  if (depth > 12) return input
  if (typeof input === 'string') return sanitizeString(input)
  if (Array.isArray(input)) return input.map((item) => sanitizeDeep(item, depth + 1))
  if (input && typeof input === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(input)) {
      if (key === 'passwordHash' || key === 'password') {
        out[key] = value
        continue
      }
      out[key] = sanitizeDeep(value, depth + 1)
    }
    return out
  }
  return input
}
