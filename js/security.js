/**
 * G.P. Pharmacy College — Client Security Utilities
 * XSS prevention, URL validation, password hashing, session integrity
 */
(function (global) {
  const PEPPER = 'gp-cms-pepper-v2';
  const SESSION_SECRET = 'gp-session-v2';

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, '&#96;');
  }

  function sanitizeUrl(url, { allowRelative = true, allowMailto = false, allowTel = false } = {}) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
    if (allowRelative && !/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      if (/^[a-z0-9./?_#-]+$/i.test(trimmed)) return trimmed;
      return '';
    }
    try {
      const parsed = new URL(trimmed, global.location?.origin || 'https://gppharmacycollege.com');
      if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:' || parsed.protocol === 'vbscript:') {
        return '';
      }
      if (parsed.protocol === 'https:') return parsed.href;
      if (allowMailto && parsed.protocol === 'mailto:') return parsed.href;
      if (allowTel && parsed.protocol === 'tel:') return parsed.href;
      if (allowRelative && parsed.protocol === 'http:' && parsed.hostname === 'localhost') return parsed.href;
    } catch {
      return '';
    }
    return '';
  }

  function sanitizeImageUrl(url) {
    const safe = sanitizeUrl(url, { allowRelative: true });
    if (!safe) return '';
    if (safe.startsWith('data:image/')) return safe;
    return safe;
  }

  function sanitizeTel(raw) {
    if (!raw) return '';
    const digits = String(raw).replace(/[^\d+]/g, '');
    return digits ? `tel:${digits}` : '';
  }

  function sanitizeEmail(raw) {
    if (!raw || typeof raw !== 'string') return '';
    const email = raw.trim();
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return '';
    return `mailto:${email}`;
  }

  function stripScripts(html) {
    if (!html) return '';
    return String(html)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');
  }

  async function hashPassword(password, userId) {
    const enc = new TextEncoder();
    const data = enc.encode(`${PEPPER}:${userId}:${password}`);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function verifyPassword(password, userId, passwordHash) {
    if (!password || !passwordHash) return false;
    const hash = await hashPassword(password, userId);
    return hash === passwordHash;
  }

  async function signSession(session) {
    const payload = JSON.stringify({
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      at: session.at,
    });
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    const sig = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    return { ...session, sig };
  }

  async function verifySessionSignature(session) {
    if (!session?.sig) return false;
    const { sig, ...rest } = session;
    const signed = await signSession(rest);
    return signed.sig === sig;
  }

  const LOGIN_KEY = 'gp_login_lock';
  const MAX_ATTEMPTS = 5;
  const LOCK_MS = 15 * 60 * 1000;

  function getLoginLock() {
    try {
      return JSON.parse(localStorage.getItem(LOGIN_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function isLoginLocked() {
    const lock = getLoginLock();
    if (lock.until && Date.now() < lock.until) {
      return { locked: true, until: lock.until };
    }
    return { locked: false };
  }

  function recordLoginFailure() {
    const lock = getLoginLock();
    const attempts = (lock.attempts || 0) + 1;
    const next = { attempts };
    if (attempts >= MAX_ATTEMPTS) {
      next.until = Date.now() + LOCK_MS;
      next.attempts = 0;
    }
    localStorage.setItem(LOGIN_KEY, JSON.stringify(next));
    return next;
  }

  function clearLoginFailures() {
    localStorage.removeItem(LOGIN_KEY);
  }

  function sanitizeImportData(parsed) {
    if (!parsed || typeof parsed !== 'object') return null;
    const clean = JSON.parse(JSON.stringify(parsed));
    if (Array.isArray(clean.users)) {
      clean.users = clean.users.map(u => {
        const { password, ...rest } = u;
        return rest;
      });
    }
    return clean;
  }

  function lockPublicWrites(api, getSession) {
    if (document.body?.classList?.contains('cms-body')) return;
    const guarded = ['create', 'update', 'remove', 'togglePublish', 'setSection', 'createInSection',
      'updateInSection', 'removeFromSection', 'toggleInSection', 'createUser', 'updateUser', 'removeUser',
      'importJSON', 'reset'];
    guarded.forEach(method => {
      if (typeof api[method] !== 'function') return;
      const original = api[method].bind(api);
      api[method] = (...args) => {
        if (!getSession()) {
          console.warn('[GPCMS] Write blocked — admin login required.');
          return null;
        }
        return original(...args);
      };
    });
  }

  global.GPSecurity = {
    escapeHtml,
    escapeAttr,
    sanitizeUrl,
    sanitizeImageUrl,
    sanitizeTel,
    sanitizeEmail,
    stripScripts,
    hashPassword,
    verifyPassword,
    signSession,
    verifySessionSignature,
    isLoginLocked,
    recordLoginFailure,
    clearLoginFailures,
    sanitizeImportData,
    lockPublicWrites,
    MAX_LOGIN_ATTEMPTS: MAX_ATTEMPTS,
    LOCK_MS,
  };
})(window);
