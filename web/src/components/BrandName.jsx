/** Official display name — use everywhere the college is named. */
export const COLLEGE_NAME = 'G.P. COLLEGE'

/**
 * Bold brand mark for the college name.
 * Prefer this over raw text so branding stays consistent.
 */
export default function BrandName({ as: Tag = 'strong', className = '', children, ...rest }) {
  const text = children ?? COLLEGE_NAME
  return (
    <Tag className={`brand-name${className ? ` ${className}` : ''}`} {...rest}>
      {text}
    </Tag>
  )
}
