import { NavLink, useLocation } from 'react-router-dom'
import { CAMPUS_SUBNAV } from '../../data/campusFacilities'

export default function CampusSubnav() {
  const { pathname, hash } = useLocation()

  return (
    <nav className="campus-subnav page-subnav" aria-label="Campus facilities">
      <div className="container">
        <ul className="campus-subnav__list page-subnav__list">
          {CAMPUS_SUBNAV.map((item) => {
            const itemHash = item.to.includes('#') ? `#${item.to.split('#')[1]}` : ''
            const active =
              pathname.startsWith('/campus') &&
              (hash === itemHash || (!hash && item.id === 'infrastructure'))
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={`campus-subnav__link page-subnav__link${active ? ' active' : ''}`}
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
