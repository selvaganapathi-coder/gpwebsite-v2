import { Link } from 'react-router-dom'
import { whatsappUrl } from '../lib/site'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import HubSubnav from '../components/resources/HubSubnav'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

function ResourceCard({ index, title, desc, to, href, label }) {
  const link = to ? (
    <Link to={to}>{label}</Link>
  ) : (
    <a href={href}>{label}</a>
  )
  return (
    <article className="resource-card">
      <div className="resource-card__index" aria-hidden="true">
        {String(index).padStart(2, '0')}
      </div>
      <div className="resource-card__body">
        <h3>{title}</h3>
        <p>{desc}</p>
        {link}
      </div>
    </article>
  )
}

const STUDENT_CARDS = [
  {
    title: 'Academic Calendar & Notices',
    desc: 'Semester schedules, holidays, exam notices, and campus updates.',
    to: '/news',
    label: 'View notices →',
  },
  {
    title: 'Courses & Labs',
    desc: 'Program details, syllabus overview, and practical training pathways.',
    to: '/courses',
    label: 'Explore courses →',
  },
  {
    title: 'College Magazine',
    desc: 'GP Pharmaceutica — browse campus writing category-wise.',
    to: '/magazine',
    label: 'Read magazine →',
  },
  {
    title: 'Student Activities',
    desc: 'Pharmacy Week, seminars, visits, culture, sports, NSS, and student clubs.',
    to: '/student-activities',
    label: 'View activities →',
  },
  {
    title: 'Hostel & Transport',
    desc: 'Separate hostels, amenities, and college bus routes for daily commute.',
    to: '/contact',
    label: 'Ask the office →',
  },
  {
    title: 'Career guidance',
    desc: 'Talk to Admin about hospital, industry, and community pharmacy paths.',
    to: '/contact',
    label: 'Contact office →',
  },
  {
    title: 'Safety & Anti-Ragging',
    desc: 'Zero tolerance. Report concerns to the Principal immediately.',
    href: 'tel:PRINCIPAL',
    label: 'Call Principal →',
  },
  {
    title: 'Placements',
    desc: 'Training, recruiters, and placement support for pharmacy careers.',
    to: '/placements',
    label: 'Placement portal →',
  },
]

const PARENT_CARDS = [
  {
    title: 'Talk to Admin',
    desc: 'Ask about counselling code, eligibility, fees clarity, hostel and campus visit.',
    to: '/admissions',
    label: 'Connect with office →',
  },
  {
    title: 'Courses & careers',
    desc: 'See program duration, intake and pathways after pharmacy.',
    to: '/courses',
    label: 'View courses →',
  },
  {
    title: 'Hostel & safety',
    desc: 'Separate hostels, campus facilities and transport details.',
    to: '/contact',
    label: 'Ask the office →',
  },
  {
    title: 'Approvals & trust',
    desc: 'Mandatory disclosure, affiliation and institutional transparency.',
    to: '/mandatory-disclosure',
    label: 'View disclosure →',
  },
]

const PARENT_KNOW = [
  { label: 'College', value: 'G.P. COLLEGE, Tirupattur (Jolarpet)' },
  { label: 'Counselling Code', value: 'CODE', highlight: true },
  { label: 'Approvals', value: 'PCI · TN Dr. M.G.R. Medical University' },
  { label: 'Programs', value: 'D.Pharm · B.Pharm · M.Pharm · Pharm-D' },
  {
    label: 'How to join',
    value: 'Through TN paramedical counselling — then talk to our office for guidance',
  },
  {
    label: 'Helpline',
    value: 'HELPLINE',
  },
]

const PARENT_DOCS = [
  'Student’s Class X mark sheet',
  'HSC / +2 mark sheet (both sides)',
  'Transfer Certificate',
  'Community Certificate',
  'Nativity Certificate',
  'Parent community certificate (if asked)',
  'Passport-size photos of the student',
  'Aadhaar / ID proof of student & parent',
]

