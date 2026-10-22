import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import AcademicsSubnav from '../components/academics/AcademicsSubnav'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function FacultyPage() {
  const { faculty } = useCms()
  const members = faculty?.members || []

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Academics', to: '/departments' },
          { label: 'Faculty' },
        ]}
        title={faculty.heroTitle}
        subtitle={faculty.heroSubtitle}
      />

      <AcademicsSubnav />

      <section className="section faculty-staff-section" aria-labelledby="staff-details-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">People</p>
            <h2 className="section__title" id="staff-details-title">
              Department-Wise Staff Details
            </h2>
            <p className="section__desc">
              Faculty listed by department with qualification and designation.
            </p>
          </Fade>

          <Fade className="disclosure-table-wrap faculty-staff-table-wrap">
            <table className="disclosure-table disclosure-table--programs faculty-staff-table">
              <thead>
                <tr>
                  <th scope="col">Staff Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Degree / Qualification</th>
                  <th scope="col">Designation</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td data-label="Staff Name">{m.name}</td>
                    <td data-label="Department">{m.department || '—'}</td>
                    <td data-label="Degree / Qualification">{m.qualification || '—'}</td>
                    <td data-label="Designation">{m.designation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fade>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Fade className="grid-2">
            <div>
              <span className="section__label">Departments</span>
              <h2 className="section__title section__title--left" style={{ textAlign: 'left' }}>
                Academic Structure
              </h2>
              <ul className="checklist">
                <li>Department of Pharmaceutics (M.Pharm — 15 seats)</li>
                <li>Department of Pharmaceutical Analysis (M.Pharm — 15 seats)</li>
                <li>Department of Pharmaceutical Regulatory Affairs (M.Pharm — 15 seats)</li>
                <li>Department of Pharmaceutical Chemistry</li>
                <li>Department of Pharmacology</li>
                <li>Department of Pharmacognosy</li>
                <li>Department of Pharmacy Practice (Pharm-D)</li>
              </ul>
              <Link to="/departments" className="btn btn--red" style={{ marginTop: '1rem' }}>
                Explore All Departments →
              </Link>
            </div>
            <div className="img-frame">
              <img
                src="https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College22.jpg"
                alt="Faculty at G.P. Pharmacy College"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Fade>
        </div>
      </section>
    </>
  )
}
