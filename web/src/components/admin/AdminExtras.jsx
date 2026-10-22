import { useState } from 'react'
import { updateEnquiryStatus, uploadImage } from '../../lib/cmsApi'
import ImageField from './ImageField'
import { Field } from './ItemListEditor'

export function SiteLivePreview({ site }) {
  return (
    <div className="admin-preview" aria-label="Header preview">
      <div className="admin-preview__bar">
        <img src={site?.logoMark || site?.logo} alt="" width={28} height={28} />
        <div>
          <strong>{site?.name || 'G.P. COLLEGE'}</strong>
          <small>{site?.tag || `Tirupattur · Code ${site?.code || '889'}`}</small>
        </div>
        <div className="admin-preview__contact">
          <span>{site?.phoneDisplay || '—'}</span>
          <span>{site?.email || '—'}</span>
        </div>
      </div>
      <p className="admin-preview__hours">{site?.hours || 'Office hours not set'}</p>
    </div>
  )
}

export function QuickNoticeComposer({ onApply }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [urgent, setUrgent] = useState(true)
  const [toAnnouncement, setToAnnouncement] = useState(true)

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onApply({
      title: title.trim(),
      summary: summary.trim(),
      urgent,
      toAnnouncement,
    })
    setTitle('')
    setSummary('')
  }

  return (
    <form className="admin-quick-notice" onSubmit={submit}>
      <h3 className="admin-subhead">Post a notice</h3>
      <p className="admin-inline-hint">
        Write a short notice for students and parents. You can also show it on the home page top bar.
      </p>
      <div className="admin-grid">
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Summary">
          <textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>
        <Field label="Mark urgent">
          <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
        </Field>
        <Field label="Also show on home page top bar">
          <input
            type="checkbox"
            checked={toAnnouncement}
            onChange={(e) => setToAnnouncement(e.target.checked)}
          />
        </Field>
      </div>
      <button type="submit" className="btn btn--red">
        Add notice
      </button>
    </form>
  )
}

export function EnquiriesPanel({ items = [], onChange }) {
  const [busy, setBusy] = useState('')

  async function setStatus(id, status) {
    setBusy(id)
    try {
      const updated = await updateEnquiryStatus(id, status)
      onChange(
        (items || []).map((item) => (item.id === id ? { ...item, ...updated.enquiry } : item)),
      )
    } catch {
      /* keep UI; admin can refresh */
    } finally {
      setBusy('')
    }
  }

  if (!items.length) {
    return <p className="admin-inline-hint">No messages yet. Contact form submissions appear here.</p>
  }

  return (
    <div className="admin-enquiries">
      {items.map((item) => (
        <article key={item.id} className={`admin-enquiry admin-enquiry--${item.status || 'new'}`}>
          <header>
            <strong>{item.name}</strong>
            <span>{item.status || 'new'}</span>
          </header>
          <p>
            {item.phone}
            {item.email ? ` · ${item.email}` : ''}
            {item.course ? ` · ${item.course}` : ''}
          </p>
          <p>{item.message}</p>
          <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</small>
          <div className="admin-enquiry__actions">
            {['new', 'read', 'replied', 'archived'].map((status) => (
              <button
                key={status}
                type="button"
                disabled={busy === item.id || item.status === status}
                onClick={() => setStatus(item.id, status)}
              >
                {status}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

export function MediaLibrary({ items = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadImage(file)
      const media = result.media || {
        id: `media-${Date.now()}`,
        url: result.url,
        name: file.name,
        published: true,
        createdAt: new Date().toISOString(),
      }
      onChange([media, ...(items || []).filter((m) => m.url !== media.url)])
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function remove(id) {
    onChange((items || []).filter((m) => m.id !== id))
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="admin-media">
      <p className="admin-inline-hint">
        Upload photos here, then use them on Home, Gallery, Events, and other pages.
      </p>
      <div className="admin-media__top">
        <label className="btn btn--outline-dark">
          {uploading ? 'Uploading…' : 'Upload photo'}
          <input type="file" accept="image/*" hidden disabled={uploading} onChange={onFile} />
        </label>
        {error ? <p className="admin-banner admin-banner--err">{error}</p> : null}
      </div>
      <div className="admin-media__grid">
        {(items || []).map((item) => (
          <figure key={item.id || item.url} className="admin-media__item">
            <img src={item.url} alt={item.name || ''} />
            <figcaption>{item.name || 'Photo'}</figcaption>
            <div className="admin-media__actions">
              <button type="button" onClick={() => copyUrl(item.url)}>
                Copy link
              </button>
              <button type="button" onClick={() => remove(item.id)}>
                Remove
              </button>
            </div>
          </figure>
        ))}
      </div>
      {!items?.length ? <p className="admin-inline-hint">No photos yet. Upload to reuse across pages.</p> : null}
    </div>
  )
}

export function ActivityLogPanel({ items = [] }) {
  if (!items.length) {
    return <p className="admin-inline-hint">Your saves and uploads will be listed here.</p>
  }
  return (
    <ul className="admin-activity">
      {items.slice(0, 40).map((item) => (
        <li key={item.id}>
          <strong>{item.action}</strong>
          <span>{item.by}</span>
          <span>{item.note}</span>
          <small>{item.at ? new Date(item.at).toLocaleString() : ''}</small>
        </li>
      ))}
    </ul>
  )
}

export function SeoFields({ seo = {}, onChange }) {
  return (
    <div className="admin-grid">
      <Field label="Title when shared on Google / WhatsApp">
        <input
          value={seo.title || ''}
          onChange={(e) => onChange({ ...seo, title: e.target.value })}
        />
      </Field>
      <Field label="Short description when shared">
        <textarea
          rows={3}
          value={seo.description || ''}
          onChange={(e) => onChange({ ...seo, description: e.target.value })}
        />
      </Field>
      <div className="admin-grid__full">
        <ImageField
          label="Photo when shared"
          value={seo.ogImage || ''}
          onChange={(url) => onChange({ ...seo, ogImage: url })}
        />
      </div>
    </div>
  )
}
