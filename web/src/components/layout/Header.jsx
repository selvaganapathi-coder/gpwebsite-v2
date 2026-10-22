import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'
import { ABOUT_FLAT, ABOUT_MEGA_GROUPS } from '../../data/aboutNav'
import { ACTIVITIES_FLAT, ACTIVITIES_MEGA_GROUPS } from '../../data/studentActivities'

const NAV = [
  { to: '/', label: 'Home', id: 'home', end: true },
  {
    label: 'About',
    id: 'about',
    mega: true,
    groups: ABOUT_MEGA_GROUPS,
    children: ABOUT_FLAT,
  },
  { to: '/courses', label: 'Courses', id: 'courses' },
  {
    label: 'Activities',
    id: 'activities',
    mega: true,
    groups: ACTIVITIES_MEGA_GROUPS,
    children: ACTIVITIES_FLAT,
  },
  { to: '/resources#students', label: 'Students', id: 'resources' },
  { to: '/resources#parents', label: 'Parents', id: 'parents' },
  {
    label: 'More',
    id: 'more',
    children: [
      { to: '/amc', label: 'AMC – PvPI', id: 'amc' },
      { to: '/research', label: 'Research', id: 'research' },
      { to: '/placements', label: 'Placements', id: 'placements' },
      { to: '/news', label: 'News', id: 'media-news' },
      { to: '/events', label: 'Events', id: 'events' },
      { to: '/magazine', label: 'College Magazine', id: 'magazine' },
      { to: '/gallery', label: 'Gallery', id: 'gallery' },
      { to: '/route-map', label: 'Route Map', id: 'route-map' },
    ],
  },
  { to: '/admissions', label: 'Admissions', id: 'admissions' },
  { to: '/contact', label: 'Contact', id: 'contact' },
]

const MOBILE_NAV_GROUPS = [
  {
    items: [
      { to: '/', label: 'Home', id: 'home', icon: '•' },
      { to: '/admissions', label: 'Talk to Admin', id: 'admissions', icon: '•', highlight: true },
      { to: '/contact', label: 'Contact', id: 'contact', icon: '•' },
    ],
  },
  {
    label: 'About',
    items: ABOUT_FLAT.map((item) => ({ ...item, icon: '•' })),
  },
  {
    label: 'Campus',
    items: ACTIVITIES_FLAT.map((item) => ({ ...item, icon: '•' })),
  },
  {
    label: 'Activities',
    items: [
      { to: '/student-activities', label: 'Student Activities', id: 'activities', icon: '•' },
      ...ACTIVITIES_MEGA_GROUPS.flatMap((g) =>
        g.items.slice(0, 4).map((item) => ({ ...item, icon: '•' })),
      ),
    ],
  },
  {
    label: 'Explore',
    items: [
      { to: '/amc', label: 'AMC – PvPI', id: 'amc', icon: '•' },
      { to: '/research', label: 'Research', id: 'research', icon: '•' },
      { to: '/placements', label: 'Placements', id: 'placements', icon: '•' },
    ],
  },
  {
    label: 'Also',
    items: [
      { to: '/faculty', label: 'Faculty', id: 'faculty', icon: '•' },
      { to: '/amc', label: 'AMC – PvPI', id: 'amc', icon: '•' },
      { to: '/research', label: 'Research', id: 'research', icon: '•' },
      { to: '/placements', label: 'Placements', id: 'placements', icon: '•' },
      { to: '/alumni', label: 'Alumni', id: 'alumni', icon: '•' },
      { to: '/news', label: 'News', id: 'media-news', icon: '•' },
      { to: '/events', label: 'Events', id: 'events', icon: '•' },
      { to: '/magazine', label: 'College Magazine', id: 'magazine', icon: '•' },
      { to: '/gallery', label: 'Gallery', id: 'gallery', icon: '•' },
      { to: '/route-map', label: 'Route Map', id: 'route-map', icon: '•' },
    ],
  },
]

