import { Link } from 'react-router-dom'

export default function HomeSideRail() {
  return (
    <aside className="home-side-rail" aria-label="Quick links">
      <Link to="/admissions" className="home-side-rail__tab home-side-rail__tab--admit">
        Admissions
      </Link>
      <Link to="/contact" className="home-side-rail__tab home-side-rail__tab--contact">
        Contact
      </Link>
    </aside>
  )
}
