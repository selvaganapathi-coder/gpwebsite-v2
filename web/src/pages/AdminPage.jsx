import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchAdminContent,
  getAdminUser,
  getToken,
  login,
  logout,
  saveAdminContent,
} from '../lib/cmsApi'
import ImageField from '../components/admin/ImageField'
import { Field, ItemListEditor } from '../components/admin/ItemListEditor'
import {
  ActivityLogPanel,
  EnquiriesPanel,
  MediaLibrary,
  QuickNoticeComposer,
  SeoFields,
  SiteLivePreview,
} from '../components/admin/AdminExtras'
import { formatPhoneDisplay, syncSiteEverywhere } from '../lib/syncSiteContent'

const NAV = [
  { id: 'site', label: 'College details' },
  { id: 'quick', label: 'Post a notice' },
  { id: 'enquiries', label: 'Messages' },
  { id: 'homepage', label: 'Home page' },
  { id: 'about', label: 'About page' },
  { id: 'courses', label: 'Courses' },
  { id: 'contact', label: 'Contact page' },
  { id: 'labs', label: 'Labs & facilities' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'placements', label: 'Placements' },
  { id: 'notices', label: 'Notices list' },
  { id: 'events', label: 'Events' },
  { id: 'news', label: 'News' },
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'media', label: 'Uploaded photos' },
  { id: 'research', label: 'Research' },
  { id: 'activity', label: 'Recent changes' },
]

