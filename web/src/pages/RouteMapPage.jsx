import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import { useCms } from '../context/CmsContext'

const TRANSPORT = [
  {
    title: 'Jolarpet & Mandalavadi',
    desc: 'Pickup near Jolarpet town, railway area, and Vaniyambadi Main Road.',
  },
  {
    title: 'Tirupattur',
    desc: 'Regular service from Tirupattur bus stand and key residential areas.',
  },
  {
    title: 'Vaniyambadi & Ambur',
    desc: 'Routes along Vaniyambadi Main Road connecting neighbouring towns.',
  },
]

function qrSrc(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(url)}`
}

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function RouteMapPage() {
  const { site } = useCms()
  const mapsEmbed = site.mapsEmbedUrl
  const routes = [
    {
      id: 'main',
      index: '01',
      label: 'Main Campus',
      title: 'G.P. COLLEGE',
      desc: 'Open the college pin on Google Maps — Vaniyambadi Main Road, Mandalavadi, Jolarpet.',
      url: site.mapsPlaceUrl,
    },
    {
      id: 'jolarpet',
      index: '02',
      label: 'From Jolarpet',
      title: 'Jolarpet Railway Station',
      desc: 'Turn-by-turn directions from Jolarpet Railway Station to campus (~5 km).',
      url: 'https://www.google.com/maps/dir/Jolarpet+Railway+Station,+Jolarpet,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
    {
      id: 'tirupattur',
      index: '03',
      label: 'From Tirupattur',
      title: 'Tirupattur Town',
      desc: 'Driving directions from Tirupattur via Vaniyambadi Main Road.',
      url: 'https://www.google.com/maps/dir/Tirupattur,+Tamil+Nadu/GP+PHARMACY+COLLEGE,+Jolarpet',
    },
  ]

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Route Map' }]}
        title="Route Map"
        subtitle={`Find your way to ${site.name}, Jolarpet`}
      />

      <section className="route-page section" aria-labelledby="route-qr-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Navigate</p>
            <h2 className="section__title" id="route-qr-title">
              Scan for directions
            </h2>
            <p className="section__desc">
              Scan a QR code with your phone camera to open Google Maps. Share with parents and
              visitors arriving from Jolarpet Railway Station or Tirupattur.
            </p>
          </Fade>

          <div className="route-qr-grid anim-stagger fade-up">
            {routes.map((route) => (
              <article key={route.id} className="route-qr">
                <span className="route-qr__index" aria-hidden="true">
                  {route.index}
                </span>
                <div className="route-qr__frame">
                  <img
                    src={qrSrc(route.url)}
                    width={220}
                    height={220}
                    alt={`QR code — ${route.title}`}
                    loading="lazy"
                  />
                </div>
                <span className="route-qr__label">{route.label}</span>
                <h3 className="route-qr__title">{route.title}</h3>
                <p className="route-qr__desc">{route.desc}</p>
                <a
                  href={route.url}
                  className="route-qr__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="route-reach section section--soft" aria-labelledby="route-reach-title">
        <div className="container">
          <div className="route-reach__grid">
            <Fade>
              <p className="home-section-eyebrow">How to reach</p>
              <h2 className="route-reach__title" id="route-reach-title">
                Train · Bus · Car
              </h2>
              <ul className="route-reach__list">
                <li>
                  <strong>By train</strong>
                  <span>
                    Get down at Jolarpet Railway Junction. Campus is about 5 km via Vaniyambadi Main
                    Road.
                  </span>
                </li>
                <li>
                  <strong>By bus</strong>
                  <span>
                    Ask for Mandalavadi / G.P. COLLEGE stop on Vaniyambadi Main Road
                    (Jolarpet–Tirupattur–Vaniyambadi corridor).
                  </span>
                </li>
                <li>
                  <strong>By car</strong>
                  <span>
                    Follow Vaniyambadi Main Road from Jolarpet or Tirupattur — campus on the left with
                    GP Group signage.
                  </span>
                </li>
              </ul>
            </Fade>

            <Fade className="route-reach__address">
              <h3>College address</h3>
              <p>{site.address}</p>
              <div className="route-reach__actions">
                <a
                  href={site.mapsPlaceUrl}
                  className="btn btn--amber"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Google Maps
                </a>
                <a href={`tel:${site.phone}`} className="btn btn--outline-light">
                  Call Office
                </a>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      <section className="route-map-embed section" aria-labelledby="route-map-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Campus pin</p>
            <h2 className="section__title" id="route-map-title">
              On the map
            </h2>
            <p className="section__desc">{site.address}</p>
          </Fade>
          <Fade className="route-map-embed__frame">
            <iframe
              src={mapsEmbed}
              title="G.P. COLLEGE location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Fade>
        </div>
      </section>

      <section className="route-transport section section--soft" aria-labelledby="route-bus-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Campus transport</p>
            <h2 className="section__title" id="route-bus-title">
              College bus routes
            </h2>
            <p className="section__desc">
              Safe transport covering Jolarpet, Tirupattur, and nearby towns. Confirm current timings
              with the office.
            </p>
          </Fade>
          <div className="route-transport__grid anim-stagger fade-up">
            {TRANSPORT.map((t) => (
              <article key={t.title} className="route-transport__item">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </article>
            ))}
          </div>
          <Fade className="route-transport__cta">
            <Link to="/contact" className="btn btn--red">
              Contact for transport details →
            </Link>
          </Fade>
        </div>
      </section>
    </>
  )
}
