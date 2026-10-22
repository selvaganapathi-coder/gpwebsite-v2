import { NavLink, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/resources#students', id: 'students', label: 'Students' },
  { to: '/resources#parents', id: 'parents', label: 'Parents' },
  { to: '/resources#staff', id: 'staff', label: 'Staff & Faculty' },
  { to: '/resources#management', id: 'management', label: 'Management' },
]

export default function HubSubnav() {
  const { hash } = useLocation()
  const active = (hash || '#students').replace('#', '') || 'students'

  return (
    <nav className="hub-subnav page-subnav" aria-label="Community audiences">
      <div className="container">
        <ul className="hub-subnav__list page-subnav__list">
          {ITEMS.map((item) => {
            const on = active === item.id
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={`hub-subnav__link page-subnav__link${on ? ' active' : ''}`}
                  aria-current={on ? 'page' : undefined}
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
