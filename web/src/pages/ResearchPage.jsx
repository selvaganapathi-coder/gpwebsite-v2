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

const MODULES = [
  { href: '#research-centres', title: 'Research Centres', small: 'Core facilities' },
  { href: '#publications', title: 'Faculty Publications', small: 'Peer-reviewed papers' },
  { href: '#patents', title: 'Patents', small: 'IP & innovations' },
  { href: '#projects', title: 'Projects', small: 'Funded research' },
  { href: '#conferences', title: 'Conferences', small: 'Presentations' },
  { href: '#journals', title: 'Journals', small: 'Indexed publications' },
  { href: '#student-research', title: 'Student Research', small: 'UG & PG work' },
  { href: '#collaborations', title: 'Collaborations', small: 'Academic partners' },
  { href: '#industry-research', title: 'Industry Research', small: 'Pharma partnerships' },
]

const CENTRES = [
  {
    eyebrow: '01',
    title: 'Centre for Pharmaceutics Research',
    desc: 'Novel drug delivery systems, nanotechnology, and formulation development.',
    tag: 'M.Pharm — Pharmaceutics',
  },
  {
    eyebrow: '02',
    title: 'Centre for Pharmaceutical Analysis',
    desc: 'Method development, validation, and quality control of pharmaceutical products.',
    tag: 'M.Pharm — Analysis',
  },
  {
    eyebrow: '03',
    title: 'Centre for Regulatory Affairs',
    desc: 'Drug approval processes, pharmacovigilance, and compliance research — linked to our AMC under PvPI.',
    tag: 'M.Pharm — Regulatory',
  },
]

const PATENTS = [
  { num: 'IN-2024-001', title: 'Novel transdermal patch formulation', meta: 'Pharmaceutics · Granted 2024' },
  { num: 'IN-2024-002', title: 'Herbal wound healing composition', meta: 'Pharmacognosy · Filed 2024' },
  { num: 'IN-2023-003', title: 'Stability-indicating HPLC method', meta: 'Analysis · Granted 2023' },
  { num: 'IN-2023-004', title: 'Fast-dissolving oral film device', meta: 'Pharmaceutics · Filed 2023' },
]

const CONFERENCES = [
  {
    year: '2025',
    title: 'PCI National Pharmacy Conference',
    meta: 'Poster: Formulation optimization of gastro-retentive drug delivery · Chennai',
  },
  {
    year: '2025',
    title: 'International Pharma Summit',
    meta: 'Oral presentation: Regulatory updates in generic drug approvals · Bengaluru',
  },
  {
    year: '2024',
    title: 'TN Dr. M.G.R. Medical University Research Meet',
    meta: 'Faculty & student presentations across all departments · Chennai',
  },
]

const JOURNALS = [
  'International Journal of Pharmacy & Pharmaceutical Sciences',
  'Asian Journal of Pharmaceutical Analysis',
  'Research Journal of Pharmacy & Technology',
  'Journal of Pharmaceutical Regulatory Affairs',
  'Indian Journal of Pharmaceutical Sciences',
  'International Journal of Drug Delivery',
]

const STUDENT_STEPS = [
  {
    title: 'B.Pharm Projects',
    desc: 'Six-month research projects in formulation, analysis, and pharmacology under faculty guidance.',
  },
  {
    title: 'M.Pharm Dissertations',
    desc: 'Two-year PG research with publication targets and industry-relevant outcomes.',
  },
  {
    title: 'Conference Papers',
    desc: 'Students present posters and papers at national pharmacy conferences annually.',
  },
  {
    title: 'Research Awards',
    desc: 'Best paper and best poster awards at university and state-level events.',
  },
]

const COLLABS = [
  {
    title: 'TN Dr. M.G.R. Medical University',
    desc: 'Affiliated research programmes and faculty exchange',
  },
  { title: 'PCI Research Network', desc: 'National pharmacy research initiatives' },
  {
    title: 'Regional Medical Colleges',
    desc: 'Clinical pharmacy and hospital research tie-ups',
  },
  { title: 'ICMR & DST Schemes', desc: 'Funding proposals for faculty research projects' },
]

const PARTNERS = ['Sun Pharma', 'Cipla', "Dr. Reddy's", 'Biocon', 'Lupin', 'Aurobindo']

