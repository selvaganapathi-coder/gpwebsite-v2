import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'

export default function Hero({ badge, slides, captions, brand }) {
  const { site } = useCms()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef(null)
  const count = Math.max(slides.length, captions.length, 1)
  const caption = captions[index] || captions[0]
  const brandName = brand || site.name || 'G.P. COLLEGE'

  useEffect(() => {
    if (paused) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 7000)
    return () => clearInterval(timer)
  }, [count, paused])

  useEffect(() => {
    slides.forEach((src, i) => {
      if (!src || i === index) return
      const img = new Image()
      img.src = src
    })
  }, [slides, index])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = Math.min(60, Math.max(-20, -rect.top * 0.18))
      el.style.setProperty('--hero-parallax', `${offset}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (i) => setIndex(((i % count) + count) % count)

  return (
    <section
      ref={rootRef}
      className="hero hero--srec hero--home hero--parallax hero--advanced"
      aria-label={site.name}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      {slides.map((src, i) => (
        <div
          key={src + i}
          className={`hero__slide${i === index ? ' active is-loaded' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
          role="img"
          aria-hidden={i !== index}
          aria-label={i === index ? `${site.name} campus photo ${i + 1}` : undefined}
        >
          <div className="hero__overlay" />
        </div>
      ))}

      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__content hero__content--srec container">
        <div className="hero__captions">
          <div key={index} className="hero__caption active hero__caption-anim">
            <p className="hero__kicker">Tirupattur · Est. 2019 · Code {site.code}</p>
            <p className="hero__brand brand-name">
              <strong>{brandName}</strong>
            </p>
            <span className="hero__rule" aria-hidden="true" />
            <h1 className="hero__title">{caption?.title}</h1>
            <p className="hero__subtitle">{caption?.subtitle}</p>
            <div className="hero__actions">
              <Link to="/admissions" className="btn btn--red btn--lg btn--pulse">
                Talk to Admin
              </Link>
              <Link to="/courses" className="btn btn--light btn--lg">
                View all courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__chrome">
        <p className="hero__index" aria-hidden="true">
          <strong>{String(index + 1).padStart(2, '0')}</strong>
          <span>/</span>
          <em>{String(count).padStart(2, '0')}</em>
        </p>
      </div>

      <button
        type="button"
        className="hero__arrow hero__arrow--prev"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
      >
        <span aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hero__arrow hero__arrow--next"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
      >
        <span aria-hidden="true" />
      </button>
    </section>
  )
}
