import { Link } from 'react-router-dom'
import { whatsappUrl } from '../lib/site'
import { useCms } from '../context/CmsContext'

const HTML_FILE = {
  about: 'about.html',
  'about-management': 'about-management.html',
  'about-principal': 'about-principal.html',
  admissions: 'admissions.html',
  contact: 'contact.html',
  courses: 'courses.html',
  campus: 'campus.html',
  placements: 'placements.html',
  faculty: 'faculty.html',
  departments: 'departments.html',
  resources: 'resources.html',
  news: 'news.html',
  events: 'events.html',
  gallery: 'gallery.html',
  alumni: 'alumni.html',
  'route-map': 'route-map.html',
  research: 'research.html',
  'mandatory-disclosure': 'mandatory-disclosure.html',
  erp: 'erp.html',
  blog: 'blog.html',
  magazine: 'magazine.html',
  'placed-students': 'placed-students.html',
}

export default function PlaceholderPage({ pageKey, title }) {
  const { site } = useCms()
  const heading = title || 'Coming soon'
  const htmlFile = HTML_FILE[pageKey] || `${pageKey}.html`

  return (
    <main className="section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '40rem' }}>
        <p className="home-section-eyebrow">React stub</p>
        <h1 className="section__title" style={{ textAlign: 'left' }}>
          {heading}
        </h1>
        <p className="section__desc" style={{ marginTop: '1rem' }}>
          Not ported to React yet in this pass. Shared chrome is live; open the HTML page on :3001 for
          full content.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Link to="/" className="btn btn--red">
            ← Home
          </Link>
          <Link to="/admissions" className="btn btn--outline-dark">
            Talk to Admin
          </Link>
          <a href={`tel:${site.phone}`} className="btn btn--outline-dark">
            Call
          </a>
          <a href={whatsappUrl()} className="btn btn--amber" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a
            href={`http://localhost:3001/${htmlFile}`}
            className="btn btn--outline-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open HTML version →
          </a>
        </div>
      </div>
    </main>
  )
}