export default function ResourcesPage() {
  const { site } = useCms()
  const studentCards = STUDENT_CARDS.map((card) =>
    card.href === 'tel:PRINCIPAL' ? { ...card, href: `tel:${site.phoneAlt}` } : card,
  )
  const parentKnow = PARENT_KNOW.map((row) => {
    if (row.value === 'CODE') return { ...row, value: site.code }
    if (row.value === 'HELPLINE') {
      return {
        ...row,
        value: (
          <>
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> · Mon–Sat, 9 AM – 4 PM
          </>
        ),
      }
    }
    return row
  })

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Community Hub' }]}
        title="Community Hub"
        subtitle="Students, parents, staff & management — connected for every pharmacy journey"
      />
      <HubSubnav />

      {/* Students */}
      <section className="hub-audience hub-audience--students section" id="students">
        <div className="container">
          <Fade className="hub-audience__intro">
            <div className="hub-audience__copy">
              <p className="home-section-eyebrow">Students ↔ College</p>
              <h2 className="section__title">For students</h2>
              <p className="section__desc hub-audience__lead">
                Everything you need for academics, campus life, and career readiness — from notices to
                courses.
              </p>
            </div>
            <div className="hub-audience__spotlight">
              <strong>Code {site.code}</strong>
              <span>Your counselling identity for admissions &amp; campus support</span>
              <div className="hub-audience__spotlight-actions">
                <Link to="/news" className="btn btn--red">
                  Notices
                </Link>
                <Link to="/contact" className="btn btn--outline-dark">
                  Contact
                </Link>
              </div>
            </div>
          </Fade>

          <Fade className="resource-grid resource-grid--students anim-stagger">
            {studentCards.map((card, i) => (
              <ResourceCard key={card.title} index={i + 1} {...card} />
            ))}
          </Fade>

          <Fade className="hub-quickbar">
            <p>
              Need help today? Call the office or message Admin on WhatsApp.
            </p>
            <div className="hub-quickbar__actions">
              <a href={`tel:${site.phone}`} className="btn btn--outline-dark">
                Call {site.phoneDisplay}
              </a>
              <a
                href={whatsappUrl()}
                className="btn btn--amber"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* Parents */}
      <section className="hub-audience hub-audience--parents section section--soft" id="parents">
        <div className="container">
          <Fade className="hub-audience__intro hub-audience__intro--parents">
            <div className="hub-audience__copy">
              <p className="home-section-eyebrow">Parents ↔ College</p>
              <h2 className="section__title">For parents</h2>
              <p className="section__desc hub-audience__lead">
                When you visit this website, here is what you need to know — and what to keep ready for
                your ward’s admission.
              </p>
            </div>
            <aside className="hub-code-panel" aria-label="Counselling code">
              <span className="hub-code-panel__label">Counselling Code</span>
              <strong className="hub-code-panel__code">{site.code}</strong>
              <span className="hub-code-panel__hint">Use this code in TN paramedical counselling</span>
              <Link to="/admissions" className="btn btn--amber">
                Talk to Admin →
              </Link>
            </aside>
          </Fade>

          <Fade className="parent-essentials">
            <div className="parent-essentials__know">
              <h3>What parents should know</h3>
              <ul className="parent-fact-list">
                {parentKnow.map((row) => (
                  <li key={row.label} className={row.highlight ? 'is-highlight' : undefined}>
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="parent-essentials__provide">
              <h3>What parents need to provide</h3>
              <p className="parent-essentials__intro">
                Keep these documents ready for counselling / college verification:
              </p>
              <ul className="parent-doc-list">
                {PARENT_DOCS.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
              <p className="parent-essentials__note">
                Exact checklist can vary by counselling rules — confirm with our office before you visit.
              </p>
            </div>
          </Fade>

          <Fade className="resource-grid resource-grid--parents anim-stagger">
            {PARENT_CARDS.map((card, i) => (
              <ResourceCard key={card.title} index={i + 1} {...card} />
            ))}
          </Fade>

          <Fade className="info-banner hub-parent-banner">
            <div>
              <p>
                <strong>Parent helpline:</strong> Call{' '}
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> · Campus visits Mon–Sat, 9 AM – 4
                PM
              </p>
            </div>
            <div className="hub-parent-banner__actions">
              <Link to="/admissions" className="btn btn--amber">
                Talk to Admin
              </Link>
              <a
                href={whatsappUrl(`Hi, I am a parent. I need admission info — Code ${site.code}.`)}
                className="btn btn--outline-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* Staff */}
      <section className="hub-audience section" id="staff">
        <div className="container">
          <Fade className="hub-audience__head">
            <p className="home-section-eyebrow">Staff ↔ Management</p>
            <h2 className="section__title">For staff &amp; faculty</h2>
            <p className="section__desc hub-audience__lead">
              Teaching, mentoring, and research — supported by clear leadership and shared academic
              goals.
            </p>
          </Fade>
          <Fade className="resource-grid anim-stagger">
            <ResourceCard
              index={1}
              title="Departments"
              desc="Pharmaceutics, pharmacology, analysis, and clinical focus areas."
              to="/departments"
              label="Departments →"
            />
            <ResourceCard
              index={2}
              title="Research & Innovation"
              desc="Projects, publications, and industry collaboration."
              to="/research"
              label="Research →"
            />
            <ResourceCard
              index={3}
              title="AMC – PvPI"
              desc="ADR Monitoring Centre serving Tirupattur District under PvPI."
              to="/amc"
              label="View AMC →"
            />
            <ResourceCard
              index={4}
              title="Principal’s Office"
              desc="Academic leadership, student welfare, and campus coordination."
              to="/about/principal"
              label="Meet Principal →"
            />
          </Fade>
        </div>
      </section>

      {/* Management */}
      <section className="hub-audience section section--soft" id="management">
        <div className="container">
          <Fade className="hub-audience__head">
            <p className="home-section-eyebrow">Management ↔ College Community</p>
            <h2 className="section__title">For management &amp; leadership</h2>
            <p className="section__desc hub-audience__lead">
              GP Group vision guiding staff, students, and families toward excellence in pharmacy
              education.
            </p>
          </Fade>
          <Fade className="resource-grid anim-stagger">
            <ResourceCard
              index={1}
              title="About Management"
              desc="Chairman’s vision and the GP Group education legacy since 1979."
              to="/about/management"
              label="Management →"
            />
            <ResourceCard
              index={2}
              title="About the College"
              desc="Mission, approvals, and the story of Tirupattur’s first pharmacy college."
              to="/about"
              label="About Us →"
            />
            <ResourceCard
              index={3}
              title="Contact Office"
              desc="Reach Admin for institutional and admissions coordination."
              to="/contact"
              label="Contact →"
            />
          </Fade>
        </div>
      </section>
    </>
  )
}
