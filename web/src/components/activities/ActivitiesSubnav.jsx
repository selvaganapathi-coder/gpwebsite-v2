import { NavLink, useLocation } from 'react-router-dom'
import { ACTIVITIES_SUBNAV } from '../../data/studentActivities'

export default function ActivitiesSubnav() {
  const { pathname, hash } = useLocation()

  return (
    <nav className="activities-subnav page-subnav" aria-label="Student activities">
      <div className="container">
        <ul className="activities-subnav__list page-subnav__list">
          {ACTIVITIES_SUBNAV.map((item) => {
            const itemHash = item.to.includes('#') ? `#${item.to.split('#')[1]}` : ''
            const active =
              pathname.startsWith('/student-activities') &&
              (hash === itemHash || (!hash && item.id === 'learning'))
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={`activities-subnav__link page-subnav__link${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
