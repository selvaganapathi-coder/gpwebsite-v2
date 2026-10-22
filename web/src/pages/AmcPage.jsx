import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import AcademicsSubnav from '../components/academics/AcademicsSubnav'
import { useCms } from '../context/CmsContext'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

const ACTIVITIES = [
  {
    title: 'ADR case reporting',
    desc: 'Collection and assessment of suspected adverse drug reactions from hospitals, clinics, and community pharmacies across Tirupattur District.',
  },
  {
    title: 'PvPI training & workshops',
    desc: 'Hands-on sessions for Pharm-D, B.Pharm and M.Pharm students on causality assessment, VigiFlow reporting, and patient safety culture.',
  },
  {
    title: 'Healthcare professional outreach',
    desc: 'Sensitization programmes for doctors, nurses, and pharmacists on spontaneous ADR reporting under the Pharmacovigilance Programme of India.',
  },
  {
    title: 'Consumer awareness drives',
    desc: 'Campus and community campaigns on medicine safety, yellow-card style reporting awareness, and responsible use of medicines.',
  },
  {
    title: 'Signal detection support',
    desc: 'Coordination with IPC–PvPI for quality reports that strengthen national medicine safety signals.',
  },
  {
    title: 'Hospital & college collaboration',
    desc: 'Linkages with clinical sites including Government Hospital Tirupattur for bedside pharmacovigilance exposure.',
  },
]

const PHOTOS = [
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College20.jpg',
    alt: 'Clinical and hospital training linked to ADR monitoring',
    caption: 'Clinical exposure supporting ADR surveillance',
  },
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College5-1.jpg',
    alt: 'Hospital training for pharmacy students',
    caption: 'Hospital training · Tirupattur',
  },
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College29.jpg',
    alt: 'College event and awareness programme',
    caption: 'Awareness & outreach programmes',
  },
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College34.jpg',
    alt: 'Pharmacy week and student activities',
    caption: 'Pharmacy Week · PvPI sensitization',
  },
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College12.jpg',
    alt: 'Pharmacology laboratory at G.P. Pharmacy College',
    caption: 'Pharmacology lab · medicine safety skills',
  },
  {
    src: 'https://gppharmacycollege.com/wp-content/uploads/2025/04/clg8.jpg',
    alt: 'Campus activity at G.P. Pharmacy College',
    caption: 'Campus activities under AMC–PvPI',
  },
]

const ACHIEVEMENTS = [
  {
    title: 'Second pharmacy college AMC in Tamil Nadu',
    desc: 'G.P. Pharmacy College is the second pharmacy college in Tamil Nadu to establish an ADR Monitoring Centre under PvPI.',
  },
  {
    title: 'AMC for Tirupattur District',
    desc: 'Recognised as the ADR Monitoring Centre serving Tirupattur District — strengthening local pharmacovigilance coverage.',
  },
  {
    title: 'Aligned to IPC – PvPI',
    desc: 'Operates under the Pharmacovigilance Programme of India (PvPI), Indian Pharmacopoeia Commission (IPC), Ministry of Health & Family Welfare.',
  },
  {
    title: 'Student pharmacovigilance capacity',
    desc: 'Pharm-D and pharmacy students trained in ADR identification, documentation, and reporting workflows used by AMCs nationwide.',
  },
]

