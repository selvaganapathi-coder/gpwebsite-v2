import { Link } from 'react-router-dom'
import PageHero from '../components/media/PageHero'
import AboutSubnav from '../components/about/AboutSubnav'
import AboutCtaBand from '../components/about/AboutCtaBand'
import { useFadeUp } from '../hooks/useFadeUp'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

const POLICIES = [
  {
    id: 'anti-ragging',
    title: 'Anti-Ragging',
    body: [
      'G.P. COLLEGE maintains a zero-tolerance policy against ragging in accordance with UGC regulations and Tamil Nadu government directives.',
      'Any form of ragging — physical, verbal, or online — is strictly prohibited on campus, in hostels, and during college-related activities.',
    ],
    contacts: [
      { label: 'National Anti-Ragging Helpline', value: '1800-180-5522', href: 'tel:18001805522' },
      {
        label: 'Email',
        value: 'helpline@antiragging.in',
        href: 'mailto:helpline@antiragging.in',
      },
      { label: 'Emergency', value: '112', href: 'tel:112' },
      { label: 'Women Helpline', value: '181', href: 'tel:181' },
    ],
  },
  {
    id: 'grievance',
    title: 'Grievance Redressal',
    body: [
      'Students and parents may submit academic or campus grievances in writing to the Principal. The college will acknowledge and respond within a reasonable timeframe.',
      'Grievances related to admissions, facilities, or faculty may also be raised through the Contact / enquiry form or by calling the college office.',
    ],
    contacts: [
      { label: 'Principal', value: 'Prof. Dr. S. Thenmozhi' },
      { label: 'Phone', value: '', phoneKey: 'phoneAlt' },
      { label: 'Email', value: '', emailKey: 'principalEmail' },
    ],
  },
  {
    id: 'icc',
    title: 'Internal Complaints Committee',
    body: [
      'The Internal Complaints Committee (ICC) addresses complaints related to sexual harassment and ensures a safe, respectful campus for students and staff, as required under applicable law.',
      'Complaints may be submitted confidentially to the Principal / ICC convenor. The institution follows due process while protecting the dignity of all parties.',
    ],
    contacts: [
      { label: 'Reach office', value: '', phoneKey: 'phone' },
      { label: 'College email', value: '', emailKey: 'email' },
      { label: 'Principal email', value: '', emailKey: 'principalEmail' },
    ],
  },
]

export default function AboutPoliciesPage() {
  const { site } = useCms()

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'About', to: '/about' }, { label: 'Policies' }]}
        title="Policies"
        subtitle="Anti-ragging, grievance redressal, and Internal Complaints Committee"
      />
      <AboutSubnav />

      <section className="section disclosure-page">
        <div className="container">
          <div className="disclosure-grid">
            {POLICIES.map((policy) => (
              <Fade key={policy.id} className="disclosure-card disclosure-card--full">
                <div id={policy.id} className="about-policy-anchor">
                  <h2>{policy.title}</h2>
                  {policy.body.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                  <ul className="disclosure-checklist">
                    {policy.contacts.map((c) => {
                      let value = c.value
                      let href = c.href
                      if (c.phoneKey) {
                        value = site[`${c.phoneKey}Display`] || site[c.phoneKey]
                        href = `tel:${site[c.phoneKey]}`
                      }
                      if (c.emailKey) {
                        value = site[c.emailKey]
                        href = `mailto:${site[c.emailKey]}`
                      }
                      return (
                        <li key={c.label + value}>
                          <strong>{c.label}: </strong>
                          {href ? <a href={href}>{value}</a> : value}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      <AboutCtaBand />
    </>
  )
}
