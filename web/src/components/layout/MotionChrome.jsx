import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll progress bar + back-to-top — site-wide motion chrome. */
export default function MotionChrome() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)
  const [enterKey, setEnterKey] = useState(0)

  useEffect(() => {
    setEnterKey((k) => k + 1)
    const main = document.getElementById('site-root')
    if (!main) return undefined
    main.classList.remove('page-enter')
    // force reflow
    void main.offsetWidth
    main.classList.add('page-enter')
    const t = window.setTimeout(() => main.classList.remove('page-enter'), 500)
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? (window.scrollY / max) * 100 : 0
      setProgress(Math.min(100, Math.max(0, p)))
      setShowTop(window.scrollY > 480)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const toTop = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [])

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" key={enterKey}>
        <span className="scroll-progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <button
        type="button"
        className={`back-top${showTop ? ' is-visible' : ''}`}
        aria-label="Back to top"
        onClick={toTop}
      >
        ↑
      </button>
    </>
  )
}
