import { NavLink, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/about', label: 'About', id: 'about' },
  { to: '/about#vision-mission', label: 'Vision & Mission', id: 'about-vm' },
  { to: '/about/management', label: 'Management', id: 'about-management' },
  { to: '/about/principal', label: 'Principal', id: 'about-principal' },
  { to: '/mandatory-disclosure', label: 'Approvals', id: 'about-approvals' },
  { to: '/about/policies', label: 'Policies', id: 'about-policies' },
]

export default function AboutSubnav() {
  const { pathname, hash } = useLocation()

  return (
    <nav className="about-subnav page-subnav" aria-label="About section">
      <div className="container">
        <ul className="about-subnav__list page-subnav__list">
          {ITEMS.map((item) => {
            let active = false
            if (item.id === 'about') {
              active = pathname === '/about' && hash !== '#vision-mission' && hash !== '#college-profile'
            } else if (item.id === 'about-vm') {
              active = pathname === '/about' && hash === '#vision-mission'
            } else if (item.id === 'about-management') {
              active = pathname.startsWith('/about/management')
            } else if (item.id === 'about-principal') {
              active = pathname.startsWith('/about/principal')
            } else if (item.id === 'about-approvals') {
              active = pathname === '/mandatory-disclosure'
            } else if (item.id === 'about-policies') {
              active = pathname.startsWith('/about/policies')
            }
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={`about-subnav__link page-subnav__link${active ? ' active' : ''}`}
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
