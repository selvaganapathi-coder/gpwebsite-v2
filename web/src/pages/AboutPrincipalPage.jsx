import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import AboutSubnav from '../components/about/AboutSubnav'
import AboutCtaBand from '../components/about/AboutCtaBand'
import { useCms } from '../context/CmsContext'

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

export default function AboutPrincipalPage() {
  const { about, site } = useCms()
  const principal =
    about.leadership.find((l) => /principal/i.test(l.role || '')) ||
    about.leadership[1] || {
      name: 'Prof. Dr. S. Thenmozhi',
      role: 'Principal · G.P. COLLEGE',
      image: '/images/about/about-principal.png',
      bio: 'M.Pharm., Ph.D — Academic head responsible for institutional excellence and student outcomes.',
    }

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ to: '/about', label: 'About' }, { label: 'Principal' }]}
        title="Our Principal"
        subtitle="Academic leadership at G.P. COLLEGE"
      />
      <AboutSubnav />

      <section className="section space">
        <div className="container">
          <Fade style={{ textAlign: 'center' }}>
            <h2 className="sec-title">Our College Principal</h2>
            <TitleBorder />
          </Fade>

          <Fade className="about-principal-srec">
            <figure className="about-principal-srec__media">
              <img
                src={principal.image || '/images/about/about-principal.png'}
                alt={`${principal.name} — Principal`}
                loading="lazy"
              />
              <figcaption className="about-principal-srec__badge">
                <strong>{principal.name}</strong>
                <span>Principal</span>
              </figcaption>
            </figure>
            <div className="about-principal-srec__copy">
              {principal.bio ? <p className="about-principal-srec__prose">{principal.bio}</p> : null}
              <p className="about-principal-srec__prose">
                {principal.name} leads G.P. COLLEGE with a focus on pharmaceutical education, research,
                and student outcomes. Under this guidance the college maintains strong academic standards,
                modern laboratory practice, and hospital and industry links for training and placements.
              </p>
              <p className="about-principal-srec__prose">
                Curriculum delivery across D.Pharm, B.Pharm, M.Pharm and Pharm-D, faculty development, and
                PCI / university compliance remain core priorities — with emphasis on practical pharmacy
                training and career readiness · Counselling Code {site.code}.
              </p>

              <div className="about-principal-highlights">
                <div className="about-principal-highlight">
                  <strong>Designation</strong>
                  <span>Principal</span>
                </div>
                <div className="about-principal-highlight">
                  <strong>Institution</strong>
                  <span>{site.name}</span>
                </div>
                <div className="about-principal-highlight">
                  <strong>Counselling Code</strong>
                  <span>{site.code}</span>
                </div>
                <div className="about-principal-highlight">
                  <strong>Affiliation</strong>
                  <span>TN Dr. M.G.R. Medical University</span>
                </div>
              </div>

              <div className="about-principal-srec__actions">
                <a href={`tel:${site.phoneAlt}`} className="as-btn">
                  Call Principal
                </a>
                <a href={`mailto:${site.principalEmail}`} className="as-btn as-btn--outline">
                  Email
                </a>
                <Link to="/faculty" className="as-btn as-btn--outline">
                  View Faculty →
                </Link>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      <AboutCtaBand />
    </>
  )
}
