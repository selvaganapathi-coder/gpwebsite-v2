import { Link, NavLink } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import { DEPARTMENTS } from '../data/departmentsDefaults'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '', style }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

function TitleBorder() {
  return <div className="title_border anim-reveal" aria-hidden="true" />
}

function AcademicsSubnav() {
  return (
    <nav className="academics-subnav page-subnav" aria-label="Academics">
      <div className="container">
        <ul className="page-subnav__list">
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/departments"
              end
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Departments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/research"
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Research
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default function DepartmentsPage() {
  const { site } = useCms()

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Departments' }]}
        title="Departments"
        subtitle="Pharmacy departments & laboratories"
      />
      <AcademicsSubnav />

      <section className="section space-top">
        <div className="container">
          <Fade style={{ textAlign: 'center' }}>
            <h2 className="sec-title">Our Departments</h2>
            <TitleBorder />
            <p className="programmes-intro">
              Academic departments supporting B.Pharm, D.Pharm, M.Pharm and Pharm-D · Counselling Code{' '}
              {site.code}.
            </p>
          </Fade>
        </div>
      </section>

      {DEPARTMENTS.map((dept, di) => (
        <section
          key={dept.id}
          className={`dept-section space-top${di % 2 === 1 ? ' bg-smoke' : ''}`}
          id={dept.id}
          aria-labelledby={`${dept.id}-title`}
        >
          <div className="container">
            <Fade style={{ textAlign: 'center' }}>
              <h3 className="dept-section__title" id={`${dept.id}-title`}>
                {dept.title}
              </h3>
              <TitleBorder />
            </Fade>
            <div className="dept-cards anim-stagger fade-up">
              {dept.programs.map((prog) => (
                <article key={prog.name} className="dept-card">
                  <Link to={prog.href} className="dept-card__shell">
                    <div className="dept-card__frame">
                      <div
                        className="dept-card__img"
                        style={{ backgroundImage: `url(${prog.image})` }}
                        role="img"
                        aria-label={prog.name}
                      />
                    </div>
                    <div className="dept-card__meta">
                      <h4 className="dept-card__label">{prog.name}</h4>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section space bg-smoke">
        <div className="container" style={{ textAlign: 'center' }}>
          <Fade>
            <h2 className="sec-title">Explore research</h2>
            <TitleBorder />
            <p className="programmes-intro">Projects, publications, and pharmacy innovation on campus.</p>
            <Link to="/research" className="as-btn">
              View Research →
            </Link>
          </Fade>
        </div>
      </section>
    </>
  )
}
