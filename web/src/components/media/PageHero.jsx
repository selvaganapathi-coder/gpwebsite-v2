import { Link } from 'react-router-dom'

export default function PageHero({
  crumbs = [],
  title,
  subtitle,
  variant = '',
}) {
  return (
    <section className={`page-hero${variant ? ` page-hero--${variant}` : ''}`}>
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              {' / '}
              {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
            </span>
          ))}
        </div>
        <h1 className="page-hero__title">{title}</h1>
        {subtitle ? <p className="page-hero__subtitle">{subtitle}</p> : null}
      </div>
    </section>
  )
}
