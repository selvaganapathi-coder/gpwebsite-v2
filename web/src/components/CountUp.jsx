import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to a numeric value once when scrolled into view.
 * Accepts values like "500+", "16", "2,350+".
 */
export default function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')
  const started = useRef(false)

  const raw = String(value ?? '').trim()
  const match = raw.match(/^([^\d]*)([\d,]+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const digits = match?.[2]?.replace(/,/g, '') ?? ''
  const suffix = match?.[3] ?? (match ? '' : raw)
  const target = Number.parseInt(digits, 10)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (!Number.isFinite(target) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(raw)
      return undefined
    }

    const run = () => {
      if (started.current) return
      started.current = true
      const duration = 1200
      const start = performance.now()

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - (1 - t) ** 3
        const current = Math.round(target * eased)
        setDisplay(`${prefix}${current.toLocaleString('en-IN')}${suffix}`)
        if (t < 1) requestAnimationFrame(tick)
        else setDisplay(raw)
      }

      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          run()
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [raw, target, prefix, suffix])

  if (!Number.isFinite(target)) {
    return <strong className={className}>{raw}</strong>
  }

  return (
    <strong ref={ref} className={`count-up ${className}`.trim()}>
      {display}
    </strong>
  )
}