export default function ResearchPage() {
  const { research, site } = useCms()
  const publications = research.publications || []
  const projects = research.projects || []

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Research & Innovation' }]}
        title={research.heroTitle}
        subtitle={research.heroSubtitle}
      />
      <AcademicsSubnav />

      <section className="section" id="overview">
        <div className="container">
          <Fade className="research-overview research-hero">
            <div className="research-overview__copy research-hero__content">
              <p className="home-section-eyebrow">Research Excellence</p>
              <h2 className="section__title research-hero__title">Driving Pharmacy Research Forward</h2>
              <p className="research-hero__desc">
                From novel drug formulations to quality analysis and regulatory science — our faculty
                and students contribute to peer-reviewed publications, funded projects, and industry
                collaborations.
              </p>
              <p className="research-hero__note">
                Lab work across Pharmaceutics, Chemistry, Pharmacology &amp; Pharmacognosy — aligned to
                PCI {site.pci}.
              </p>
            </div>
            <div className="research-stats">
              <div className="research-stat">
                <strong>16</strong>
                <span>Laboratories</span>
              </div>
              <div className="research-stat">
                <strong>3</strong>
                <span>M.Pharm tracks</span>
              </div>
              <div className="research-stat">
                <strong>{site.code}</strong>
                <span>Counselling code</span>
              </div>
              <div className="research-stat">
                <strong>PCI</strong>
                <span>Approved · {site.pci}</span>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Explore</span>
            <h2 className="section__title">Research Areas</h2>
          </Fade>
          <Fade className="research-modules research-modules-grid anim-stagger">
            {MODULES.map((m) => (
              <a key={m.href} href={m.href} className="research-module">
                <strong>{m.title}</strong>
                <small>{m.small}</small>
              </a>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section" id="research-centres">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Facilities</span>
            <h2 className="section__title">Research Centres</h2>
            <p className="section__desc">
              Department-linked centres supporting formulation, analysis, and regulatory research.
            </p>
          </Fade>
          <Fade className="research-cards anim-stagger">
            {CENTRES.map((c) => (
              <article key={c.title} className="research-card">
                <span className="research-card__eyebrow">{c.eyebrow}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="research-card__tag">{c.tag}</span>
              </article>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="publications">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Publications</span>
            <h2 className="section__title">Faculty Publications</h2>
            <p className="section__desc">Selected publications — full archive will expand with ERP sync.</p>
          </Fade>
          <Fade>
            <ul className="research-list">
              {publications.map((p) => (
                <li key={p.title} className="research-list__item">
                  <span className="research-list__year">{p.year}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
      </section>

      <section className="section" id="patents">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Innovation</span>
            <h2 className="section__title">Patents</h2>
            <p className="section__desc">Sample IP filings and grants from pharmacy research.</p>
          </Fade>
          <Fade className="patent-grid anim-stagger">
            {PATENTS.map((p) => (
              <article key={p.num} className="patent-card">
                <span className="patent-card__num">{p.num}</span>
                <strong>{p.title}</strong>
                <p>{p.meta}</p>
              </article>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="projects">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Projects</span>
            <h2 className="section__title">Research Projects</h2>
          </Fade>
          <Fade className="research-cards anim-stagger">
            {projects.map((p) => (
              <article key={p.title} className="research-card">
                <span className="research-card__eyebrow">{p.eyebrow}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="research-card__tag">{p.tag}</span>
              </article>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section" id="conferences">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Conferences</span>
            <h2 className="section__title">Conference Presentations</h2>
            <p className="section__desc">National and international conference participation.</p>
          </Fade>
          <Fade>
            <ul className="research-list">
              {CONFERENCES.map((c) => (
                <li key={c.title} className="research-list__item">
                  <span className="research-list__year">{c.year}</span>
                  <div>
                    <strong>{c.title}</strong>
                    <p>{c.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="journals">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Journals</span>
            <h2 className="section__title">Indexed Journal Publications</h2>
          </Fade>
          <Fade className="journal-list journal-chips">
            {JOURNALS.map((j) => (
              <span key={j} className="journal-item journal-chip">
                {j}
              </span>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section" id="student-research">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Students</span>
            <h2 className="section__title">Student Research</h2>
            <p className="section__desc">
              UG projects, M.Pharm dissertations, and conference presentations by students.
            </p>
          </Fade>
          <Fade className="research-steps steps">
            {STUDENT_STEPS.map((s) => (
              <div key={s.title} className="research-step step-card">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="collaborations">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Partners</span>
            <h2 className="section__title">Academic Collaborations</h2>
          </Fade>
          <Fade className="collab-grid anim-stagger">
            {COLLABS.map((c) => (
              <div key={c.title} className="collab-card">
                <strong>{c.title}</strong>
                <p>{c.desc}</p>
              </div>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section" id="industry-research">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">Industry</span>
            <h2 className="section__title">Industry Research Partnerships</h2>
            <p className="section__desc">
              Collaborative R&amp;D with pharmaceutical companies for method validation, formulation
              support, and internship-linked research.
            </p>
          </Fade>
          <Fade className="research-partners company-logos">
            {PARTNERS.map((name) => (
              <div key={name} className="research-partner company-logo">
                <span>{name}</span>
              </div>
            ))}
          </Fade>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Fade className="research-cta-strip">
            <div>
              <h2>Research enquiries</h2>
              <p>
                Call {site.phoneDisplay} or write to the research cell for collaboration and project
                guidance.
              </p>
            </div>
            <div className="research-cta-strip__actions">
              <a href={`tel:${site.phone}`} className="btn btn--amber btn--lg">
                Call
              </a>
              <Link to="/contact" className="btn btn--light btn--lg">
                Contact Research Cell →
              </Link>
              <Link to="/amc" className="btn btn--outline-light btn--lg">
                AMC – PvPI →
              </Link>
            </div>
          </Fade>
        </div>
      </section>
    </>
  )
}
