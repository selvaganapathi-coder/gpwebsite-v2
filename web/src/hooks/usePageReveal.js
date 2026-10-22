import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Site-wide scroll reveal for .fade-up / .slidein* / .anim-reveal
 * Re-runs on every route change so all pages get the same motion.
 */
export function usePageReveal(enabled = true) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const selector = '.fade-up, .slideinup, .slideinleft, .slideinright, .anim-reveal'

    const mark = (el) => {
      el.classList.add('visible', 'as-animated')
    }

    // Allow React to paint the new route first
    let observer
    const timer = window.setTimeout(() => {
      const nodes = [...document.querySelectorAll(selector)]

      if (reduced) {
        nodes.forEach(mark)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            mark(entry.target)
            observer.unobserve(entry.target)
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      )

      nodes.forEach((el) => {
        if (el.classList.contains('visible')) return
        observer.observe(el)
      })
    }, 40)

    return () => {
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [pathname, enabled])
}
