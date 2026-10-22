import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'
import { useFadeUp } from '../../hooks/useFadeUp'

export default function Footer() {
  const { site } = useCms()
  const footerRef = useFadeUp()
  const portalsRef = useFadeUp()

  return (
    <footer className="footer fade-up" ref={footerRef}>
      <div className="container">
        <div className="footer__portals anim-stagger fade-up" ref={portalsRef}>
          <Link to="/resources#students" className="footer-portal">
            <strong>Students</strong>
            <small>Hub · courses · campus</small>
          </Link>
          <Link to="/resources#parents" className="footer-portal">
            <strong>Parents</strong>
            <small>What to know · documents</small>
          </Link>
          <Link to="/about/management" className="footer-portal">
            <strong>Management</strong>
            <small>Leadership · vision</small>
          </Link>
          <Link to="/admissions" className="footer-portal">
            <strong>Admissions</strong>
            <small>Talk to admin · Code {site.code}</small>
          </Link>
          <Link to="/contact" className="footer-portal">
            <strong>Contact</strong>
            <small>Office · phone · visit</small>
          </Link>
        </div>
        <div className="footer__grid">
          <div>
            <div className="footer__logo">
              <img src={site.logo} alt="G.P. COLLEGE" width="160" height="48" loading="lazy" />
            </div>
            <p className="footer__brand-name brand-name">
              <strong>{site.name}</strong>
            </p>
            <p className="footer__about">
              Next-gen pharmacy education since 2019. First pharmacy college in Tirupattur &amp;
              Vellore District. PCI approved · Counselling Code {site.code} · Affiliated to TN
              Dr. M.G.R. Medical University.
            </p>
          </div>
          <div>
            <h4>About</h4>
            <ul className="footer__links">
              <li>
                <Link to="/about">About the college</Link>
              </li>
              <li>
                <Link to="/about/management">Founder &amp; Management</Link>
              </li>
              <li>
                <Link to="/about/principal">Principal&apos;s Message</Link>
              </li>
              <li>
                <Link to="/mandatory-disclosure">Approvals &amp; Affiliations</Link>
              </li>
              <li>
                <Link to="/about/policies">Policies</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Academics</h4>
            <ul className="footer__links">
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li>
                <Link to="/student-activities">Student Activities</Link>
              </li>
              <li>
                <Link to="/research">Research</Link>
              </li>
              <li>
                <Link to="/amc">AMC – PvPI</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Community</h4>
            <ul className="footer__links">
              <li>
                <Link to="/news">News</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/magazine">College Magazine</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              <li>
                <Link to="/placements">Placements</Link>
              </li>
              <li>
                <Link to="/admissions">Admissions</Link>
              </li>
              <li>
                <Link to="/resources">Community Hub</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="footer__links">
              <li>
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`tel:${site.phoneAlt}`}>{site.phoneAltDisplay}</a>
              </li>
              <li>{site.address}</li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            <Link to="/">
              <strong className="brand-name">{site.name}</strong>
            </Link>
            . All Rights Reserved.
          </span>
          <span>
            Developed by{' '}
            <a
              href="https://selsu.vercel.app/?utm_source=gppharmacy&utm_medium=footer&utm_content=developed_by"
              target="_blank"
              rel="noopener noreferrer"
            >
              SELSU
            </a>
            {' · '}
            <Link to="/mandatory-disclosure">Mandatory Disclosure</Link> ·{' '}
            <Link to="/contact">Contact</Link> · <Link to="/admin">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
