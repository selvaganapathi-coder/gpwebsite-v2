import { Link } from 'react-router-dom'
import { whatsappUrl } from '../../lib/site'
import { useCms } from '../../context/CmsContext'

export default function MobileDock() {
  const { site } = useCms()

  return (
    <nav className="mobile-dock" aria-label="Mobile quick actions">
      <a href={`tel:${site.phone}`}>
        <span className="mobile-dock__ico mobile-dock__ico--call" aria-hidden="true" />
        Call
      </a>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
        <span className="mobile-dock__ico mobile-dock__ico--wa" aria-hidden="true" />
        WhatsApp
      </a>
      <Link to="/resources#parents">
        <span className="mobile-dock__ico mobile-dock__ico--parents" aria-hidden="true" />
        Parents
      </Link>
      <Link to="/courses">
        <span className="mobile-dock__ico mobile-dock__ico--courses" aria-hidden="true" />
        Courses
      </Link>
    </nav>
  )
}