function pathMatches(pathname, item) {
  if (item.end) return pathname === '/'
  if (item.to) {
    const base = item.to.split('#')[0]
    if (base === '/') return pathname === '/'
    return pathname === base || pathname.startsWith(`${base}/`)
  }
  return false
}

export default function Header() {
  const { site } = useCms()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openGroups, setOpenGroups] = useState(() => new Set())

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setCompact(y > 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onDoc = () => setOpenDropdown(null)
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const isActiveId = (id) => {
    const p = location.pathname
    const h = location.hash
    if (id === 'home') return p === '/'
    if (id === 'about') return p === '/about' && !h
    if (id === 'about-vm') return p === '/about' && h === '#vision-mission'
    if (id === 'about-profile') return p === '/about' && h === '#college-profile'
    if (id === 'about-principal') return p.startsWith('/about/principal')
    if (id === 'about-pci') return p === '/mandatory-disclosure' && h === '#pci'
    if (id === 'about-university') return p === '/mandatory-disclosure' && h === '#university'
    if (id === 'about-governing') return p === '/mandatory-disclosure' && h === '#governing-body'
    if (id === 'about-disclosure') return p === '/mandatory-disclosure' && !h
    if (id === 'policy-ragging') return p.startsWith('/about/policies') && h === '#anti-ragging'
    if (id === 'policy-grievance') return p.startsWith('/about/policies') && h === '#grievance'
    if (id === 'policy-icc') return p.startsWith('/about/policies') && h === '#icc'
    if (id === 'campus-page') return p.startsWith('/campus')
    if (id === 'activities') return p.startsWith('/student-activities')
    if (id === 'media-news') return p.startsWith('/news')
    if (id === 'events') return p.startsWith('/events')
    if (id === 'parents') return p.startsWith('/resources')
    return p === `/${id}` || p.startsWith(`/${id}`)
  }

  const linkActive = (item) => {
    if (item.id && isActiveId(item.id)) return true
    if (!item.to) return false
    const [path, hash] = item.to.split('#')
    if (hash) return location.pathname === path && location.hash === `#${hash}`
    return pathMatches(location.pathname, item) && !location.hash
  }

  const headerClass = [
    'site-header',
    'header--ready',
    scrolled ? 'scrolled' : '',
    compact ? 'header--compact' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={headerClass} id="siteHeader">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo" aria-label={`${site.name} home`}>
            <span className="logo__mark">
              <img src={site.logo} alt="" width="160" height="48" decoding="async" />
            </span>
            <span className="logo__lockup">
              <strong className="logo__name brand-name">{site.name}</strong>
              <span className="logo__tag">{site.tag}</span>
            </span>
          </Link>
          <div className="header__aside">
            <Link to="/resources#students" className="header__student-link">
              Student Hub
            </Link>
            <Link to="/admissions" className="header__cta">
              Talk to Admin
            </Link>
            <a href={`tel:${site.phone}`} className="header__phone" aria-label="Call college">
              <span className="header__phone-icon" aria-hidden="true" />
              <span className="header__phone-text">Call</span>
            </a>
            <button
              className={`menu-toggle${menuOpen ? ' active is-open' : ''}`}
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobileNav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="menu-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="menu-toggle__menu-icon" aria-hidden="true">
                ☰
              </span>
            </button>
          </div>
        </div>

        <nav className="nav nav--desktop" aria-label="Primary">
          <div className="container nav__inner">
            {NAV.map((item) => {
              if (item.children || item.groups) {
                const kids = item.children || item.groups.flatMap((g) => g.items)
                const active =
                  kids.some((c) => linkActive(c)) ||
                  (item.id === 'about' &&
                    (location.pathname.startsWith('/about') ||
                      location.pathname.startsWith('/mandatory-disclosure'))) ||
                  (item.id === 'campus-page' && location.pathname.startsWith('/campus')) ||
                  (item.id === 'activities' && location.pathname.startsWith('/student-activities'))
                const open = openDropdown === item.id
                return (
                  <div
                    key={item.id}
                    className={`nav__dropdown${active ? ' is-active' : ''}${open ? ' open' : ''}${item.mega ? ' nav__dropdown--mega' : ''}`}
                  >
                    <button
                      type="button"
                      className="nav__dropdown-toggle"
                      aria-expanded={open}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenDropdown(open ? null : item.id)
                      }}
                    >
                      {item.label} ▾
                    </button>
                    {item.mega && item.groups ? (
                      <div
                        className={`nav__dropdown-menu nav__mega${item.id === 'about' ? ' nav__mega--about' : ''}${item.id === 'campus-page' ? ' nav__mega--campus' : ''}${item.id === 'activities' ? ' nav__mega--activities' : ''}`}
                      >
                        {item.groups.map((group) => (
                          <div key={group.title} className="nav__mega-col">
                            <p className="nav__mega-heading">{group.title}</p>
                            {group.items.map((c) => (
                              <Link
                                key={c.id + c.to}
                                to={c.to}
                                className={`nav__dropdown-link${linkActive(c) ? ' active' : ''}`}
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`nav__dropdown-menu${(item.children?.length || 0) > 4 ? ' nav__mega' : ''}`}
                      >
                        {(item.children || []).map((c) => (
                          <Link
                            key={c.id + c.to}
                            to={c.to}
                            className={`nav__dropdown-link${linkActive(c) ? ' active' : ''}`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </nav>

        <div className="header-apply-bar">
          <Link to="/admissions" className="header-apply-bar__btn">
            Talk to Admin — Code {site.code}
          </Link>
        </div>

        <div
          className={`mobile-nav-overlay${menuOpen ? ' open' : ''}`}
          id="mobileNavOverlay"
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`nav nav--mobile${menuOpen ? ' open is-open' : ''}`}
          id="mobileNav"
          aria-label="Mobile navigation"
        >
          <div className="mobile-nav__header">
            <div className="mobile-nav__brand">
              <img src={site.logoMark} alt="" width="36" height="36" />
              <div>
                <strong className="brand-name">{site.name}</strong>
                <small>Code 889 · Tirupattur</small>
              </div>
            </div>
            <button
              type="button"
              className="mobile-nav__close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="mobile-nav__list">
            {MOBILE_NAV_GROUPS.map((group, gi) => {
              const links = group.items.map((item, i) => {
                const active = isActiveId(item.id) || pathMatches(location.pathname, item)
                const highlight = item.highlight ? ' mobile-nav__item--highlight' : ''
                return (
                  <Link
                    key={item.id + item.to}
                    to={item.to}
                    className={`mobile-nav__item${active ? ' active' : ''}${highlight}`}
                    style={{ '--nav-i': i }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-nav__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="mobile-nav__label">{item.label}</span>
                  </Link>
                )
              })

              if (!group.label) return <div key={gi}>{links}</div>

              const groupKey = group.label
              const groupOpen =
                openGroups.has(groupKey) ||
                group.items.some((item) => pathMatches(location.pathname, item))

              return (
                <div
                  key={groupKey}
                  className={`mobile-nav__group${groupOpen ? ' is-active open' : ''}`}
                >
                  <button
                    type="button"
                    className="mobile-nav__group-toggle"
                    aria-expanded={groupOpen}
                    onClick={() => {
                      setOpenGroups((prev) => {
                        const next = new Set(prev)
                        if (next.has(groupKey)) next.delete(groupKey)
                        else next.add(groupKey)
                        return next
                      })
                    }}
                  >
                    <span>{group.label}</span>
                    <span className="mobile-nav__group-chevron" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <div className="mobile-nav__group-items">{links}</div>
                </div>
              )
            })}
          </div>
          <div className="mobile-nav__footer">
            <Link to="/admissions" className="mobile-nav__cta" onClick={() => setMenuOpen(false)}>
              Talk to Admissions Office
            </Link>
            <div className="mobile-nav__quick">
              <Link to="/resources#students" onClick={() => setMenuOpen(false)}>
                Student Hub
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/placements" onClick={() => setMenuOpen(false)}>
                Placements
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
