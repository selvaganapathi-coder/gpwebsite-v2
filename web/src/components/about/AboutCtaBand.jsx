import { Link } from 'react-router-dom'
import { whatsappUrl } from '../../lib/site'
import { useCms } from '../../context/CmsContext'

export default function AboutCtaBand({ title = 'Need admissions guidance?', lead }) {
  const { site } = useCms()
  const text =
    lead ||
    `Talk to our office for D.Pharm, B.Pharm, M.Pharm & Pharm-D — Counselling Code ${site.code}.`

  return (
    <section className="about-page-cta page-cta-band" aria-label="Talk to Admin">
      <div className="container about-page-cta__inner page-cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="about-page-cta__actions page-cta-band__actions">
          <Link to="/admissions" className="btn btn--amber btn--lg">
            Talk to Admin →
          </Link>
          <a href={`tel:${site.phone}`} className="btn btn--light btn--lg">
            Call
          </a>
          <a
            href={whatsappUrl()}
            className="btn btn--outline-light btn--lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
