import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'
import { whatsappUrl } from '../lib/site'
import { submitEnquiry } from '../lib/cmsApi'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'

const COURSES = [
  { value: '', label: 'Select a course' },
  { value: 'dpharm', label: 'D.Pharm' },
  { value: 'bpharm', label: 'B.Pharm' },
  { value: 'mpharm', label: 'M.Pharm' },
  { value: 'pharmd', label: 'Pharm-D' },
  { value: 'lateral', label: 'B.Pharm Lateral Entry' },
]

const COURSE_LABELS = Object.fromEntries(COURSES.filter((c) => c.value).map((c) => [c.value, c.label]))

const DOCS = [
  {
    label: 'Anti-Ragging Committee',
    href: 'https://gppharmacycollege.com/wp-content/uploads/2026/02/ANTI-RAGGING.pdf',
  },
  {
    label: 'Anti-Discrimination',
    href: 'https://gppharmacycollege.com/wp-content/uploads/2026/02/ANTI-DISCRIMINATION.pdf',
  },
  {
    label: 'Gender Sensitization Cell',
    href: 'https://gppharmacycollege.com/wp-content/uploads/2026/02/GENDER-SENSITIZATION-CELL.pdf',
  },
  {
    label: 'Career Guidance Cell',
    href: 'https://gppharmacycollege.com/wp-content/uploads/2026/02/CARRIER-GUIDANCE-CELL.pdf',
  },
]

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

const empty = { name: '', phone: '', email: '', course: '', message: '', honey: '' }

