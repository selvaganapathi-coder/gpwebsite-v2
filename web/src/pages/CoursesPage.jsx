import { Link, NavLink } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import { COURSE_DETAILS } from '../data/coursesDefaults'
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
              end
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/departments"
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Departments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/faculty"
              className={({ isActive }) => `page-subnav__link${isActive ? ' active' : ''}`}
            >
              Faculty
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

function CourseDetail({ course, soft }) {
  return (
    <section
      className={`courses-detail-block${soft ? ' bg-smoke' : ''}`}
      id={course.id}
      aria-labelledby={`${course.id}-title`}
    >
      <div className="container">
        <Fade className={`course-detail${course.flip ? ' course-detail--flip' : ''}`}>
          <div className="course-detail__copy">
            <p className="sub-title">{course.label}</p>
            <h2 className="sec-title" id={`${course.id}-title`}>
              {course.title}
            </h2>
            <TitleBorder />
            <p className="course-detail__meta">{course.meta}</p>
            <p className="course-detail__body">{course.body}</p>
            {course.list ? (
              <ul className="course-detail__list">
                {course.list.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            {course.note ? <p className="course-detail__note">{course.note}</p> : null}
            {course.hospital ? (
              <div className="course-hospital-tieup">
                <p className="course-hospital-tieup__label">Hospital Tie-Up</p>
                <p>{course.hospital}</p>
              </div>
            ) : null}
            {course.eligibility ? (
              <div className="eligibility-box">
                <h4>Eligibility for All Programs</h4>
                <p>
                  <strong>Pass in +2 with any one of the following groups:</strong>
                  <br />
                  <strong>Group A1:</strong> Physics, Chemistry, Maths and Biology
                  <br />
                  <strong>Group A2:</strong> Physics, Chemistry, Maths or Biology &amp; Computer Science
                  <br />
                  <strong>Group B:</strong> Physics, Chemistry, Botany and Zoology
                </p>
              </div>
            ) : null}
          </div>
          <figure className="course-detail__media">
            <img src={course.image} alt={course.title} width="800" height="600" loading="lazy" />
          </figure>
        </Fade>
      </div>
    </section>
  )
}

export default function CoursesPage() {
  const { site, courses } = useCms()
  const programs = (courses?.programs || []).filter((p) => p.published !== false)

  const byKey = (name) =>
    programs.find((p) => String(p.name || '').toLowerCase().includes(String(name).toLowerCase()))

  const details = COURSE_DETAILS.map((course) => {
    const match = byKey(course.title)
    if (!match) return course
    const duration = match.duration || ''
    const intake = match.intake != null && match.intake !== '' ? match.intake : ''
    const meta =
      duration && intake
        ? `Duration: ${duration} · Intake: ${intake}`
        : course.meta
    return {
      ...course,
      meta,
      body: match.summary || course.body,
      hospital: match.hospitalTieUp?.role || match.hospitalTieUp?.name || course.hospital,
    }
  })

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Courses' }]}
        title={courses?.heroTitle || 'Programmes Offered'}
        subtitle={courses?.heroSubtitle || 'The right pharmacy programs for you'}
      />
      <AcademicsSubnav />

      <div className="courses-details">
        {details.map((course, i) => (
          <CourseDetail key={course.id} course={course} soft={i % 2 === 1} />
        ))}
      </div>

      <section className="page-cta-band" aria-label="Admissions">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Ready to join?</h2>
            <p>Talk to Admin about eligibility, Code {site.code}, and campus visits.</p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/admissions" className="btn btn--light btn--lg">
              Admissions →
            </Link>
            <Link to="/departments" className="btn btn--outline-light btn--lg">
              Departments →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
