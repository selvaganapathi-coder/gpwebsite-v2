import { useId } from 'react'
import ImageField from './ImageField'

export function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

/** Simple list of objects with add/remove; optional imageKey for ImageField */
export function ItemListEditor({
  items = [],
  onChange,
  blank,
  titleKey = 'title',
  fields = [],
  imageKey,
}) {
  const uid = useId()

  function update(i, key, value) {
    const next = items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item))
    onChange(next)
  }

  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  function add() {
    onChange([
      ...items,
      {
        id: `item-${Date.now()}`,
        published: true,
        ...blank,
      },
    ])
  }

  return (
    <div className="admin-item-list">
      {items.map((item, i) => (
        <article key={item.id || `${uid}-${i}`} className="admin-item">
          <div className="admin-item__head">
            <strong>
              {item[titleKey] || item.name || item.label || `Item ${i + 1}`}
            </strong>
            <button type="button" className="admin-item__remove" onClick={() => remove(i)}>
              Remove
            </button>
          </div>
          <div className="admin-grid">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={f.rows || 3}
                    value={item[f.key] ?? ''}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  />
                ) : f.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={item[f.key] !== false}
                    onChange={(e) => update(i, f.key, e.target.checked)}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={item[f.key] ?? ''}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  />
                )}
              </Field>
            ))}
            {imageKey ? (
              <div className="admin-grid__full">
                <ImageField
                  label="Image"
                  value={item[imageKey] || ''}
                  onChange={(url) => update(i, imageKey, url)}
                />
              </div>
            ) : null}
          </div>
        </article>
      ))}
      <button type="button" className="btn btn--outline-dark" onClick={add}>
        + Add item
      </button>
    </div>
  )
}
