import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import AboutSubnav from '../components/about/AboutSubnav'
import AboutCtaBand from '../components/about/AboutCtaBand'
import { useCms } from '../context/CmsContext'
import { assetUrl } from '../lib/site'

const GP = 'https://gppharmacycollege.com/wp-content/uploads/2025/03'

const FOUNDER_STORY = [
  'Tirupattur and the wider Vellore region are known for culture, temples, and a growing drive toward professional education. That transition — from traditional community life to skilled, career-ready learning — has been shaped by educators who believe opportunity should reach every family.',
  'This vision was brought to life by Er. G. Ponnusamy, B.E., a philanthropist and educationist who set out to remove ignorance through accessible professional education. He founded the GP Group of Institutions with a clear aim: quality training for middle-class and underserved communities.',
  'Beginning with an ITI in 1979, he expanded the group step by step — Tirupattur Arts and Science College, GP Polytechnic College, GP College of Education — and fulfilled a regional need by establishing G.P. COLLEGE in 2019, the first pharmacy college in Tirupattur and the entire Vellore District.',
  'Today the college continues that ambition under the GP Group: PCI-approved programs, modern labs, and student-centred campus life — Counselling Code 889 — so pharmacy education remains within reach of those who need it most.',
]

const INSTITUTIONS = [
  { year: '1979', name: 'GP ITI', note: 'Foundation of the GP Group education journey' },
  { year: '—', name: 'Tirupattur Arts and Science College', note: 'Higher education for the region' },
  { year: '—', name: 'GP Polytechnic College', note: 'Technical & vocational pathways' },
  { year: '—', name: 'GP College of Education', note: 'Teacher education' },
  { year: '2019', name: 'G.P. COLLEGE', note: 'First pharmacy college in Tirupattur & Vellore District' },
]

const CHAIRMAN_FALLBACK = {
  name: 'Er. G. Ponnusamy',
  title: 'Chairman · GP Group of Institutions',
  image: `${GP}/G.P.Pharmacy-Chairman.jpg`,
}

function Fade({ children, className = '', style }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

function TitleBorder({ left }) {
  return (
    <div
      className={`title_border anim-reveal${left ? ' title_border--left' : ''}`}
      aria-hidden="true"
    />
  )
}

export default function AboutManagementPage() {
  const { about, site } = useCms()
  const chairman = about.chairman || CHAIRMAN_FALLBACK

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ to: '/about', label: 'About' }, { label: 'Management' }]}
        title="The Management"
        subtitle="Founder vision · GP Group of Institutions · Tirupattur"
      />
      <AboutSubnav />

      <section className="section space about-mgmt-hero-story" aria-labelledby="mgmt-story-title">
        <div className="container">
          <Fade style={{ textAlign: 'center' }}>
            <h2 className="sec-title" id="mgmt-story-title">
              The Management
            </h2>
            <TitleBorder />
          </Fade>
          <Fade className="about-mgmt-story">
            <div className="about-mgmt-story__copy">
              <p className="sub-title">Founder &amp; Trust</p>
              {FOUNDER_STORY.map((para) => (
                <p key={para.slice(0, 48)} className="about-mgmt-story__prose">
                  {para.replace(/\b889\b/g, site.code || '889')}
                </p>
              ))}
              <p className="about-mgmt-story__founder">
                <strong>{chairman.name || 'Er. G. Ponnusamy'}</strong>
                <span>{chairman.title || chairman.role || 'Chairman · GP Group of Institutions'}</span>
              </p>
            </div>
            <figure className="about-mgmt-story__media">
              <img
                src={assetUrl(chairman.image || CHAIRMAN_FALLBACK.image)}
                alt={chairman.name || 'Chairman'}
                width="640"
                height="800"
                loading="lazy"
              />
              <figcaption>
                <strong>{chairman.name || 'Er. G. Ponnusamy'}</strong>
                <span>Founder Chairman</span>
              </figcaption>
            </figure>
          </Fade>
        </div>
      </section>

      <section className="section space bg-smoke about-mgmt-journey" aria-labelledby="mgmt-journey-title">
        <div className="container">
          <Fade style={{ textAlign: 'center' }}>
            <p className="sub-title">Our Journey</p>
            <h2 className="sec-title" id="mgmt-journey-title">
              Institutions founded under the GP Group
            </h2>
            <TitleBorder />
            <p className="section__desc" style={{ margin: '0 auto 1.5rem', maxWidth: '40rem' }}>
              Four decades of education — culminating in pharmacy excellence at Counselling Code {site.code}.
            </p>
          </Fade>
          <Fade className="about-mgmt-journey__grid anim-stagger">
            {INSTITUTIONS.map((item, i) => (
              <article key={item.name} className="about-mgmt-journey__card" style={{ '--i': i }}>
                <span className="about-mgmt-journey__year">{item.year}</span>
                <strong>{item.name}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </Fade>
          <Fade className="about-mgmt-journey__visual">
            <img
              src={`${GP}/G.P-Pharmacy-College-home.jpg`}
              alt="G.P. COLLEGE campus"
              width="1200"
              height="560"
              loading="lazy"
            />
          </Fade>
        </div>
      </section>

      <AboutCtaBand
        title="Learn more about our college"
        lead={`Explore programs, campus facilities, and admissions — Counselling Code ${site.code}.`}
      />
    </>
  )
}
