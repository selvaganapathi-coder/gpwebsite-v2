import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'

const SOCIAL = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.2c-2.67 0-3.01.01-4.06.06-2.74.13-4.05 1.45-4.18 4.18-.05 1.05-.06 1.39-.06 4.06s.01 3.01.06 4.06c.13 2.72 1.44 4.05 4.18 4.18 1.05.05 1.39.06 4.06.06s3.01-.01 4.06-.06c2.74-.13 4.05-1.46 4.18-4.18.05-1.05.06-1.39.06-4.06s-.01-3.01-.06-4.06c-.13-2.73-1.44-4.05-4.18-4.18C15.01 2.21 14.67 2.2 12 2.2Zm0 1.62c2.63 0 2.94.01 3.97.06 1.97.09 2.9 1.02 2.99 2.99.05 1.03.06 1.34.06 3.97s-.01 2.94-.06 3.97c-.09 1.96-1.02 2.9-2.99 2.99-1.03.05-1.34.06-3.97.06s-2.94-.01-3.97-.06c-1.97-.09-2.9-1.03-2.99-2.99-.05-1.03-.06-1.34-.06-3.97s.01-2.94.06-3.97c.09-1.97 1.02-2.9 2.99-2.99 1.03-.05 1.34-.06 3.97-.06Z"
        />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.38.46A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.4 12 20.4 12 20.4s7.5 0 9.38-.46a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"
        />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z"
        />
      </svg>
    ),
  },
]

export default function Announcement() {
  const { homepage, site } = useCms()
  const msg = homepage.announcement
  const social = site.social || {}

  return (
    <div className="announcement" role="region" aria-label="College alerts">
      <div className="announcement__inner container">
        <p className="announcement__msg">{msg}</p>
        <div className="announcement__actions">
          <nav className="announcement__social" aria-label="Social media">
            {SOCIAL.map((item) => {
              const href = social[item.key]
              if (!href) return null
              return (
                <a
                  key={item.key}
                  href={href}
                  className={`announcement__social-link announcement__social-link--${item.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                </a>
              )
            })}
          </nav>
          <a href={`tel:${site.phone}`} className="announcement__hotline">
            {site.phoneDisplay}
          </a>
          <Link to="/admissions" className="announcement__apply">
            Talk to Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
