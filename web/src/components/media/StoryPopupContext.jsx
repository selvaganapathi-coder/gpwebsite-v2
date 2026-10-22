import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ImageStoryPopup from '../media/ImageStoryPopup'

const StoryPopupContext = createContext(null)

export function StoryPopupProvider({ children }) {
  const [item, setItem] = useState(null)
  const [list, setList] = useState([])
  const [index, setIndex] = useState(-1)

  const close = useCallback(() => {
    setItem(null)
    setList([])
    setIndex(-1)
  }, [])

  const open = useCallback((next, siblings) => {
    if (!next) return
    const pack = Array.isArray(siblings) && siblings.length ? siblings : [next]
    const i = Math.max(
      0,
      pack.findIndex((x) => (x.id && next.id ? x.id === next.id : x === next)),
    )
    setList(pack)
    setIndex(i)
    setItem(pack[i] || next)
  }, [])

  const prev = useCallback(() => {
    if (list.length < 2) return
    setIndex((i) => {
      const n = (i - 1 + list.length) % list.length
      setItem(list[n])
      return n
    })
  }, [list])

  const next = useCallback(() => {
    if (list.length < 2) return
    setIndex((i) => {
      const n = (i + 1) % list.length
      setItem(list[n])
      return n
    })
  }, [list])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <StoryPopupContext.Provider value={value}>
      {children}
      <ImageStoryPopup
        item={item}
        onClose={close}
        onPrev={list.length > 1 ? prev : undefined}
        onNext={list.length > 1 ? next : undefined}
      />
    </StoryPopupContext.Provider>
  )
}

export function useStoryPopup() {
  const ctx = useContext(StoryPopupContext)
  if (!ctx) {
    return {
      open: () => {},
      close: () => {},
    }
  }
  return ctx
}

/** Normalize campus / activity / gallery / news items for the popup. */
export function toStoryItem(raw = {}, extras = {}) {
  return {
    id: raw.id || raw.title || raw.label,
    title: raw.title || raw.label || raw.name || 'Campus moment',
    src: raw.src || raw.image || raw.url,
    image: raw.image || raw.src || raw.url,
    description: raw.description || raw.summary || raw.excerpt || raw.body || raw.text || extras.description,
    category: raw.category,
    categoryLabel: raw.categoryLabel || extras.categoryLabel || raw.category,
    date: raw.date,
    ctaTo: extras.ctaTo || raw.ctaTo || '/admissions',
    ctaLabel: extras.ctaLabel || raw.ctaLabel || 'Talk to Admin →',
    ...extras,
  }
}
