import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import { categoryLabel, formatEventDate, whatsappUrl } from '../lib/site'
import { useFadeUp } from '../hooks/useFadeUp'
import MediaSubnav from '../components/media/MediaSubnav'
import PageHero from '../components/media/PageHero'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'academic', label: 'Academic' },
  { id: 'seminar', label: 'Seminar' },
  { id: 'workshop', label: 'Workshop' },
]

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function EventsPage() {
  const { events, site, gallery } = useCms()
  const { open } = useStoryPopup()
  const [filter, setFilter] = useState('all')

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const eventImages = useMemo(
    () => gallery.filter((g) => g.category === 'events' || g.category === 'pharmacy-week'),
    [gallery],
  )

  const items = useMemo(() => {
    const list = filter === 'all' ? events : events.filter((e) => e.category === filter)
    return [...list]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((ev, i) =>
        toStoryItem(
          {
            ...ev,
            image: ev.image || (eventImages.length ? eventImages[i % eventImages.length]?.src : '') || '',
            summary: ev.summary,
          },
          {
            categoryLabel: categoryLabel(ev.category),
            ctaTo: '/admissions',
            ctaLabel: 'Talk to Admin →',
          },
        ),
      )
  }, [events, filter, eventImages])

  const upcoming = items.filter((e) => new Date(`${e.date}T00:00:00`) >= today)
  const past = items.filter((e) => new Date(`${e.date}T00:00:00`) < today)

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Media' }, { label: 'Events' }]}
        title="Events"
        subtitle="Seminars, workshops & campus activities — click an event to learn more"
      />
      <MediaSubnav />

      <section className="events-calendar section" aria-labelledby="events-calendar-title">
        <div className="container">
          <div className="events-calendar__panel">
            <Fade className="section__header section__header--left events-calendar__header">
              <p className="home-section-eyebrow">Calendar</p>
              <h2 className="section__title" id="events-calendar-title">
                Upcoming Events
              </h2>
              <p className="section__desc">
                Plan a campus visit or join training sessions — Counselling Code {site.code}.
              </p>
            </Fade>

            <Fade className="events-calendar__filters" role="tablist" aria-label="Filter events">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={`events-calendar__filter${filter === f.id ? ' is-active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </Fade>

            <div className="events-calendar__list anim-stagger fade-up">
              {upcoming.length === 0 ? (
                <div className="events-calendar__empty">
                  <p>No upcoming events in this category right now.</p>
                  <div className="events-calendar__empty-actions">
                    <a href={`tel:${site.phone}`} className="btn btn--red">
                      Call to schedule a visit
                    </a>
                    <a
                      href={whatsappUrl()}
                      className="btn btn--amber"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Admin
                    </a>
                  </div>
                </div>
              ) : (
                upcoming.map((ev, i) => {
                  const d = formatEventDate(ev.date)
                  return (
                    <article
                      key={ev.id}
                      className={`events-cal-item${i === 0 ? ' events-cal-item--next' : ''} events-cal-item--clickable`}
                      role="button"
                      tabIndex={0}
                      onClick={() => open(ev, items)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          open(ev, items)
                        }
                      }}
                    >
                      <time className="events-cal-item__date" dateTime={ev.date}>
                        <strong>{d.day}</strong>
                        <span>{d.month.slice(0, 3)}</span>
                        <em>{d.year}</em>
                      </time>
                      <div className="events-cal-item__rail" aria-hidden="true" />
                      <div className="events-cal-item__body">
                        <span className="events-cal-item__cat">{categoryLabel(ev.category)}</span>
                        <h3 className="events-cal-item__title">{ev.title}</h3>
                        {ev.summary ? <p className="events-cal-item__text">{ev.summary}</p> : null}
                        <div className="events-cal-item__actions">
                          <span className="btn btn--outline-dark">View details →</span>
                          <a
                            href={whatsappUrl(`Hi, I want details about: ${ev.title}`)}
                            className="btn btn--amber"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>

            {past.length > 0 ? (
              <Fade className="events-calendar__past">
                <h3 className="events-calendar__past-title">Recent on campus</h3>
                <ul className="events-calendar__past-list">
                  {past.map((ev) => {
                    const d = formatEventDate(ev.date)
                    return (
                      <li key={ev.id}>
                        <button
                          type="button"
                          className="events-calendar__past-btn"
                          onClick={() => open(ev, items)}
                        >
                          <time dateTime={ev.date}>
                            {d.day} {d.month.slice(0, 3)} {d.year}
                          </time>
                          <span>{ev.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </Fade>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-cta-band" aria-label="Visit campus">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Want to visit campus?</h2>
            <p>Schedule a lab and hostel tour with the office — Code {site.code}.</p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/admissions" className="btn btn--light btn--lg">
              Talk to Admin →
            </Link>
            <Link to="/gallery" className="btn btn--outline-light btn--lg">
              Browse gallery →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
