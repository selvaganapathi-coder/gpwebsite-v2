import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'
import { whatsappUrl } from '../../lib/site'

const STORAGE_KEY = 'gp-admissions-welcome-dismissed'

const PROGRAMS = [
  { name: 'D.Pharm', detail: '2 years · Diploma' },
  { name: 'B.Pharm', detail: '4 years · Degree' },
  { name: 'M.Pharm', detail: '2 years · PG specialisations' },
  { name: 'Pharm-D', detail: '6 years · Clinical path' },
]

export default function AdmissionsWelcome() {
  const { site } = useCms()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      /* ignore */
    }

    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      setOpen(true)
      cleanup()
    }

    const onScroll = () => {
      if (window.scrollY > 320) show()
    }

    const delayId = window.setTimeout(show, 4500)
    window.addEventListener('scroll', onScroll, { passive: true })

    function cleanup() {
      window.clearTimeout(delayId)
      window.removeEventListener('scroll', onScroll)
    }

    return cleanup
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    document.body.classList.add('welcome-modal-open')
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('welcome-modal-open')
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function dismiss() {
    setOpen(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!open) return null

  return (
    <div className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title">
      <button type="button" className="welcome-modal__backdrop" aria-label="Close" onClick={dismiss} />
      <div className="welcome-modal__panel">
        <button type="button" className="welcome-modal__close" aria-label="Close welcome" onClick={dismiss}>
          ×
        </button>

        <div className="welcome-modal__grid">
          <div className="welcome-modal__main">
            <p className="welcome-modal__eyebrow">Admissions guidance</p>
            <h2 id="welcome-modal-title" className="welcome-modal__title">
              2026 Admissions open
            </h2>
            <p className="welcome-modal__lead">
              Shape your future in pharmacy at G.P. COLLEGE — Counselling Code{' '}
              <strong>{site.code}</strong>.
            </p>

            <div className="welcome-modal__code">
              <span>Counselling Code</span>
              <strong>{site.code}</strong>
            </div>

            <h3 className="welcome-modal__sub">Programs offered</h3>
            <ul className="welcome-modal__programs">
              {PROGRAMS.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.detail}</span>
                </li>
              ))}
            </ul>

            <div className="welcome-modal__cta-box">
              <p>No online application on this site — talk to Admin for guidance.</p>
              <div className="welcome-modal__cta-row">
                <Link to="/admissions" className="welcome-modal__btn welcome-modal__btn--primary" onClick={dismiss}>
                  Talk to Admin
                </Link>
                <a
                  href={whatsappUrl('Hi, I want admission info for Code 889.')}
                  className="welcome-modal__btn welcome-modal__btn--wa"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                >
                  WhatsApp
                </a>
                <a href={`tel:${site.phone}`} className="welcome-modal__btn welcome-modal__btn--call" onClick={dismiss}>
                  Call Admin
                </a>
              </div>
            </div>
          </div>

          <aside className="welcome-modal__aside">
            <h3>Contact us</h3>
            <div className="welcome-modal__contact">
              <span>Call Admin</span>
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            </div>
            {site.phoneAltDisplay ? (
              <div className="welcome-modal__contact">
                <span>Alternate</span>
                <a href={`tel:${site.phoneAlt}`}>{site.phoneAltDisplay}</a>
              </div>
            ) : null}
            <div className="welcome-modal__contact">
              <span>Email</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="welcome-modal__contact">
              <span>Campus</span>
              <p>{site.address}</p>
            </div>
            <Link to="/courses" className="welcome-modal__aside-link" onClick={dismiss}>
              View all courses
            </Link>
            <Link to="/route-map" className="welcome-modal__aside-link" onClick={dismiss}>
              Route map
            </Link>
          </aside>
        </div>

        <div className="welcome-modal__foot">
          <span>PCI approved · TN Dr. M.G.R. Medical University · Code {site.code}</span>
          <button type="button" className="welcome-modal__enroll" onClick={dismiss}>
            Continue to site
          </button>
        </div>
      </div>
    </div>
  )
}
