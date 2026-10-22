import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '', id }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} id={id} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

const PROGRAMS = [
  { name: 'B.Pharm', duration: '4 years', intake: '100', remarks: 'UG degree' },
  { name: 'D.Pharm', duration: '2 years', intake: '60', remarks: 'Diploma' },
  { name: 'Pharm-D', duration: '6 years', intake: '30', remarks: 'Clinical pharmacy · GH Tirupattur tie-up' },
  {
    name: 'M.Pharm — Pharmaceutics',
    duration: '2 years',
    intake: '15',
    remarks: 'PG specialization',
  },
  {
    name: 'M.Pharm — Pharmaceutical Analysis',
    duration: '2 years',
    intake: '15',
    remarks: 'PG specialization',
  },
  {
    name: 'M.Pharm — Pharmaceutical Regulatory Affairs',
    duration: '2 years',
    intake: '15',
    remarks: 'PG specialization',
  },
  {
    name: 'B.Pharm Lateral Entry',
    duration: '3 years',
    intake: '10',
    remarks: 'Direct second year for D.Pharm holders',
  },
]

const INFRA = [
  'Pharmaceutical laboratories — 16 labs in total (Pharmaceutics, Chemistry, Analysis, Pharmacology & allied)',
  'Smart classrooms & AC digital library',
  'Computer & language labs',
  'Separate boys & girls hostels',
  'Campus transport & purified drinking water',
  'Seminar halls & sports facilities',
]

