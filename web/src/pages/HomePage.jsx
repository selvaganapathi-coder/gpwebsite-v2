import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import {
  assetUrl,
  categoryLabel,
  formatEventDate,
  initials,
  whatsappUrl,
  youtubeEmbedUrl,
} from '../lib/site'
import Hero from '../components/home/Hero'
import AdmissionsWelcome from '../components/home/AdmissionsWelcome'
import HomeSideRail from '../components/home/HomeSideRail'
import CountUp from '../components/CountUp'
import { useFadeUp } from '../hooks/useFadeUp'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

function FadeUp({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

function stripArrow(label) {
  return String(label || '')
    .replace(/\s*→\s*$/u, '')
    .trim()
}

function qrSrc(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(url)}`
}

export default function HomePage() {
  const { homepage: hp, notices, events, site } = useCms()
  const { open } = useStoryPopup()
  const tourEmbed = youtubeEmbedUrl(hp.campusTour?.youtubeUrl)
  const campusItems = hp.campusShow?.items || []
  const statsItems = hp.stats?.items || []
  const heroStat = statsItems[0]
  const gridStats = statsItems.slice(1)
  const recruiters = hp.recruiters?.length
    ? hp.recruiters
    : ['Hospital Pharmacy', 'Pharma Industry', 'Retail Chains', 'Clinical Research', 'Regulatory Affairs']

  const campusPack = campusItems.map((item) =>
    toStoryItem(
      {
        id: item.id,
        title: item.title,
        image: assetUrl(item.image),
        summary: item.caption,
      },
      {
        categoryLabel: 'On Campus',
        ctaTo: '/gallery',
        ctaLabel: 'View gallery',
      },
    ),
  )

  const qrRoutes = [
    {
      id: 'campus',
      label: 'Main Campus',
      url: site.mapsPlaceUrl,
    },
    {
      id: 'jolarpet',
      label: 'From Jolarpet',
      url: 'https://www.google.com/maps/dir/Jolarpet+Railway+Station,+Jolarpet,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
    {
      id: 'tirupattur',
      label: 'From Tirupattur',
      url: 'https://www.google.com/maps/dir/Tirupattur,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
  ]

  return (
    <>
      <AdmissionsWelcome />
      <HomeSideRail />

      {/* 1. Full-bleed hero carousel — SREC style */}
      <Hero badge={hp.badge} slides={hp.slides} captions={hp.captions} brand={hp.title} />

      {/* 2. About college */}
      <section className="home-about section space" id="homeAbout" aria-label="Our College">
        <div className="container">
          <FadeUp className="home-about__grid">
            <div className="home-about__content">
              <p className="home-section-eyebrow">{hp.homeAbout.eyebrow || 'About College'}</p>
              <h2 className="home-about__title">{hp.homeAbout.title}</h2>
              {hp.homeAbout.lead ? <p className="home-about__lead">{hp.homeAbout.lead}</p> : null}
              <div className="home-about__meta" aria-label="College highlights">
                <div>
                  <span>Established</span>
                  <strong>2019</strong>
                </div>
                <div>
                  <span>Counselling Code</span>
                  <strong>{site.code}</strong>
                </div>
                <div>
                  <span>Approval</span>
                  <strong>PCI</strong>
                </div>
                <div>
                  <span>Affiliation</span>
                  <strong>TN Dr. M.G.R.</strong>
                </div>
              </div>
              <div className="home-about__actions">
                <Link to="/about" className="btn btn--red">
                  {stripArrow(hp.homeAbout.ctaPrimary) || 'Learn more'}
                </Link>
                <Link to="/admissions" className="btn btn--outline-dark">
                  {stripArrow(hp.homeAbout.ctaSecondary) || 'Talk to Admin'}
                </Link>
              </div>
            </div>

            <figure className="home-about__media">
              <img
                src={assetUrl(hp.homeAbout.image)}
                alt={`${site.name} campus`}
                width="800"
                height="600"
                loading="lazy"
              />
            </figure>
          </FadeUp>
        </div>
      </section>

      {/* 3. Popular courses */}
      <section className="home-courses section space bg-smoke" id="homeCourses" aria-label="Programs and courses">
        <div className="container">
          <FadeUp className="home-courses__head">
            <div className="section__header section__header--left">
              <p className="home-section-eyebrow">{hp.programsShow.eyebrow || 'Academics'}</p>
              <h2 className="section__title">{hp.programsShow.title || 'Explore Our Popular Courses'}</h2>
              <p className="section__desc home-courses__lead">{hp.programsShow.lead}</p>
            </div>
            <Link to={hp.programsShow.ctaHref || '/courses'} className="home-courses__cta">
              {stripArrow(hp.programsShow.ctaText) || 'View all courses'}
            </Link>
          </FadeUp>
          <FadeUp className="home-courses__grid anim-stagger">
            {hp.programsShow.items.map((item) => (
              <Link key={item.id} to={item.href || '/courses'} className="home-course-tile">
                <img src={assetUrl(item.image)} alt={item.name} loading="lazy" width="600" height="800" />
                <div className="home-course-tile__copy">
                  <em>{item.duration}</em>
                  <strong>{item.name}</strong>
                  <span>{item.blurb}</span>
                </div>
              </Link>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* 4. Why GP — attributes */}
      <section className="home-attributes section space" id="homeAttributes" aria-label="Why G.P. College">
        <div className="container">
          <FadeUp className="home-attributes__intro">
            <div>
              <p className="home-section-eyebrow">{hp.attributes?.eyebrow || 'Why G.P.'}</p>
              <h2 className="home-attributes__title">
                {hp.attributes?.title || 'Empowering lives through pharmacy education'}
              </h2>
            </div>
            <p className="home-attributes__lead">{hp.attributes?.lead}</p>
          </FadeUp>
          <FadeUp className="home-attributes__grid anim-stagger">
            {(hp.attributes?.items || []).slice(0, 4).map((item) => (
              <article key={item.id} className="home-attr-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* 5. Stats band — SREC career-ready numbers */}
      {statsItems.length ? (
        <section className="home-stats-band section space" id="homeStats" aria-label="College at a glance">
          <div className="container">
            <FadeUp className="home-stats-band__layout">
              <div className="home-stats-band__head section__header section__header--left">
                <p className="home-section-eyebrow">{hp.stats?.eyebrow || 'At a glance'}</p>
                <h2 className="section__title">
                  {hp.stats?.title || 'Pharmacy education that builds careers'}
                </h2>
                {hp.stats?.lead ? <p className="home-stats-band__lead">{hp.stats.lead}</p> : null}
              </div>
              {heroStat ? (
                <div className="home-stats-band__hero">
                  <CountUp value={heroStat.value} />
                  <span className="home-stats-band__hero-label">{heroStat.label}</span>
                </div>
              ) : null}
            </FadeUp>
            {gridStats.length ? (
              <FadeUp className="home-stats-band__grid">
                {gridStats.map((item) => (
                  <div key={item.id} className="home-stats-band__item">
                    <CountUp value={item.value} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </FadeUp>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 6. Campus facilities */}
      <section className="home-campus-show section space bg-smoke" id="homeCampusShow" aria-label="Campus facilities">
        <div className="container">
          <FadeUp className="section__header section__header--left">
            <p className="home-section-eyebrow">{hp.campusShow.eyebrow}</p>
            <h2 className="section__title">{hp.campusShow.title}</h2>
            <p className="section__desc home-campus-show__lead">{hp.campusShow.lead}</p>
          </FadeUp>
          <FadeUp className="home-campus-show__grid anim-stagger">
            {campusItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="home-campus-show__panel home-campus-show__panel--btn"
                onClick={() => open(campusPack[i], campusPack)}
              >
                <img src={assetUrl(item.image)} alt="" loading="lazy" width="800" height="600" />
                <div className="home-campus-show__copy">
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </div>
              </button>
            ))}
          </FadeUp>
          <FadeUp className="home-campus-show__more">
            <Link to="/gallery" className="btn btn--outline-dark">
              View Gallery
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 7. People */}
      <section className="home-people section space" id="homePeople" aria-label="People at G.P. Pharmacy">
        <div className="container">
          <FadeUp className="section__header section__header--left">
            <p className="home-section-eyebrow">{hp.people.eyebrow}</p>
            <h2 className="section__title">{hp.people.title}</h2>
            <p className="section__desc home-people__lead">{hp.people.lead}</p>
          </FadeUp>
          <FadeUp className="home-people__strip anim-stagger">
            {hp.people.slots.map((slot) => {
              const img = assetUrl(slot.image)
              const inner = (
                <>
                  {img ? (
                    <img src={img} alt={slot.name} width="112" height="112" loading="lazy" />
                  ) : (
                    <span className="home-people__avatar" aria-hidden="true">
                      {initials(slot.name)}
                    </span>
                  )}
                  <strong>{slot.name}</strong>
                  <span>{slot.role}</span>
                </>
              )
              const cls = `home-people__person${!img ? ' home-people__person--initials' : ''}`
              if (slot.href) {
                return (
                  <Link key={slot.id} to={slot.href} className={cls} aria-label={slot.name}>
                    {inner}
                  </Link>
                )
              }
              return (
                <div key={slot.id} className={cls} aria-label={slot.name}>
                  {inner}
                </div>
              )
            })}
            <Link to={hp.people.moreHref || '/gallery'} className="home-people__person home-people__person--more">
              <img
                src={assetUrl(hp.people.moreImage)}
                alt="Faculty and students on campus"
                width="112"
                height="112"
                loading="lazy"
              />
              <strong>{hp.people.moreLabel}</strong>
              <span>{stripArrow(hp.people.moreCaption)}</span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 8. Partners / recruiters strip */}
      <section className="home-partners section" id="homePartners" aria-label="Career pathways">
        <div className="container">
          <FadeUp className="home-recruiters__head">
            <h2 className="home-partners__title">
              {hp.recruitersLabel || (
                <>
                  Career pathways after <span>G.P. Pharmacy</span>
                </>
              )}
            </h2>
            <Link to="/placements" className="notice-panel__link">
              Placements
            </Link>
          </FadeUp>
          <FadeUp className="home-recruiters__row anim-stagger">
            {recruiters.slice(0, 8).map((name) => (
              <span key={name} className="home-recruiters__chip">
                {name}
              </span>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* 9. Campus tour */}
      <section className="campus-tour section space" id="campus-tour">
        <div className="container">
          <FadeUp className="campus-tour__inner">
            <div className="campus-tour__head">
              <p className="home-section-eyebrow">Campus</p>
              <h2 className="section__title">{tourEmbed ? 'Campus tour' : 'Visit the Jolarpet campus'}</h2>
              <p className="campus-tour__desc">{hp.campusTour.lead}</p>
            </div>

            {tourEmbed ? (
              <div className="campus-tour__embed">
                <div className="video-embed">
                  <iframe
                    title={`${site.name} campus tour`}
                    src={tourEmbed}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : (
              <div className="campus-tour__photos" aria-label="Campus photo strip">
                {(campusItems.length
                  ? campusItems
                  : [{ image: hp.campusTour.fallbackImage, title: 'Campus', caption: 'Jolarpet' }]
                ).map((item) => (
                  <figure key={item.id || item.title} className="campus-tour__photo">
                    <img
                      src={assetUrl(item.image || hp.campusTour.fallbackImage)}
                      alt={item.title || 'Campus'}
                      loading="lazy"
                      width="640"
                      height="400"
                    />
                    <figcaption>
                      <strong>{item.title}</strong>
                      {item.caption ? <span>{item.caption}</span> : null}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            <div className="campus-tour__actions">
              <a
                href={whatsappUrl('Hi, I want to book a campus visit at G.P. Pharmacy College.')}
                className="btn btn--amber btn--lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book visit (WhatsApp)
              </a>
              <a href={`tel:${site.phone}`} className="btn btn--red btn--lg">
                Call Admin
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 10. QR navigate — like SREC */}
      <section className="home-qr section space bg-smoke" id="homeQr" aria-label="Find the campus">
        <div className="container">
          <FadeUp className="section__header section__header--left home-qr__head">
            <p className="home-section-eyebrow">Navigate</p>
            <h2 className="section__title">Navigate with QR codes</h2>
            <p className="section__desc">
              Scan a code for turn-by-turn directions to {site.name}, Jolarpet.
            </p>
          </FadeUp>
          <FadeUp className="home-qr__grid anim-stagger">
            {qrRoutes.map((route) => (
              <a
                key={route.id}
                href={route.url}
                className="home-qr__card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={qrSrc(route.url)} alt="" width="160" height="160" loading="lazy" />
                <strong>{route.label}</strong>
                <span>Open in Maps</span>
              </a>
            ))}
          </FadeUp>
          <FadeUp className="home-qr__actions">
            <Link to="/route-map" className="btn btn--outline-dark">
              Full route map
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 11. Talk to Admin CTA */}
      <section className="home-admin-cta section space" aria-label="Talk to Admin">
        <div className="container">
          <FadeUp className="home-admin-cta__inner">
            <div>
              <p className="home-section-eyebrow">Admissions</p>
              <h2 className="section__title">Talk to Admin</h2>
              <p className="home-admin-cta__lead">
                Call or WhatsApp for Code {site.code} guidance — no online application on this site.
              </p>
            </div>
            <div className="home-admin-cta__actions">
              <a href={`tel:${site.phone}`} className="btn btn--red btn--lg">
                Call Admin
              </a>
              <a href={whatsappUrl()} className="btn btn--amber btn--lg" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <Link to="/contact" className="btn btn--outline-light btn--lg">
                Contact / enquiry
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 12. Notices & events */}
      <section className="home-news section space" id="homeNews">
        <div className="container">
          <FadeUp className={`notice-ticker${notices.length >= 2 ? ' notice-ticker--marquee' : ''}`}>
            <span className="notice-ticker__label">Notices</span>
            <div className={`notice-ticker__track${notices.length >= 2 ? ' notice-ticker__track--marquee' : ''}`}>
              {(notices.length >= 2 ? [...notices.slice(0, 5), ...notices.slice(0, 5)] : notices.slice(0, 5)).map(
                (n, i) => (
                  <Link key={`${n.id}-${i}`} to={n.link || '/news'} className="notice-ticker__item">
                    <span className="notice-ticker__dot" aria-hidden="true" />
                    {n.title}
                  </Link>
                ),
              )}
            </div>
          </FadeUp>

          <FadeUp className="home-news__grid">
            <div className="home-news__col">
              <div className="notice-panel">
                <div className="notice-panel__head">
                  <div>
                    <span className="section__label">Official</span>
                    <h2 className="section__title">Notice Board</h2>
                  </div>
                  <Link to="/news" className="notice-panel__link">
                    View all
                  </Link>
                </div>
                <div className="notice-board">
                  {notices.slice(0, 3).map((n) => {
                    const d = formatEventDate(n.date)
                    const urgent = n.urgent || n.priority === 'high'
                    return (
                      <Link
                        key={n.id}
                        to={n.link || '/news'}
                        className={`notice-board__item${urgent ? ' notice-board__item--urgent' : ''}`}
                      >
                        <time className="notice-board__date" dateTime={n.date}>
                          <strong>{d.day}</strong>
                          <span>{d.month.slice(0, 3)}</span>
                        </time>
                        <div className="notice-board__body">
                          <div className="notice-board__meta">
                            <span className="notice-board__cat">{categoryLabel(n.category)}</span>
                            {urgent ? <span className="notice-board__badge">Urgent</span> : null}
                          </div>
                          <strong className="notice-board__title">{n.title}</strong>
                          <p className="notice-board__summary">{n.summary}</p>
                        </div>
                        <span className="notice-board__arrow" aria-hidden="true" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="home-news__col">
              <div className="notice-panel notice-panel--events">
                <div className="notice-panel__head">
                  <div>
                    <span className="section__label">Calendar</span>
                    <h2 className="section__title">Events</h2>
                  </div>
                  <Link to="/events" className="notice-panel__link">
                    View all
                  </Link>
                </div>
                <div className="home-events-cal">
                  {events.slice(0, 4).map((e) => {
                    const d = formatEventDate(e.date)
                    return (
                      <Link key={e.id} to="/events" className="home-events-cal__item">
                        <div className="home-events-cal__date">
                          <strong>{d.day}</strong>
                          <span>{d.month.slice(0, 3)}</span>
                        </div>
                        <div className="home-events-cal__body">
                          <span className="home-events-cal__cat">{categoryLabel(e.category)}</span>
                          <strong className="home-events-cal__title">{e.title}</strong>
                          <p className="home-events-cal__summary">{e.summary}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