function LoginView({ onSuccess }) {
  const [email, setEmail] = useState('admin@gppharmacycollege.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email.trim(), password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={onSubmit}>
        <div className="admin-login__brand">
          <img
            src="https://gppharmacycollege.com/wp-content/uploads/2025/03/cropped-GP-Logo-32x32.png"
            alt=""
            width={40}
            height={40}
          />
          <h1>Website editor</h1>
          <p>Update text and photos — then click Save &amp; show on website</p>
        </div>
        {error ? <p className="admin-login__error">{error}</p> : null}
        <Field label="Email">
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <button type="submit" className="btn btn--red" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="admin-login__hint">Use the email and password given by your college admin.</p>
        <Link to="/" className="admin-login__back">
          ← Back to website
        </Link>
      </form>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()))
  const [section, setSection] = useState('site')
  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const user = useMemo(() => getAdminUser(), [authed])

  useEffect(() => {
    if (!authed) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminContent()
        if (!cancelled) {
          const working = data.cmsDraft
            ? { ...data, ...data.cmsDraft, cmsDraft: data.cmsDraft, enquiries: data.enquiries, activityLog: data.activityLog, media: data.media, users: data.users }
            : structuredClone(data)
          setDraft(working)
          setHasDraft(Boolean(data.cmsDraft))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          if (/session|signed/i.test(err.message)) setAuthed(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authed])

  if (!authed) return <LoginView onSuccess={() => setAuthed(true)} />

  if (!draft && loading) {
    return <div className="admin-shell admin-shell--loading">Loading website editor…</div>
  }

  if (!draft) {
    return (
      <div className="admin-shell admin-shell--loading">
        <p>{error || 'Could not load content.'}</p>
        <button type="button" className="btn btn--red" onClick={() => setAuthed(false)}>
          Sign in again
        </button>
      </div>
    )
  }

  function patchSite(key, value) {
    setDraft((d) => {
      const site = { ...d.site, [key]: value }
      if (key === 'phone' && value) {
        site.phoneDisplay = formatPhoneDisplay(value)
        if (!String(d.site?.whatsapp || '').trim()) {
          site.whatsapp = String(value).replace(/\D/g, '')
        }
      }
      if (key === 'phoneAlt' && value) {
        site.phoneAltDisplay = formatPhoneDisplay(value)
      }
      if (key === 'code') {
        const code = String(value || '').trim()
        site.tag = code ? `Tirupattur · Code ${code}` : d.site?.tag
      }
      return { ...d, site }
    })
  }

  function applyGlobalSync() {
    setDraft((d) => syncSiteEverywhere(d))
    setStatus('Preview updated. Click “Save & show on website” to make it live.')
    setError('')
  }

  function patchHomepage(key, value) {
    setDraft((d) => ({
      ...d,
      website: { ...d.website, homepage: { ...d.website.homepage, [key]: value } },
    }))
  }

  function patchAbout(key, value) {
    setDraft((d) => ({
      ...d,
      website: { ...d.website, about: { ...d.website.about, [key]: value } },
    }))
  }

  function patchContact(key, value) {
    setDraft((d) => ({
      ...d,
      website: { ...d.website, contact: { ...d.website.contact, [key]: value } },
    }))
  }

  function patchLab(index, key, value) {
    setDraft((d) => {
      const labs = [...(d.website.campus?.labs || [])]
      labs[index] = { ...labs[index], [key]: value }
      return {
        ...d,
        website: { ...d.website, campus: { ...d.website.campus, labs } },
      }
    })
  }

  function patchAdmissions(key, value) {
    setDraft((d) => ({ ...d, admissions: { ...d.admissions, [key]: value } }))
  }

  function patchResearch(key, value) {
    setDraft((d) => ({ ...d, research: { ...d.research, [key]: value } }))
  }

  async function onSave(mode = 'publish') {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const synced = syncSiteEverywhere(draft)
      setDraft(synced)
      const result = await saveAdminContent(synced, { mode })
      setHasDraft(Boolean(result.hasDraft))
      if (mode === 'draft') {
        setStatus('Draft saved. The website is not updated yet — click “Save & show on website” when ready.')
      } else {
        setStatus('Saved — your changes are now visible on the website.')
        setHasDraft(false)
      }
    } catch (err) {
      setError(err.message)
      if (/session/i.test(err.message)) setAuthed(false)
    } finally {
      setSaving(false)
    }
  }

  function applyQuickNotice({ title, summary, urgent, toAnnouncement }) {
    const today = new Date().toISOString().slice(0, 10)
    const notice = {
      id: `notice-${Date.now()}`,
      title,
      summary: summary || title,
      date: today,
      category: 'admission',
      urgent: Boolean(urgent),
      published: true,
      link: '/news',
    }
    setDraft((d) => {
      const next = {
        ...d,
        notices: [notice, ...(d.notices || [])],
        website: {
          ...d.website,
          homepage: {
            ...d.website?.homepage,
            ...(toAnnouncement
              ? {
                  announcement: summary
                    ? `${title} · ${summary}`
                    : title,
                }
              : {}),
          },
        },
      }
      return next
    })
    setStatus('Notice added. Click “Save & show on website” to make it live.')
    setSection('notices')
  }

  async function onLogout() {
    await logout()
    setAuthed(false)
    setDraft(null)
  }

  const labs = draft.website?.campus?.labs || []
  const slides = draft.website?.homepage?.slides || []
  const homeAbout = draft.website?.homepage?.homeAbout || {}
  const campusShowItems = draft.website?.homepage?.campusShow?.items || []
  const peopleSlots = draft.website?.homepage?.people?.slots || []

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <strong>G.P. COLLEGE</strong>
          <small>Website editor</small>
        </div>
        <nav className="admin-nav" aria-label="Edit sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav__link${section === item.id ? ' is-active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <Link to="/" target="_blank" rel="noreferrer">
            Open website ↗
          </Link>
          <button type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{NAV.find((n) => n.id === section)?.label || 'Editor'}</h1>
            <p>Signed in as {user?.name || user?.email}</p>
          </div>
          <div className="admin-topbar__actions">
            <button
              type="button"
              className="btn btn--outline-dark"
              onClick={() => onSave('draft')}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save for later'}
            </button>
            <button type="button" className="btn btn--red" onClick={() => onSave('publish')} disabled={saving}>
              {saving ? 'Saving…' : 'Save & show on website'}
            </button>
          </div>
        </header>

        {hasDraft ? (
          <p className="admin-banner admin-banner--warn">
            You have saved changes that are not on the website yet. Click “Save & show on website”
            when ready.
          </p>
        ) : null}

        {status ? <p className="admin-banner admin-banner--ok">{status}</p> : null}
        {error ? <p className="admin-banner admin-banner--err">{error}</p> : null}

        <div className="admin-panel">
          {section === 'site' ? (
            <div className="admin-stack">
              <div className="admin-sync-card">
                <h2>Start here</h2>
                <p>
                  Change the counselling code, phone numbers, WhatsApp, email, or address below.
                  Then click <strong>Save &amp; show on website</strong> — the whole site updates
                  automatically. Use <strong>Save for later</strong> if you are still editing.
                </p>
                <button type="button" className="btn btn--outline-dark" onClick={applyGlobalSync}>
                  Refresh preview
                </button>
              </div>
              <SiteLivePreview site={draft.site} />
              <h3 className="admin-subhead">College name &amp; contact</h3>
              <div className="admin-grid">
              <Field label="College name">
                <input value={draft.site?.name || ''} onChange={(e) => patchSite('name', e.target.value)} />
              </Field>
              <Field label="Counselling code">
                <input value={draft.site?.code || ''} onChange={(e) => patchSite('code', e.target.value)} />
              </Field>
              <Field label="Main phone">
                <input
                  value={draft.site?.phoneDisplay || draft.site?.phone || ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setDraft((d) => ({
                      ...d,
                      site: {
                        ...d.site,
                        phone: v,
                        phoneDisplay: formatPhoneDisplay(v) || v,
                        whatsapp: String(d.site?.whatsapp || '').trim()
                          ? d.site.whatsapp
                          : String(v).replace(/\D/g, ''),
                      },
                    }))
                  }}
                  placeholder="+91 94434 37487"
                />
              </Field>
              <Field label="Second phone">
                <input
                  value={draft.site?.phoneAltDisplay || draft.site?.phoneAlt || ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setDraft((d) => ({
                      ...d,
                      site: {
                        ...d.site,
                        phoneAlt: v,
                        phoneAltDisplay: formatPhoneDisplay(v) || v,
                      },
                    }))
                  }}
                  placeholder="Optional"
                />
              </Field>
              <Field label="Email">
                <input value={draft.site?.email || ''} onChange={(e) => patchSite('email', e.target.value)} />
              </Field>
              <Field label="WhatsApp number">
                <input
                  value={draft.site?.whatsapp || ''}
                  onChange={(e) => patchSite('whatsapp', e.target.value)}
                  placeholder="919443437487"
                />
              </Field>
              <Field label="Office hours">
                <input
                  value={draft.site?.hours || ''}
                  onChange={(e) => patchSite('hours', e.target.value)}
                />
              </Field>
              <Field label="PCI approval number">
                <input value={draft.site?.pci || ''} onChange={(e) => patchSite('pci', e.target.value)} />
              </Field>
              <Field label="Government G.O. numbers">
                <input value={draft.site?.goMs || ''} onChange={(e) => patchSite('goMs', e.target.value)} />
              </Field>
              <Field label="University name">
                <input
                  value={draft.site?.university || ''}
                  onChange={(e) => patchSite('university', e.target.value)}
                />
              </Field>
              <Field label="Instagram link">
                <input
                  value={draft.site?.social?.instagram || ''}
                  onChange={(e) =>
                    patchSite('social', { ...(draft.site?.social || {}), instagram: e.target.value })
                  }
                />
              </Field>
              <Field label="YouTube link">
                <input
                  value={draft.site?.social?.youtube || ''}
                  onChange={(e) =>
                    patchSite('social', { ...(draft.site?.social || {}), youtube: e.target.value })
                  }
                />
              </Field>
              <Field label="LinkedIn link">
                <input
                  value={draft.site?.social?.linkedin || ''}
                  onChange={(e) =>
                    patchSite('social', { ...(draft.site?.social || {}), linkedin: e.target.value })
                  }
                />
              </Field>
              <Field label="College address">
                <textarea
                  rows={3}
                  value={draft.site?.address || ''}
                  onChange={(e) => patchSite('address', e.target.value)}
                />
              </Field>
              <div className="admin-grid__full">
                <ImageField
                  label="College logo"
                  value={draft.site?.logo || ''}
                  onChange={(url) => patchSite('logo', url)}
                />
              </div>
            </div>
              <h3 className="admin-subhead">Google / WhatsApp sharing text</h3>
              <SeoFields
                seo={draft.site?.seo || {}}
                onChange={(seo) => patchSite('seo', seo)}
              />
            </div>
          ) : null}

          {section === 'quick' ? (
            <QuickNoticeComposer onApply={applyQuickNotice} />
          ) : null}

          {section === 'enquiries' ? (
            <EnquiriesPanel
              items={draft.enquiries || []}
              onChange={(enquiries) => setDraft((d) => ({ ...d, enquiries }))}
            />
          ) : null}

          {section === 'homepage' ? (
            <div className="admin-stack">
              <p className="admin-inline-hint">
                Badge, announcement, and counselling-code stats refresh from{' '}
                <strong>Site settings</strong> when you save. Prefer editing the code there.
              </p>
              <div className="admin-grid">
                <Field label="Announcement bar">
                  <textarea
                    rows={3}
                    value={draft.website?.homepage?.announcement || ''}
                    onChange={(e) => patchHomepage('announcement', e.target.value)}
                  />
                </Field>
                <Field label="Badge">
                  <input
                    value={draft.website?.homepage?.badge || ''}
                    onChange={(e) => patchHomepage('badge', e.target.value)}
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={draft.website?.homepage?.title || ''}
                    onChange={(e) => patchHomepage('title', e.target.value)}
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    value={draft.website?.homepage?.subtitle || ''}
                    onChange={(e) => patchHomepage('subtitle', e.target.value)}
                  />
                </Field>
              </div>

              <h3 className="admin-subhead">Hero slides</h3>
              <div className="admin-slides">
                {slides.map((url, i) => (
                  <div key={`slide-${i}`} className="admin-slide">
                    <ImageField
                      label={`Slide ${i + 1}`}
                      value={url}
                      onChange={(next) => {
                        const list = [...slides]
                        list[i] = next
                        patchHomepage(
                          'slides',
                          list.filter(Boolean),
                        )
                      }}
                    />
                    <button
                      type="button"
                      className="admin-item__remove"
                      onClick={() => patchHomepage(
                        'slides',
                        slides.filter((_, idx) => idx !== i),
                      )}
                    >
                      Remove slide
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn--outline-dark"
                  onClick={() => patchHomepage('slides', [...slides, ''])}
                >
                  + Add slide
                </button>
              </div>

              <h3 className="admin-subhead">About block image</h3>
              <ImageField
                label="Home about image"
                value={homeAbout.image || ''}
                onChange={(url) =>
                  patchHomepage('homeAbout', { ...homeAbout, image: url })
                }
              />

              <h3 className="admin-subhead">Campus show panels</h3>
              <ItemListEditor
                items={campusShowItems}
                titleKey="title"
                imageKey="image"
                blank={{ title: 'New panel', caption: '', image: '' }}
                fields={[
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Title' },
                  { key: 'caption', label: 'Caption' },
                ]}
                onChange={(items) =>
                  patchHomepage('campusShow', {
                    ...(draft.website.homepage.campusShow || {}),
                    items,
                  })
                }
              />

              <h3 className="admin-subhead">People slots</h3>
              <ItemListEditor
                items={peopleSlots}
                titleKey="name"
                imageKey="image"
                blank={{ name: '', role: '', image: '', href: '' }}
                fields={[
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'role', label: 'Role' },
                  { key: 'href', label: 'Link' },
                ]}
                onChange={(slots) =>
                  patchHomepage('people', {
                    ...(draft.website.homepage.people || {}),
                    slots,
                  })
                }
              />
            </div>
          ) : null}

          {section === 'about' ? (
            <div className="admin-grid">
              <Field label="Page title">
                <input
                  value={draft.website?.about?.heroTitle || ''}
                  onChange={(e) => patchAbout('heroTitle', e.target.value)}
                />
              </Field>
              <Field label="Short line under title">
                <input
                  value={draft.website?.about?.heroSubtitle || ''}
                  onChange={(e) => patchAbout('heroSubtitle', e.target.value)}
                />
              </Field>
              <Field label="Discover title">
                <input
                  value={draft.website?.about?.discoverTitle || ''}
                  onChange={(e) => patchAbout('discoverTitle', e.target.value)}
                />
              </Field>
              <div className="admin-grid__full">
                <ImageField
                  label="Discover image"
                  value={draft.website?.about?.discoverImage || ''}
                  onChange={(url) => patchAbout('discoverImage', url)}
                />
              </div>
              <Field label="Discover prose (one paragraph per line)">
                <textarea
                  rows={5}
                  value={(draft.website?.about?.discoverProse || []).join('\n\n')}
                  onChange={(e) =>
                    patchAbout(
                      'discoverProse',
                      e.target.value
                        .split(/\n\s*\n/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
              <div className="admin-grid__full">
                <h3 className="admin-subhead">Campus highlights</h3>
                <ItemListEditor
                  items={draft.website?.about?.highlights || []}
                  titleKey="title"
                  imageKey="image"
                  blank={{ title: '', desc: '', image: '' }}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'desc', label: 'Description', type: 'textarea' },
                  ]}
                  onChange={(highlights) => patchAbout('highlights', highlights)}
                />
              </div>
              <div className="admin-grid__full">
                <h3 className="admin-subhead">Leadership</h3>
                <ItemListEditor
                  items={draft.website?.about?.leadership || []}
                  titleKey="name"
                  imageKey="image"
                  blank={{ name: '', role: '', image: '', bio: '' }}
                  fields={[
                    { key: 'name', label: 'Name' },
                    { key: 'role', label: 'Role' },
                    { key: 'bio', label: 'Bio', type: 'textarea' },
                  ]}
                  onChange={(leadership) => patchAbout('leadership', leadership)}
                />
              </div>
            </div>
          ) : null}

          {section === 'courses' ? (
            <div className="admin-stack">
              <p className="admin-inline-hint">
                Edit program names, duration, and intake. These feed the Courses page when published.
              </p>
              <div className="admin-grid">
                <Field label="Page title">
                  <input
                    value={draft.website?.courses?.heroTitle || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        website: {
                          ...d.website,
                          courses: { ...d.website?.courses, heroTitle: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Short line under title">
                  <input
                    value={draft.website?.courses?.heroSubtitle || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        website: {
                          ...d.website,
                          courses: { ...d.website?.courses, heroSubtitle: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <ItemListEditor
                items={draft.website?.courses?.programs || []}
                titleKey="name"
                blank={{
                  name: '',
                  duration: '',
                  intake: '',
                  summary: '',
                  published: true,
                }}
                fields={[
                  { key: 'name', label: 'Program name' },
                  { key: 'duration', label: 'Duration' },
                  { key: 'intake', label: 'Intake' },
                  { key: 'summary', label: 'Summary', type: 'textarea' },
                  { key: 'published', label: 'Show on website', type: 'checkbox' },
                ]}
                onChange={(programs) =>
                  setDraft((d) => ({
                    ...d,
                    website: {
                      ...d.website,
                      courses: { ...d.website?.courses, programs },
                    },
                  }))
                }
              />
            </div>
          ) : null}

          {section === 'contact' ? (
            <div className="admin-stack">
              <p className="admin-inline-hint">
                Phone numbers, email, and address sync from <strong>Site settings</strong> on save.
                Edit page-only copy (hero, principal, hours) here.
              </p>
              <div className="admin-grid">
                <Field label="Page title">
                  <input
                    value={draft.website?.contact?.heroTitle || ''}
                    onChange={(e) => patchContact('heroTitle', e.target.value)}
                  />
                </Field>
                <Field label="Short line under title">
                  <input
                    value={draft.website?.contact?.heroSubtitle || ''}
                    onChange={(e) => patchContact('heroSubtitle', e.target.value)}
                  />
                </Field>
              <Field label="Address">
                <textarea
                  rows={3}
                  value={draft.website?.contact?.address || ''}
                  onChange={(e) => patchContact('address', e.target.value)}
                />
              </Field>
              <Field label="Principal">
                <input
                  value={draft.website?.contact?.principal || ''}
                  onChange={(e) => patchContact('principal', e.target.value)}
                />
              </Field>
              <Field label="Principal email">
                <input
                  value={draft.website?.contact?.principalEmail || ''}
                  onChange={(e) => patchContact('principalEmail', e.target.value)}
                />
              </Field>
              <Field label="Office email">
                <input
                  value={draft.website?.contact?.email || ''}
                  onChange={(e) => patchContact('email', e.target.value)}
                />
              </Field>
              <Field label="Office hours">
                <input
                  value={draft.website?.contact?.hours || ''}
                  onChange={(e) => patchContact('hours', e.target.value)}
                />
              </Field>
              <div className="admin-grid__full">
                <h3 className="admin-subhead">Phone numbers on contact page</h3>
                <p className="admin-inline-hint">
                  Add or edit numbers one by one. These also update from College details when you
                  save.
                </p>
                <ItemListEditor
                  items={draft.website?.contact?.phones || []}
                  titleKey="display"
                  blank={{ display: '', tel: '' }}
                  fields={[
                    { key: 'display', label: 'Number shown on website' },
                    { key: 'tel', label: 'Number to dial when clicked' },
                  ]}
                  onChange={(phones) => patchContact('phones', phones)}
                />
              </div>
            </div>
            </div>
          ) : null}

          {section === 'labs' ? (
            <div className="admin-labs">
              <div className="admin-grid">
                <Field label="Page title">
                  <input
                    value={draft.website?.campus?.heroTitle || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        website: {
                          ...d.website,
                          campus: { ...d.website.campus, heroTitle: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Short line under title">
                  <input
                    value={draft.website?.campus?.heroSubtitle || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        website: {
                          ...d.website,
                          campus: { ...d.website.campus, heroSubtitle: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Labs intro">
                <textarea
                  rows={2}
                  value={draft.website?.campus?.labsIntro || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      website: {
                        ...d.website,
                        campus: { ...d.website.campus, labsIntro: e.target.value },
                      },
                    }))
                  }
                />
              </Field>
              {labs.map((lab, i) => (
                <article key={lab.id || i} className="admin-lab">
                  <h3>
                    Lab {lab.index || i + 1}: {lab.title}
                  </h3>
                  <div className="admin-grid">
                    <Field label="Title">
                      <input value={lab.title || ''} onChange={(e) => patchLab(i, 'title', e.target.value)} />
                    </Field>
                    <Field label="Index">
                      <input value={lab.index || ''} onChange={(e) => patchLab(i, 'index', e.target.value)} />
                    </Field>
                    <div className="admin-grid__full">
                      <ImageField
                        label="Lab photo"
                        value={lab.image || ''}
                        onChange={(url) => patchLab(i, 'image', url)}
                      />
                    </div>
                    <Field label="Description">
                      <textarea
                        rows={4}
                        value={lab.body || ''}
                        onChange={(e) => patchLab(i, 'body', e.target.value)}
                      />
                    </Field>
                    <Field label="Focus (one per line)">
                      <textarea
                        rows={3}
                        value={(lab.focus || []).join('\n')}
                        onChange={(e) =>
                          patchLab(
                            i,
                            'focus',
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </Field>
                  </div>
                </article>
              ))}
              <h3 className="admin-subhead">Campus facilities</h3>
              <ItemListEditor
                items={draft.website?.campus?.facilities || []}
                titleKey="title"
                imageKey="image"
                blank={{ title: '', desc: '', image: '' }}
                fields={[
                  { key: 'title', label: 'Title' },
                  { key: 'desc', label: 'Description', type: 'textarea' },
                ]}
                onChange={(facilities) =>
                  setDraft((d) => ({
                    ...d,
                    website: {
                      ...d.website,
                      campus: { ...d.website.campus, facilities },
                    },
                  }))
                }
              />
            </div>
          ) : null}

          {section === 'admissions' ? (
            <div className="admin-stack">
              <p className="admin-inline-hint">
                Counselling code is controlled in <strong>Site settings</strong>. Changing it here
                also updates the global site code.
              </p>
              <div className="admin-grid">
              <Field label="Page title">
                <input
                  value={draft.admissions?.heroTitle || ''}
                  onChange={(e) => patchAdmissions('heroTitle', e.target.value)}
                />
              </Field>
              <Field label="Short line under title">
                <input
                  value={draft.admissions?.heroSubtitle || ''}
                  onChange={(e) => patchAdmissions('heroSubtitle', e.target.value)}
                />
              </Field>
              <Field label="Counselling code">
                <input
                  value={draft.admissions?.counsellingCode || draft.site?.code || ''}
                  onChange={(e) => {
                    const code = e.target.value
                    setDraft((d) => ({
                      ...d,
                      site: {
                        ...d.site,
                        code,
                        tag: code ? `Tirupattur · Code ${code}` : d.site?.tag,
                      },
                      admissions: { ...d.admissions, counsellingCode: code },
                    }))
                  }}
                />
              </Field>
            </div>
            </div>
          ) : null}

          {section === 'placements' ? (
            <div className="admin-stack">
              <div className="admin-grid">
                <Field label="Page title">
                  <input
                    value={draft.placements?.heroTitle || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        placements: { ...d.placements, heroTitle: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <h3 className="admin-subhead">Recruiters</h3>
              <ItemListEditor
                items={draft.placements?.recruiters || []}
                titleKey="name"
                imageKey="logo"
                blank={{ name: '', logo: '', published: true }}
                fields={[
                  { key: 'name', label: 'Recruiter name' },
                  { key: 'published', label: 'Show on website', type: 'checkbox' },
                ]}
                onChange={(recruiters) =>
                  setDraft((d) => ({
                    ...d,
                    placements: { ...d.placements, recruiters },
                  }))
                }
              />
              <h3 className="admin-subhead">Placed students (batches)</h3>
              <ItemListEditor
                items={draft.placements?.placedBatches || []}
                titleKey="batch"
                blank={{ batch: '', count: '', note: '', published: true }}
                fields={[
                  { key: 'batch', label: 'Batch year' },
                  { key: 'count', label: 'Students placed' },
                  { key: 'note', label: 'Note', type: 'textarea' },
                  { key: 'published', label: 'Show on website', type: 'checkbox' },
                ]}
                onChange={(placedBatches) =>
                  setDraft((d) => ({
                    ...d,
                    placements: { ...d.placements, placedBatches },
                  }))
                }
              />
            </div>
          ) : null}

          {section === 'notices' ? (
            <ItemListEditor
              items={draft.notices || []}
              titleKey="title"
              blank={{
                title: '',
                summary: '',
                date: new Date().toISOString().slice(0, 10),
                category: 'general',
                urgent: false,
                published: true,
                link: '/news',
              }}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'summary', label: 'Summary', type: 'textarea' },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'category', label: 'Category' },
                { key: 'link', label: 'Link' },
                { key: 'urgent', label: 'Urgent', type: 'checkbox' },
                { key: 'published', label: 'Show on website', type: 'checkbox' },
              ]}
              onChange={(notices) => setDraft((d) => ({ ...d, notices }))}
            />
          ) : null}

          {section === 'events' ? (
            <ItemListEditor
              items={draft.events || []}
              titleKey="title"
              blank={{
                title: '',
                summary: '',
                date: new Date().toISOString().slice(0, 10),
                category: 'academic',
                published: true,
              }}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'summary', label: 'Summary', type: 'textarea' },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'category', label: 'Category' },
                { key: 'published', label: 'Show on website', type: 'checkbox' },
              ]}
              onChange={(events) => setDraft((d) => ({ ...d, events }))}
            />
          ) : null}

          {section === 'news' ? (
            <ItemListEditor
              items={draft.news || []}
              titleKey="title"
              imageKey="image"
              blank={{
                title: '',
                excerpt: '',
                date: new Date().toISOString().slice(0, 10),
                image: '',
                published: true,
              }}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'published', label: 'Show on website', type: 'checkbox' },
              ]}
              onChange={(news) => setDraft((d) => ({ ...d, news }))}
            />
          ) : null}

          {section === 'gallery' ? (
            <ItemListEditor
              items={draft.gallery || []}
              titleKey="title"
              imageKey="src"
              blank={{
                title: '',
                category: 'campus',
                type: 'photo',
                src: '',
                published: true,
                size: 'normal',
              }}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'category', label: 'Category' },
                { key: 'type', label: 'Type (photo)' },
                { key: 'size', label: 'Size' },
                { key: 'published', label: 'Show on website', type: 'checkbox' },
              ]}
              onChange={(gallery) => setDraft((d) => ({ ...d, gallery }))}
            />
          ) : null}

          {section === 'media' ? (
            <MediaLibrary
              items={draft.media || []}
              onChange={(media) => setDraft((d) => ({ ...d, media }))}
            />
          ) : null}

          {section === 'research' ? (
            <div className="admin-stack">
              <div className="admin-grid">
                <Field label="Page title">
                  <input
                    value={draft.research?.heroTitle || ''}
                    onChange={(e) => patchResearch('heroTitle', e.target.value)}
                  />
                </Field>
                <Field label="Short line under title">
                  <input
                    value={draft.research?.heroSubtitle || ''}
                    onChange={(e) => patchResearch('heroSubtitle', e.target.value)}
                  />
                </Field>
              </div>
              <h3 className="admin-subhead">Publications</h3>
              <ItemListEditor
                items={draft.research?.publications || []}
                titleKey="title"
                blank={{ title: '', meta: '', year: '' }}
                fields={[
                  { key: 'title', label: 'Title' },
                  { key: 'meta', label: 'Meta' },
                  { key: 'year', label: 'Year' },
                ]}
                onChange={(publications) => patchResearch('publications', publications)}
              />
              <h3 className="admin-subhead">Projects</h3>
              <ItemListEditor
                items={draft.research?.projects || []}
                titleKey="title"
                blank={{ title: '', desc: '', tag: '', eyebrow: '' }}
                fields={[
                  { key: 'eyebrow', label: 'Small label above title' },
                  { key: 'title', label: 'Title' },
                  { key: 'desc', label: 'Description', type: 'textarea' },
                  { key: 'tag', label: 'Tag' },
                ]}
                onChange={(projects) => patchResearch('projects', projects)}
              />
            </div>
          ) : null}

          {section === 'activity' ? (
            <ActivityLogPanel items={draft.activityLog || []} />
          ) : null}

        </div>
      </div>
    </div>
  )
}