export default function ContactPage() {
  const { site, contact } = useCms()
  const formId = useId()
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const phones = contact.phones || []
  const mapsEmbed = site.mapsEmbedUrl

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
    if (status) setStatus(null)
  }

  function validate() {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Enter your full name.'
    const phone = values.phone.replace(/\s/g, '')
    if (!/^(\+?\d{10,13})$/.test(phone)) next.phone = 'Enter a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid email.'
    if (values.message.trim().length > 1000) next.message = 'Message is too long.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (values.honey) return
    if (!validate()) {
      setStatus({ type: 'error', text: 'Please correct the highlighted fields and try again.' })
      return
    }

    setSending(true)
    setStatus(null)
    const courseLabel = COURSE_LABELS[values.course] || 'Not specified'
    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      course: courseLabel,
      message: values.message.trim() || '—',
      _subject: 'New Enquiry — G.P. COLLEGE Website',
      _template: 'table',
      _captcha: 'false',
    }

    try {
      await submitEnquiry({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        course: courseLabel,
        message: values.message.trim() || '—',
      })
      // Best-effort email relay (does not block CMS inbox)
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contact.email || site.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
      setValues(empty)
      setStatus({
        type: 'success',
        text: 'Thank you — your enquiry was sent. We will respond within 1–2 working days.',
      })
    } catch {
      const mail = contact.email || site.email
      const subject = encodeURIComponent('New Enquiry — G.P. COLLEGE Website')
      const body = encodeURIComponent(
        [
          `Name: ${values.name.trim()}`,
          `Phone: ${values.phone.trim()}`,
          `Email: ${values.email.trim()}`,
          `Course: ${courseLabel || '—'}`,
          '',
          values.message.trim() || '—',
        ].join('\n'),
      )
      setStatus({
        type: 'error',
        text: `Could not send online. Call ${site.phoneDisplay}, WhatsApp Admin, or email ${mail}.`,
        mailto: `mailto:${mail}?subject=${subject}&body=${body}`,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Contact' }]}
        title={contact.heroTitle}
        subtitle={contact.heroSubtitle}
      />

      <section className="contact-quick section" aria-label="Quick contact">
        <div className="container">
          <Fade className="contact-quick__grid anim-stagger">
            <a className="contact-quick__action" href={`tel:${site.phone}`}>
              <span className="contact-quick__label">Call</span>
              <strong>{site.phoneDisplay}</strong>
            </a>
            <a
              className="contact-quick__action"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-quick__label">WhatsApp</span>
              <strong>Message Admin</strong>
            </a>
            <a className="contact-quick__action" href={`mailto:${contact.email || site.email}`}>
              <span className="contact-quick__label">Email</span>
              <strong>{contact.email || site.email}</strong>
            </a>
            <a
              className="contact-quick__action"
              href={site.mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-quick__label">Directions</span>
              <strong>Open in Maps</strong>
            </a>
          </Fade>
        </div>
      </section>

      <section className="contact-main section" aria-labelledby="contact-main-title">
        <div className="container">
          <div className="contact-layout">
            <Fade className="contact-aside">
              <p className="home-section-eyebrow">Get in touch</p>
              <h2 className="contact-aside__title" id="contact-main-title">
                College office
              </h2>
              <p className="contact-aside__lead">
                Visit, call, or write — our team responds within 1–2 working days.
              </p>

              <dl className="contact-facts">
                <div className="contact-facts__row">
                  <dt>Address</dt>
                  <dd>{contact.address}</dd>
                </div>
                <div className="contact-facts__row">
                  <dt>Principal</dt>
                  <dd>
                    {contact.principal}
                    <br />
                    <a href={`tel:${site.phoneAlt}`}>{site.phoneAltDisplay}</a>
                    <br />
                    <a href={`mailto:${contact.principalEmail}`}>{contact.principalEmail}</a>
                  </dd>
                </div>
                <div className="contact-facts__row">
                  <dt>Telephone</dt>
                  <dd className="contact-facts__phones">
                    {phones.map((p) => (
                      <a key={p.tel || p.display} href={`tel:${p.tel}`}>
                        {p.display}
                      </a>
                    ))}
                  </dd>
                </div>
                <div className="contact-facts__row">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </dd>
                </div>
                <div className="contact-facts__row">
                  <dt>Office hours</dt>
                  <dd>{contact.hours}</dd>
                </div>
              </dl>

              <div className="contact-aside__links">
                <Link to="/admissions" className="btn btn--outline-dark">
                  Admissions →
                </Link>
                <Link to="/route-map" className="btn btn--amber">
                  Route map
                </Link>
              </div>
            </Fade>

            <Fade className="contact-enquiry">
              <h3 className="contact-enquiry__title">Send an enquiry</h3>
              <p className="contact-enquiry__intro">
                Share your details and our team will get back to you promptly.
              </p>

              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <div className="contact-form__grid">
                  <div className={`form-group${errors.name ? ' form-group--error' : ''}`}>
                    <label htmlFor={`${formId}-name`}>Full name</label>
                    <input
                      id={`${formId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      placeholder="Your name"
                      value={values.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                    {errors.name ? <span className="form-error">{errors.name}</span> : null}
                  </div>

                  <div className={`form-group${errors.phone ? ' form-group--error' : ''}`}>
                    <label htmlFor={`${formId}-phone`}>Phone number</label>
                    <input
                      id={`${formId}-phone`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={values.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                    {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
                  </div>

                  <div className={`form-group form-group--full${errors.email ? ' form-group--error' : ''}`}>
                    <label htmlFor={`${formId}-email`}>Email address</label>
                    <input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={values.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                    {errors.email ? <span className="form-error">{errors.email}</span> : null}
                  </div>

                  <div className="form-group form-group--full">
                    <label htmlFor={`${formId}-course`}>Course interested in</label>
                    <select
                      id={`${formId}-course`}
                      name="course"
                      value={values.course}
                      onChange={(e) => setField('course', e.target.value)}
                    >
                      {COURSES.map((c) => (
                        <option key={c.value || 'empty'} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`form-group form-group--full${errors.message ? ' form-group--error' : ''}`}>
                    <label htmlFor={`${formId}-message`}>Message</label>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={5}
                      maxLength={1000}
                      placeholder="How can we help you?"
                      value={values.message}
                      onChange={(e) => setField('message', e.target.value)}
                    />
                    {errors.message ? <span className="form-error">{errors.message}</span> : null}
                    <div className="form-counter" aria-live="polite">
                      {values.message.length} / 1000
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  name="_honey"
                  className="form-honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={values.honey}
                  onChange={(e) => setField('honey', e.target.value)}
                />

                {status ? (
                  <div className={`form-status form-status--${status.type}`} role="status">
                    <p>{status.text}</p>
                    {status.mailto ? (
                      <p style={{ marginTop: '0.5rem' }}>
                        <a href={status.mailto} className="btn btn--outline-dark">
                          Open email draft →
                        </a>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className={`btn btn--red contact-form__submit${sending ? ' is-loading' : ''}`}
                  disabled={sending}
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </Fade>
          </div>
        </div>
      </section>

      <section className="contact-map section section--soft" aria-labelledby="contact-map-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Find us</p>
            <h2 className="section__title" id="contact-map-title">
              Jolarpet campus
            </h2>
            <p className="section__desc">{site.address}</p>
          </Fade>
          <Fade className="contact-map__frame">
            <iframe
              src={mapsEmbed}
              title="G.P. COLLEGE location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Fade>
          <Fade className="contact-map__actions">
            <a
              className="btn btn--red"
              href={site.mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps →
            </a>
            <Link to="/route-map" className="btn btn--outline-dark">
              QR route map
            </Link>
          </Fade>
        </div>
      </section>

      <section className="contact-safety section" aria-labelledby="contact-safety-title">
        <div className="container">
          <Fade>
            <p className="home-section-eyebrow">Campus safety</p>
            <h2 className="contact-safety__title" id="contact-safety-title">
              Anti-ragging helplines
            </h2>
            <div className="contact-safety__grid">
              <p>
                National Helpline: <a href="tel:18001805522">1800-180-5522</a>
                <br />
                Email: <a href="mailto:helpline@antiragging.in">helpline@antiragging.in</a>
                <br />
                Emergency / Police: <a href="tel:112">112</a> · Women Helpline:{' '}
                <a href="tel:181">181</a>
              </p>
              <ul className="contact-safety__docs">
                {DOCS.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noopener noreferrer">
                      {d.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Fade>
        </div>
      </section>
    </>
  )
}
