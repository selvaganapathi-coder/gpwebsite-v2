import { useEffect } from 'react'

/**
 * Soft content protection for the public site only (Admin stays free).
 * Watermark + blur-on-leave + block save/copy. OS screenshots cannot be fully blocked.
 */
export default function ContentProtect({ enabled, site }) {
  const mark = `${site?.name || 'G.P. COLLEGE'} · Code ${site?.code || '889'}`

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('content-protect', 'content-protect--away')
      document.documentElement.style.removeProperty('--gp-watermark')
      return undefined
    }

    document.documentElement.classList.add('content-protect')
    document.documentElement.style.setProperty('--gp-watermark', `"${mark.replace(/"/g, '')}"`)

    const onContextMenu = (e) => {
      // Allow native menus inside text fields so staff can still paste/edit
      const t = e.target
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
    }

    const onDragStart = (e) => {
      const t = e.target
      if (t && (t.tagName === 'IMG' || t.closest?.('img, picture, .content-protect-media'))) {
        e.preventDefault()
      }
    }

    const onSelectStart = (e) => {
      const t = e.target
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (t && (t.tagName === 'IMG' || t.closest?.('img, picture, svg, .content-protect-media'))) {
        e.preventDefault()
      }
    }

    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase?.() || ''
      const mod = e.ctrlKey || e.metaKey
      const inField = e.target?.closest?.('input, textarea, select, [contenteditable="true"]')

      // Never block typing shortcuts inside form fields
      if (inField && mod && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key)) return

      if (mod && ['s', 'u', 'p'].includes(key)) {
        e.preventDefault()
        return
      }
      if (mod && e.shiftKey && ['i', 'j', 'c'].includes(key)) {
        e.preventDefault()
        return
      }
      if (key === 'f12') {
        e.preventDefault()
        return
      }

      if (key === 'printscreen') {
        e.preventDefault()
        setAway(true)
        flashBlank()
        try {
          navigator.clipboard?.writeText?.('')
        } catch {
          /* ignore */
        }
        window.setTimeout(() => setAway(false), 800)
      }
    }

    const onCopy = (e) => {
      const t = e.target
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (t && (t.tagName === 'IMG' || t.closest?.('img, picture'))) {
        e.preventDefault()
      }
    }

    const setAway = (away) => {
      document.documentElement.classList.toggle('content-protect--away', away)
    }

    const onVisibility = () => {
      setAway(document.visibilityState !== 'visible')
    }

    const onBlur = () => setAway(true)
    const onFocus = () => {
      if (document.visibilityState === 'visible') setAway(false)
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('selectstart', onSelectStart)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('copy', onCopy)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      document.documentElement.classList.remove('content-protect', 'content-protect--away')
      document.documentElement.style.removeProperty('--gp-watermark')
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('selectstart', onSelectStart)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.getElementById('gp-protect-flash')?.remove()
    }
  }, [enabled, mark])

  return null
}

function flashBlank() {
  let el = document.getElementById('gp-protect-flash')
  if (!el) {
    el = document.createElement('div')
    el.id = 'gp-protect-flash'
    el.setAttribute('aria-hidden', 'true')
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      background: '#0a0a0a',
      pointerEvents: 'none',
      opacity: '1',
      transition: 'opacity 0.35s ease',
    })
    document.body.appendChild(el)
  }
  el.style.opacity = '1'
  window.setTimeout(() => {
    if (!el) return
    el.style.opacity = '0'
    window.setTimeout(() => el?.remove(), 400)
  }, 600)
}
