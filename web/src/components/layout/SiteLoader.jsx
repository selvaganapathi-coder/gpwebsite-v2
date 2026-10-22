import { useCallback, useEffect, useState } from 'react'
import { useCms } from '../../context/CmsContext'

const SLOW_MS = 2500
const FORCE_OPEN_MS = 4500

async function probeLocal() {
  try {
    const res = await fetch(`/api/health?_=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    return res.ok
  } catch {
    try {
      const res = await fetch(`/?_=${Date.now()}`, { cache: 'no-store', method: 'HEAD' })
      return res.ok
    } catch {
      return false
    }
  }
}

export default function SiteLoader() {
  const { status, refresh, site } = useCms()
  const [online, setOnline] = useState(true)
  const [slow, setSlow] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const syncOnline = async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        // Browser may lie about offline on localhost — verify locally first
        const ok = await probeLocal()
        if (!cancelled) setOnline(ok)
        return
      }
      if (!cancelled) setOnline(true)
    }

    syncOnline()

    const on = () => {
      setOnline(true)
      refresh()
    }
    const off = () => {
      // Confirm before locking the UI
      probeLocal().then((ok) => {
        if (!cancelled) setOnline(ok)
      })
    }

    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      cancelled = true
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [refresh])

  useEffect(() => {
    if (status !== 'loading') {
      setSlow(false)
      setRetrying(false)
      setForceOpen(false)
      return undefined
    }
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_MS)
    const openTimer = window.setTimeout(() => setForceOpen(true), FORCE_OPEN_MS)
    return () => {
      window.clearTimeout(slowTimer)
      window.clearTimeout(openTimer)
    }
  }, [status])

  useEffect(() => {
    document.getElementById('boot-loader')?.remove()
  }, [])

  const unreachable = !online
  const waiting = (status === 'loading' || retrying) && !forceOpen
  const showLoader = unreachable || waiting

  const handleGo = useCallback(async () => {
    setRetrying(true)
    setSlow(false)
    try {
      const ok = await probeLocal()
      setOnline(ok)
      if (ok) await refresh()
      else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        window.location.reload()
      }
    } finally {
      setRetrying(false)
    }
  }, [refresh])

  const handleHome = useCallback(() => {
    window.location.assign('/')
  }, [])

  if (!showLoader) return null

  const brand = site?.name || 'G.P. COLLEGE'
  const tag = site?.tag || 'Tirupattur · Code 889'

  return (
    <div
      className="site-loader"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-busy={waiting}
      aria-label={unreachable ? 'Site not reachable' : 'Loading'}
    >
      <div className="site-loader__card">
        <p className="site-loader__brand">{brand}</p>
        <p className="site-loader__tag">{tag}</p>

        {!unreachable && <div className="site-loader__spinner" aria-hidden="true" />}

        {unreachable ? (
          <>
            <p className="site-loader__msg">Site not reachable. Check your connection, then tap Go.</p>
            <p className="site-loader__hint">
              Local site: make sure Vite (5173) and CMS (3001) are running.
            </p>
            <div className="site-loader__actions">
              <button type="button" className="site-loader__btn site-loader__btn--go" onClick={handleGo}>
                Go
              </button>
              <button
                type="button"
                className="site-loader__btn site-loader__btn--ghost"
                onClick={handleHome}
              >
                Home
              </button>
            </div>
          </>
        ) : slow ? (
          <>
            <p className="site-loader__msg">Still loading… connection seems slow.</p>
            <p className="site-loader__hint">Tap Go to retry opening the site.</p>
            <div className="site-loader__actions">
              <button type="button" className="site-loader__btn site-loader__btn--go" onClick={handleGo}>
                Go
              </button>
            </div>
          </>
        ) : (
          <p className="site-loader__msg">Loading pages…</p>
        )}
      </div>
    </div>
  )
}
