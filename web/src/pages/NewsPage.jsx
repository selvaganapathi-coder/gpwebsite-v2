import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import { categoryLabel, formatEventDate } from '../lib/site'
import { useFadeUp } from '../hooks/useFadeUp'
import MediaSubnav from '../components/media/MediaSubnav'
import PageHero from '../components/media/PageHero'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'admission', label: 'Admission' },
  { id: 'counselling', label: 'Counselling' },
  { id: 'exam', label: 'Examination' },
  { id: 'general', label: 'General' },
]

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function NewsPage() {
  const { notices, news } = useCms()
  const { open } = useStoryPopup()
  const [filter, setFilter] = useState('all')

  const announcements = useMemo(() => {
    if (filter === 'all') return notices
    return notices.filter((n) => n.category === filter)
  }, [notices, filter])

  const stories = useMemo(
    () =>
      [...(news || [])].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)),
    [news],
  )

  const storyPack = useMemo(
    () =>
      stories.map((item) =>
        toStoryItem(item, {
          categoryLabel: 'News',
          ctaTo: '/admissions',
          ctaLabel: 'Talk to Admin →',
          description: item.excerpt || item.summary,
        }),
      ),
    [stories],
  )

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Media' }, { label: 'News' }]}
        title="News & Announcements"
        subtitle="Official notices and campus updates from G.P. COLLEGE"
      />
      <MediaSubnav />

      {notices.length ? (
        <div className="notice-ticker-wrap">
          <div className="container">
            <div className="notice-ticker">
              <span className="notice-ticker__label">Latest</span>
              <div className="notice-ticker__track">
                {notices.slice(0, 6).map((n) => (
                  <Link key={n.id} to={n.link || '/news'} className="notice-ticker__item">
                    {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="section">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Official</p>
            <h2 className="section__title">Announcements</h2>
            <p className="section__desc">
              Admissions, counselling, exams, and college notices — updated from the admin CMS.
            </p>
          </Fade>

          <Fade className="notice-filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`notice-filter${filter === f.id ? ' notice-filter--active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </Fade>

          <div className="media-news-list anim-stagger fade-up">
            {announcements.length === 0 ? (
              <p style={{ color: 'var(--text-light)' }}>No announcements in this category.</p>
            ) : (
              announcements.map((item) => {
                const d = formatEventDate(item.date)
                const urgent = item.urgent || item.priority === 'high'
                return (
                  <article
                    key={item.id}
                    className={`media-news-card${urgent ? ' media-news-card--urgent' : ''}`}
                  >
                    <div className="media-news-card__meta">
                      <span className="media-news-card__cat">{categoryLabel(item.category)}</span>
                      {urgent ? <span className="media-news-card__badge">Urgent</span> : null}
                      <time dateTime={item.date}>
                        {d.day} {d.month} {d.year}
                      </time>
                    </div>
                    <h3>{item.title}</h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                    {item.link ? (
                      <Link to={item.link} className="btn btn--outline-dark">
                        Read more →
                      </Link>
                    ) : null}
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>

      {stories.length ? (
        <section className="section section--soft">
          <div className="container">
            <Fade className="section__header section__header--left">
              <p className="home-section-eyebrow">Campus</p>
              <h2 className="section__title">News</h2>
              <p className="section__desc">Stories and updates from college life.</p>
            </Fade>
            <div className="media-news-list anim-stagger fade-up">
              {stories.map((item, i) => {
                const d = formatEventDate(item.date)
                return (
                  <article
                    key={item.id || item.title}
                    className="media-news-card media-news-card--clickable"
                    role="button"
                    tabIndex={0}
                    onClick={() => open(storyPack[i], storyPack)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        open(storyPack[i], storyPack)
                      }
                    }}
                  >
                    {item.image ? (
                      <div className="media-news-card__media">
                        <img src={item.image} alt="" loading="lazy" />
                      </div>
                    ) : null}
                    <div className="media-news-card__meta">
                      <span className="media-news-card__cat">News</span>
                      {item.date ? (
                        <time dateTime={item.date}>
                          {d.day} {d.month} {d.year}
                        </time>
                      ) : null}
                    </div>
                    <h3>{item.title}</h3>
                    {item.excerpt ? <p>{item.excerpt}</p> : null}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-cta-band" aria-label="Contact office">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Questions about a notice?</h2>
            <p>Call the office or talk to Admin for counselling and admissions guidance.</p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/admissions" className="btn btn--light btn--lg">
              Talk to Admin →
            </Link>
            <Link to="/contact" className="btn btn--outline-light btn--lg">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