export default function MandatoryDisclosurePage() {
  const { site } = useCms()
  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Mandatory Disclosure' }]}
        title="Mandatory Disclosure"
        subtitle="Institutional information as per regulatory requirements — PCI"
      />

      <section className="section disclosure-page">
        <div className="container">
          <Fade className="disclosure-lead">
            <p>
              Public information for students and parents — Counselling Code{' '}
              <strong className="disclosure-code">{site.code}</strong>. Approvals, intake,
              infrastructure, and grievance contacts.
            </p>
            <div className="disclosure-lead__actions">
              <Link to="/admissions" className="btn btn--red">
                Talk to Admin →
              </Link>
              <Link to="/courses" className="btn btn--outline-dark">
                Courses →
              </Link>
            </div>
          </Fade>

          <div className="disclosure-grid">
            <Fade className="disclosure-card">
              <h2>Institution Details</h2>
              <div className="disclosure-table-wrap">
                <table className="disclosure-table">
                  <tbody>
                    <tr>
                      <th scope="row">Name</th>
                      <td>{site.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Address</th>
                      <td>{site.address}</td>
                    </tr>
                    <tr>
                      <th scope="row">Established</th>
                      <td>2019</td>
                    </tr>
                    <tr>
                      <th scope="row">Affiliation</th>
                      <td>{site.university || 'The Tamil Nadu Dr. M.G.R. Medical University'}</td>
                    </tr>
                    <tr>
                      <th scope="row">Counselling Code</th>
                      <td>
                        <strong>{site.code}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Principal</th>
                      <td>Prof. Dr. S. Thenmozhi, M.Pharm., Ph.D</td>
                    </tr>
                    <tr>
                      <th scope="row">Principal Email</th>
                      <td>
                        <a href={`mailto:${site.principalEmail}`}>{site.principalEmail}</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>
                        <a href={`mailto:${site.email}`}>{site.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Phone</th>
                      <td>
                        <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>,{' '}
                        <a href={`tel:${site.phoneAlt}`}>{site.phoneAltDisplay}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Fade>

            <Fade className="disclosure-card" id="pci">
              <h2>Approvals &amp; Recognition — PCI</h2>
              <div className="disclosure-table-wrap">
                <table className="disclosure-table">
                  <tbody>
                    <tr>
                      <th scope="row">PCI Approval</th>
                      <td>Yes — ID: {site.pci}</td>
                    </tr>
                    <tr>
                      <th scope="row">TN Government</th>
                      <td>G.O (Ms) No. {site.goMs || '460 & 464'}</td>
                    </tr>
                    <tr id="university">
                      <th scope="row">University Affiliation</th>
                      <td>{site.university || 'TN Dr. M.G.R. Medical University'}</td>
                    </tr>
                    <tr>
                      <th scope="row">Admission Mode</th>
                      <td>
                        TN Paramedical Degree Counselling (
                        <a
                          href="https://www.tnmedicalselection.org"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          tnmedicalselection.org
                        </a>
                        )
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Fade>

            <Fade className="disclosure-card" id="governing-body">
              <h2>Governing Body</h2>
              <p>
                G.P. COLLEGE is managed by the GP Group under the leadership of Chairman Er. G.
                Ponnusamy. Academic administration is led by the Principal and senior faculty.
              </p>
              <p className="disclosure-note">
                <Link to="/about/management">View Founder &amp; Management →</Link>
              </p>
            </Fade>

            <Fade className="disclosure-card disclosure-card--full">
              <h2>Programs &amp; Approved Intake</h2>
              <div className="disclosure-table-wrap">
                <table className="disclosure-table disclosure-table--programs">
                  <thead>
                    <tr>
                      <th scope="col">Program</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Approved Intake</th>
                      <th scope="col">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROGRAMS.map((row) => (
                      <tr key={row.name}>
                        <td data-label="Program">{row.name}</td>
                        <td data-label="Duration">{row.duration}</td>
                        <td data-label="Intake">{row.intake}</td>
                        <td data-label="Remarks">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="disclosure-note">
                For detailed course information visit <Link to="/courses">Courses</Link>.
              </p>
            </Fade>

            <Fade className="disclosure-card">
              <h2>Infrastructure</h2>
              <ul className="disclosure-checklist">
                {INFRA.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="disclosure-note">
                <Link to="/gallery">View Gallery →</Link>
              </p>
            </Fade>

            <Fade className="disclosure-card">
              <h2>Faculty</h2>
              <p>
                Qualified faculty across Pharmaceutics, Pharmaceutical Analysis, Pharmacology, and
                allied departments. Principal and faculty profiles are published on the website.
              </p>
              <p className="disclosure-note">
                <Link to="/about/principal">Principal&apos;s Message →</Link>
              </p>
            </Fade>

            <Fade className="disclosure-card">
              <h2>ADR Monitoring Centre (AMC) – PvPI</h2>
              <p>
                G.P. Pharmacy College is the second pharmacy college in Tamil Nadu to establish an ADR
                Monitoring Centre under PvPI, and serves as the AMC for Tirupattur District.
              </p>
              <p className="disclosure-note">
                <Link to="/amc">View AMC – PvPI →</Link>
              </p>
            </Fade>

            <Fade className="disclosure-card disclosure-card--full">
              <h2>Fee Structure (Indicative)</h2>
              <p className="disclosure-note">
                Official tuition and hostel fees are as per Tamil Nadu government / university norms
                and counselling allotment. Contact the admissions office for the current academic year
                fee schedule.
              </p>
              <div className="disclosure-table-wrap">
                <table className="disclosure-table">
                  <tbody>
                    <tr>
                      <th scope="row">Admission</th>
                      <td>
                        Through TN paramedical degree counselling — Code <strong>{site.code}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Enquiry</th>
                      <td>
                        <Link to="/contact">Contact form</Link> or call{' '}
                        <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Scholarships</th>
                      <td>
                        As per TN government rules; Pharm-D SC/ST scholarship opportunities
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Fade>

            <Fade className="disclosure-card" id="grievance">
              <h2>Grievance Redressal</h2>
              <p>
                Students and parents may submit grievances in writing to the Principal. The college
                will acknowledge and respond within a reasonable timeframe.
              </p>
              <p>
                <strong>Principal:</strong> Prof. Dr. S. Thenmozhi
                <br />
                <a href={`tel:${site.phoneAlt}`}>{site.phoneAltDisplay}</a> ·{' '}
                <a href={`mailto:${site.principalEmail}`}>{site.principalEmail}</a>
              </p>
            </Fade>

            <Fade className="disclosure-card" id="anti-ragging">
              <h2>Anti-Ragging</h2>
              <p>
                G.P. COLLEGE maintains a zero-tolerance policy against ragging in accordance
                with UGC regulations.
              </p>
              <p>
                <strong>National Anti-Ragging Helpline:</strong>{' '}
                <a href="tel:18001805522">1800-180-5522</a>
                <br />
                <strong>Email:</strong>{' '}
                <a href="mailto:helpline@antiragging.in">helpline@antiragging.in</a>
              </p>
            </Fade>
          </div>
        </div>
      </section>

      <section className="page-cta-band" aria-label="Admissions help">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Need help with Code {site.code}?</h2>
            <p>Talk to Admin for counselling guidance, documents, and campus visits.</p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/admissions" className="btn btn--amber btn--lg">
              Talk to Admin →
            </Link>
            <Link to="/contact" className="btn btn--light btn--lg">
              Contact →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
