import { useRef, useState } from 'react'
import { uploadImage } from '../../lib/cmsApi'

export default function ImageField({ label, value = '', onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const data = await uploadImage(file)
      onChange(typeof data === 'string' ? data : data.url)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-image-field">
      {label ? <span className="admin-image-field__label">{label}</span> : null}
      <div className="admin-image-field__row">
        {value ? (
          <div className="admin-image-field__preview">
            <img src={value} alt="" />
          </div>
        ) : (
          <div className="admin-image-field__empty">No image</div>
        )}
        <div className="admin-image-field__controls">
          <input
            type="text"
            value={value || ''}
            placeholder="Paste photo link or click Upload"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="admin-image-field__actions">
            <button
              type="button"
              className="btn btn--outline-dark btn--sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            {value ? (
              <button type="button" className="btn btn--amber btn--sm" onClick={() => onChange('')}>
                Remove
              </button>
            ) : null}
          </div>
          {error ? <p className="admin-image-field__error">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFile}
      />
    </div>
  )
}
