import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFadeUp } from '../../hooks/useFadeUp'
import { getCareerTopicDetail } from '../../data/careerTopics'

function FadeUp({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

const PREVIEW_COUNT = 6

export default function CareerPaths({ outcomes }) {
  const titleId = useId()
  const detailId = useId()
  const [openAll, setOpenAll] = useState(false)
  const [active, setActive] = useState(null)

  const groups = outcomes?.groups || []
  const featured = groups.find((g) => g.featured || g.id === 'opportunities') || groups[0]
  const previewTopics = (featured?.topics || []).slice(0, PREVIEW_COUNT)
  const totalPaths = useMemo(
    () => groups.reduce((sum, g) => sum + (g.topics?.length || 0), 0),
    [groups],
  )

  useEffect(() => {
    if (!openAll && !active) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (active) setActive(null)
        else setOpenAll(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [openAll, active])

  const openTopic = (topic, groupTitle) => {
    const info = getCareerTopicDetail(topic)
    setActive({
      title: topic,
      group: groupTitle,
      blurb: info.blurb,
      detail: info.detail,
    })
  }

  const closeDetail = () => setActive(null)
  const closeAll = () => {
    setActive(null)
    setOpenAll(false)
  }

  return (
    <section className="home-careers section space" id="homeOutcomes" aria-label="Pharmacy career topics">
      <div className="container">
        <FadeUp className="home-careers__intro home-careers__intro--compact">
          <div className="home-careers__intro-copy">
            <p className="home-section-eyebrow">{outcomes?.eyebrow || 'After GP'}</p>
            <h2 className="section__title" id={titleId}>
              {outcomes?.title || 'Pharmacy careers'}
            </h2>
            {outcomes?.lead ? <p className="home-careers__lead">{outcomes.lead}</p> : null}
            <p className="home-careers__meta">
              <strong>{totalPaths}</strong> career paths · <strong>{groups.length}</strong> categories
            </p>
          </div>
          <div className="home-careers__actions">
            <button type="button" className="home-careers__cta home-careers__cta--ghost" onClick={() => setOpenAll(true)}>
              View all
            </button>
            <Link to={outcomes?.linkHref || '/placements'} className="home-careers__cta">
              {outcomes?.linkText || 'Placements →'}
            </Link>
          </div>
        </FadeUp>

        <FadeUp className="home-careers__compact">
          <div className="home-careers__cats" role="list">
            {groups.map((group, i) => (
              <button
                key={group.id}
                type="button"
                className="home-careers__cat"
                role="listitem"
                onClick={() => setOpenAll(true)}
              >
                <em>{String(i + 1).padStart(2, '0')}</em>
                <span>{group.title}</span>
                <strong>{group.topics.length}</strong>
              </button>
            ))}
          </div>

          <div className="home-careers__preview">
            <p className="home-careers__preview-label">Popular paths</p>
            <ul className="home-careers__preview-list">
              {previewTopics.map((topic) => (
                <li key={topic}>
                  <button type="button" onClick={() => openTopic(topic, featured?.title)}>
                    {topic}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="home-careers__more" onClick={() => setOpenAll(true)}>
              View all {totalPaths} paths →
            </button>
          </div>
        </FadeUp>
      </div>

      {openAll ? (
        <div className="career-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button type="button" className="career-modal__backdrop" aria-label="Close" onClick={closeAll} />
          <div className="career-modal__panel">
            <header className="career-modal__head">
              <div>
                <p className="home-section-eyebrow">After GP</p>
                <h3 className="career-modal__title">All pharmacy career paths</h3>
              </div>
              <button type="button" className="career-modal__close" onClick={closeAll} aria-label="Close">
                ×
              </button>
            </header>

            <div className="career-modal__scroll">
              {groups.map((group, groupIndex) => (
                <section key={group.id} className="career-modal__group">
                  <header className="career-modal__group-head">
                    <em>{String(groupIndex + 1).padStart(2, '0')}</em>
                    <h4>{group.title}</h4>
                    <span>
                      {group.topics.length} path{group.topics.length === 1 ? '' : 's'}
                    </span>
                  </header>
                  <ul className="career-modal__topics">
                    {group.topics.map((topic, i) => (
                      <li key={topic}>
                        <button type="button" onClick={() => openTopic(topic, group.title)}>
                          <em>{String(i + 1).padStart(2, '0')}</em>
                          <span>{topic}</span>
                          <small>Explain →</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="career-detail" role="dialog" aria-modal="true" aria-labelledby={detailId}>
          <button type="button" className="career-detail__backdrop" aria-label="Close explanation" onClick={closeDetail} />
          <aside className="career-detail__panel">
            <button type="button" className="career-detail__close" onClick={closeDetail} aria-label="Close">
              ×
            </button>
            {active.group ? <p className="career-detail__group">{active.group}</p> : null}
            <h3 className="career-detail__title" id={detailId}>
              {active.title}
            </h3>
            <p className="career-detail__blurb">{active.blurb}</p>
            <div className="career-detail__body">
              <p>{active.detail}</p>
            </div>
            <div className="career-detail__actions">
              <Link to="/placements" className="btn btn--red" onClick={closeAll}>
                Placements →
              </Link>
              <Link to="/contact" className="btn btn--amber" onClick={closeAll}>
                Talk to Admin →
              </Link>
              <button type="button" className="btn btn--outline-dark" onClick={closeDetail}>
                Back
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  )
}
