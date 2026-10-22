import { useEffect } from 'react'
import { categoryLabel, formatEventDate } from '../../lib/site'

/**
 * Image / event story popup — photo + short explanation.
 */
export default function ImageStoryPopup({
  item,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    if (!item) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose, onPrev, onNext])

  if (!item) return null

  const src = item.src || item.image || item.url
  const title = item.title || 'Campus moment'
  const category = item.categoryLabel || (item.category ? categoryLabel(item.category) : '')
  const description =
    item.description ||
    item.summary ||
    item.excerpt ||
    item.caption ||
    'A moment from campus life at G.P. COLLEGE — labs, learning, and student activities.'
  const date = item.date ? formatEventDate(item.date) : null

  return (
    <div
      className="story-popup is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-popup-title"
      onClick={onClose}
    >
      <button type="button" className="story-popup__backdrop" aria-label="Close" onClick={onClose} />

      <div
        className="story-popup__panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="story-popup__close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {onPrev ? (
          <button type="button" className="story-popup__nav story-popup__nav--prev" aria-label="Previous" onClick={onPrev}>
            ‹
          </button>
        ) : null}
        {onNext ? (
          <button type="button" className="story-popup__nav story-popup__nav--next" aria-label="Next" onClick={onNext}>
            ›
          </button>
        ) : null}

        <div className="story-popup__grid">
          <figure className="story-popup__media">
            {src ? <img src={src} alt={title} /> : <div className="story-popup__media-empty" aria-hidden="true" />}
          </figure>

          <div className="story-popup__body">
            {category ? <p className="story-popup__eyebrow">{category}</p> : null}
            <h2 id="story-popup-title" className="story-popup__title">
              {title}
            </h2>
            {date ? (
              <time className="story-popup__date" dateTime={item.date}>
                {date.day} {date.month} {date.year}
              </time>
            ) : null}
            <p className="story-popup__text">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