export default function AmcPage() {
  const { site } = useCms()
  const { open } = useStoryPopup()
  const photoPack = PHOTOS.map((p, i) =>
    toStoryItem(
      {
        id: `amc-photo-${i}`,
        title: p.caption,
        image: p.src,
        summary: p.caption,
      },
      {
        categoryLabel: 'AMC – PvPI',
        ctaTo: '/amc',
        ctaLabel: 'About AMC →',
      },
    ),
  )

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Academics', to: '/research' },
          { label: 'AMC – PvPI' },
        ]}
        title="ADR Monitoring Centre"
        subtitle="AMC under Pharmacovigilance Programme of India (PvPI) · Serving Tirupattur District"
      />
      <AcademicsSubnav />

      <section className="section amc-overview" id="about-amc" aria-labelledby="amc-about-title">
        <div className="container">
          <Fade className="amc-overview__grid">
            <div className="amc-overview__copy">
              <p className="home-section-eyebrow">Pharmacovigilance</p>
              <p className="amc-overview__brand brand-name">
                <strong>{site.name}</strong>
              </p>
              <h2 className="section__title" id="amc-about-title">
                ADR Monitoring Centre (AMC) – PvPI
              </h2>
              <p className="amc-overview__lead">
                <strong>G.P. Pharmacy College</strong> is the{' '}
                <strong>second pharmacy college in Tamil Nadu</strong> to establish an ADR Monitoring
                Centre under the Pharmacovigilance Programme of India (PvPI).
              </p>
              <p>
                Our college is the <strong>AMC serving Tirupattur District</strong> — collecting,
                assessing, and forwarding suspected adverse drug reaction reports to strengthen
                medicine safety for patients and healthcare professionals in the region.
              </p>
            </div>
            <aside className="amc-highlights" aria-label="AMC highlights">
              <div className="amc-highlight">
                <strong>2nd</strong>
                <span>Pharmacy college AMC in Tamil Nadu under PvPI</span>
              </div>
              <div className="amc-highlight">
                <strong>Tirupattur</strong>
                <span>District AMC coverage</span>
              </div>
              <div className="amc-highlight">
                <strong>PvPI</strong>
                <span>IPC · Ministry of Health &amp; Family Welfare</span>
              </div>
              <div className="amc-highlight">
                <strong>{site.code}</strong>
                <span>Counselling code · PCI {site.pci}</span>
              </div>
            </aside>
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="amc-activities" aria-labelledby="amc-activities-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Programme</p>
            <h2 className="section__title" id="amc-activities-title">
              AMC / PvPI activities
            </h2>
            <p className="section__desc">
              Continuous pharmacovigilance work linking campus, hospitals, and the community.
            </p>
          </Fade>
          <div className="amc-activities anim-stagger fade-up">
            {ACTIVITIES.map((a, i) => (
              <article key={a.title} className="amc-activity">
                <span className="amc-activity__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="amc-photos" aria-labelledby="amc-photos-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Gallery</p>
            <h2 className="section__title" id="amc-photos-title">
              Photographs
            </h2>
            <p className="section__desc">
              Clinical training, awareness programmes, and campus activities connected to AMC–PvPI.
            </p>
          </Fade>
          <div className="amc-photos anim-stagger fade-up">
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className="amc-photo amc-photo--btn"
                onClick={() => open(photoPack[i], photoPack)}
              >
                <div className="amc-photo__media">
                  <img src={p.src} alt="" loading="lazy" width="640" height="420" />
                </div>
                <figcaption>{p.caption}</figcaption>
              </button>
            ))}
          </div>
          <Fade className="amc-photos__more">
            <Link to="/gallery" className="btn btn--outline-dark">
              View full gallery →
            </Link>
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="amc-achievements" aria-labelledby="amc-achievements-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Recognition</p>
            <h2 className="section__title" id="amc-achievements-title">
              Achievements
            </h2>
            <p className="section__desc">
              Milestones that place G.P. Pharmacy College on the state pharmacovigilance map.
            </p>
          </Fade>
          <ol className="amc-achievements anim-stagger fade-up">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.title} className="amc-achievement">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-cta-band" aria-label="Contact AMC">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Report an ADR or connect with AMC</h2>
            <p>
              Healthcare professionals and stakeholders in Tirupattur District can reach the college
              AMC for guidance on adverse drug reaction reporting under PvPI.
            </p>
          </div>
          <div className="page-cta-band__actions">
            <a href={`tel:${site.phone}`} className="btn btn--light btn--lg">
              Call {site.phoneDisplay}
            </a>
            <Link to="/contact" className="btn btn--outline-light btn--lg">
              Contact college →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
