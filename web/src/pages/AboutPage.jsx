import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import AboutSubnav from '../components/about/AboutSubnav'
import AboutCtaBand from '../components/about/AboutCtaBand'
import CountUp from '../components/CountUp'
import { useCms } from '../context/CmsContext'

const TIMELINE = [
  {
    year: '1979',
    title: 'GP ITI founded',
    text: 'Er. G. Ponnusamy begins the GP Group education journey.',
  },
  {
    year: 'Arts & Poly',
    title: 'Colleges expand',
    text: 'Tirupattur Arts & Science, GP Polytechnic, and College of Education.',
  },
  {
    year: '2019',
    title: 'Pharmacy College',
    text: 'First pharmacy college in Tirupattur & Vellore District opens.',
  },
  {
    year: 'Today',
    title: 'Growing campus',
    text: 'PCI Approved programs with labs, hostels, and placements.',
  },
]

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  const { about, site } = useCms()

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'About' }]}
        title={about.heroTitle}
        subtitle={about.heroSubtitle}
      />
      <AboutSubnav />

      <section className="about-approvals" aria-label="Approvals and affiliation">
        <div className="container">
          <ul className="about-approvals__list">
            <li>
              <strong>Established</strong>
              <span>2019</span>
            </li>
            <li>
              <strong>Counselling Code</strong>
              <span>{site.code}</span>
            </li>
            <li>
              <strong>Affiliation</strong>
              <span>TN Dr. M.G.R. Medical University</span>
            </li>
            <li>
              <strong>Approvals</strong>
              <span>PCI</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="about-discover section space" id="college-profile">
        <div className="container">
          <Fade className="about-discover__grid">
            <div>
              <p className="sub-title">Discover Us In Detail</p>
              <h2 className="about-discover__title sec-title">{about.discoverTitle}</h2>
              <div className="title_border title_border--left anim-reveal" aria-hidden="true" />
              {about.discoverProse.map((para) => (
                <p key={para.slice(0, 48)} className="about-discover__prose">
                  {para}
                </p>
              ))}
              <div className="about-discover__actions">
                <Link to="/about/management" className="as-btn">
                  Meet Management →
                </Link>
                <Link to="/about/principal" className="as-btn as-btn--outline">
                  Meet Principal →
                </Link>
              </div>
            </div>
            <figure className="about-discover__media">
              <img src={about.discoverImage} alt="G.P. COLLEGE campus" loading="lazy" />
              <figcaption className="about-discover__caption">
                <strong className="brand-name">G.P. COLLEGE</strong> · Tirupattur
              </figcaption>
            </figure>
          </Fade>
        </div>
      </section>

      <section className="about-journey section space bg-smoke">
        <div className="container">
          <Fade className="section__header" style={{ textAlign: 'center' }}>
            <p className="sub-title">Our Journey</p>
            <h2 className="sec-title">Four decades of education, one pharmacy vision</h2>
            <div className="title_border anim-reveal" aria-hidden="true" />
          </Fade>
          <Fade>
            <ol className="about-timeline">
              {TIMELINE.map((item) => (
                <li key={item.year}>
                  <span className="about-timeline__year">{item.year}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Fade>
        </div>
      </section>

      <section className="about-innovation section space">
        <div className="container">
          <Fade className="about-innovation__grid">
            <div>
              <p className="sub-title">Why G.P. Pharmacy</p>
              <h2 className="about-innovation__title sec-title">An innovative pharmacy institution</h2>
              <div className="title_border title_border--left anim-reveal" aria-hidden="true" />
              <p className="about-discover__prose">
                Industry-aligned education with laboratory training, hospital exposure, and placement
                support. Students build skills in pharmaceutics, analysis, pharmacology, and clinical
                pharmacy through modern labs and smart classrooms.
              </p>
              <p className="about-discover__prose">
                Strong ties with hospitals, pharma manufacturers, and retail chains power industrial
                visits, internships, and campus recruitment.
              </p>
            </div>
            <div className="about-stats-row anim-stagger fade-up">
              <div className="about-stat-pill">
                <CountUp value="2019" />
                <span>Established</span>
              </div>
              <div className="about-stat-pill">
                <strong>{site.code}</strong>
                <span>Counselling Code</span>
              </div>
              <div className="about-stat-pill">
                <CountUp value="5+" />
                <span>Programs</span>
              </div>
              <div className="about-stat-pill">
                <CountUp value="500+" />
                <span>Students</span>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      <section className="about-highlights section space bg-smoke">
        <div className="container">
          <Fade className="section__header" style={{ textAlign: 'center' }}>
            <p className="sub-title">Campus Strengths</p>
            <h2 className="sec-title">Built for pharmacy learning</h2>
            <div className="title_border anim-reveal" aria-hidden="true" />
          </Fade>
          <Fade className="about-highlights__grid anim-stagger">
            {about.highlights.map((item) => (
              <article key={item.title} className="about-highlight-card person-card">
                <div className="about-highlight-card__img">
                  <img src={item.image} alt="" loading="lazy" />
                </div>
                <div className="about-highlight-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section space about-vm bg-smoke" id="vision-mission">
        <div className="container">
          <Fade className="section__header" style={{ textAlign: 'center' }}>
            <p className="sub-title">Why we exist</p>
            <h2 className="sec-title">Vision &amp; Mission</h2>
            <div className="title_border anim-reveal" aria-hidden="true" />
            <p className="section__desc">
              Clear purpose for students, parents, and our teaching community.
            </p>
          </Fade>
          <Fade className="about-vm__grid anim-stagger">
            <article className="about-vm__card about-vm__card--vision">
              <span className="about-vm__tag">Vision</span>
              <h3>Where we are going</h3>
              <p className="about-vm__statement">
                To be Tirupattur’s trusted centre of pharmacy education — shaping skilled, ethical
                pharmacists who serve healthcare and lift their communities.
              </p>
              <p className="about-vm__sub">We aim for:</p>
              <ul>
                <li>Quality pharmacy learning for every student who joins us</li>
                <li>Strong practical skills for hospitals, industry and retail</li>
                <li>Careers that create dignity and social mobility</li>
              </ul>
            </article>
            <article className="about-vm__card about-vm__card--mission">
              <span className="about-vm__tag">Mission</span>
              <h3>How we get there</h3>
              <p className="about-vm__statement">
                We deliver complete pharmacy education through modern labs, caring faculty, and steady
                student support — without compromising standards.
              </p>
              <p className="about-vm__sub">We commit to:</p>
              <ul>
                <li>Teaching that meets PCI and university expectations</li>
                <li>Hands-on labs, clinical exposure and placement readiness</li>
                <li>Guiding every learner from admission to career</li>
              </ul>
            </article>
          </Fade>
          <Fade>
            <figure className="about-vm__banner">
              <img
                src="https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P-Pharmacy-College-home.jpg"
                alt="G.P. COLLEGE campus"
                loading="lazy"
              />
            </figure>
          </Fade>
          <div className="programs-cta" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link to="/news" className="btn btn--outline-dark">
              Campus news &amp; notices →
            </Link>
          </div>
        </div>
      </section>

      <AboutCtaBand />
    </>
  )
}
