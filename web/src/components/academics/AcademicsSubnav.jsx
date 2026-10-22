import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/courses', label: 'Courses' },
  { to: '/amc', label: 'AMC – PvPI' },
  { to: '/research', label: 'Research' },
]

export default function AcademicsSubnav() {
  return (
    <nav className="academics-subnav page-subnav" aria-label="Academics section">
      <div className="container">
        <ul className="academics-subnav__list page-subnav__list">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `academics-subnav__link page-subnav__link${isActive ? ' active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
