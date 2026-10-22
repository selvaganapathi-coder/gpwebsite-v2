import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/news', label: 'News' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/magazine', label: 'College Magazine' },
  { to: '/gallery', label: 'Gallery' },
]

export default function MediaSubnav() {
  return (
    <nav className="media-subnav" aria-label="Media section">
      <div className="container">
        <ul className="media-subnav__list">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `media-subnav__link${isActive ? ' active' : ''}`
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
