import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MAGAZINE_ARTICLES,
  MAGAZINE_CATEGORIES,
  MAGAZINE_ISSUES,
} from '../data/media'
import { categoryLabel } from '../lib/site'
import { useFadeUp } from '../hooks/useFadeUp'
import MediaSubnav from '../components/media/MediaSubnav'
import PageHero from '../components/media/PageHero'
import { useCms } from '../context/CmsContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

function issueLabel(issueId) {
  const issue = MAGAZINE_ISSUES.find((i) => i.id === issueId)
  return issue ? issue.issue : ''
}

export default function MagazinePage() {
  const { site } = useCms()
  const [filter, setFilter] = useState('all')

  const filteredArticles = useMemo(() => {
    if (filter === 'all') return MAGAZINE_ARTICLES
    return MAGAZINE_ARTICLES.filter((a) => a.category === filter)
  }, [filter])

  const groupedByCategory = useMemo(() => {
    const order = MAGAZINE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.id)
    return order
      .map((id) => ({
        id,
        label: categoryLabel(id),
        articles: filteredArticles.filter((a) => a.category === id),
      }))
      .filter((g) => g.articles.length > 0)
  }, [filteredArticles])

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Media' }, { label: 'College Magazine' }]}
        title="College Magazine"
        subtitle="GP Pharmaceutica — category-wise campus writing & annual editions"
      />
      <MediaSubnav />

      <section className="section magazine-intro" aria-labelledby="magazine-intro-title">
        <div className="container">
          <Fade className="magazine-intro__grid">
            <div>
              <p className="home-section-eyebrow">Publications</p>
              <p className="magazine-intro__brand brand-name">
                <strong>{site.name}</strong>
              </p>
              <h2 className="section__title" id="magazine-intro-title">
                GP Pharmaceutica
              </h2>
              <p className="section__desc" style={{ textAlign: 'left', maxWidth: '38rem' }}>
                The official college magazine of G.P. Pharmacy College. Browse content by category —
                editorial, campus life, academics, research, practice, careers, culture, and creative
                writing — for quick access.
              </p>
            </div>
            <ul className="magazine-intro__stats" aria-label="Magazine at a glance">
              <li>
                <strong>{MAGAZINE_ISSUES.length}</strong>
                <span>Editions</span>
              </li>
              <li>
                <strong>{MAGAZINE_CATEGORIES.length - 1}</strong>
                <span>Categories</span>
              </li>
              <li>
                <strong>{MAGAZINE_ARTICLES.length}</strong>
                <span>Features</span>
              </li>
            </ul>
          </Fade>
        </div>
      </section>

      <section className="section section--soft" id="editions" aria-labelledby="editions-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Archives</p>
            <h2 className="section__title" id="editions-title">
              Magazine editions
            </h2>
            <p className="section__desc">Annual and special issues of GP Pharmaceutica.</p>
          </Fade>
          <div className="media-magazine-grid anim-stagger fade-up">
            {MAGAZINE_ISSUES.map((issue) => (
              <article
                key={issue.id}
                className={`media-magazine-card${issue.featured ? ' media-magazine-card--featured' : ''}`}
              >
                <div className="media-magazine-card__cover">
                  <img src={issue.cover} alt="" loading="lazy" width="320" height="420" />
                  <span className="media-magazine-card__year">{issue.year}</span>
                </div>
                <div className="media-magazine-card__body">
                  <h3>{issue.title}</h3>
                  <p className="media-magazine-card__issue">{issue.issue}</p>
                  <p>{issue.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="magazine-content" aria-labelledby="content-title">
        <div className="container">
          <Fade className="section__header section__header--left">
            <p className="home-section-eyebrow">Browse</p>
            <h2 className="section__title" id="content-title">
              Content by category
            </h2>
            <p className="section__desc">
              Filter magazine features for easier reading — each piece is tagged by section.
            </p>
          </Fade>

          <Fade className="notice-filters magazine-filters" role="tablist" aria-label="Magazine categories">
            {MAGAZINE_CATEGORIES.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`notice-filter${filter === f.id ? ' notice-filter--active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </Fade>

          {groupedByCategory.length === 0 ? (
            <Fade>
              <p className="magazine-empty">No magazine content in this category yet.</p>
            </Fade>
          ) : (
            <div className="magazine-categories">
              {groupedByCategory.map((group) => (
                <Fade key={group.id} className="magazine-category">
                  <header className="magazine-category__head">
                    <h3 id={`cat-${group.id}`}>{group.label}</h3>
                    <span>
                      {group.articles.length}{' '}
                      {group.articles.length === 1 ? 'feature' : 'features'}
                    </span>
                  </header>
                  <ul className="magazine-article-list" aria-labelledby={`cat-${group.id}`}>
                    {group.articles.map((article) => (
                      <li key={article.id} className="magazine-article">
                        <div className="magazine-article__meta">
                          <span className="magazine-article__cat">{categoryLabel(article.category)}</span>
                          {issueLabel(article.issueId) ? (
                            <span className="magazine-article__issue">
                              {issueLabel(article.issueId)}
                            </span>
                          ) : null}
                        </div>
                        <h4>{article.title}</h4>
                        {article.author ? (
                          <p className="magazine-article__author">{article.author}</p>
                        ) : null}
                        {article.excerpt ? <p>{article.excerpt}</p> : null}
                      </li>
                    ))}
                  </ul>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-cta-band" aria-label="Contribute to magazine">
        <div className="container page-cta-band__inner">
          <div>
            <h2>Write for GP Pharmaceutica</h2>
            <p>
              Students and faculty can submit articles, poems, and photo essays for the next college
              magazine edition.
            </p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/contact" className="btn btn--light btn--lg">
              Contact editorial board →
            </Link>
            <Link to="/gallery" className="btn btn--outline-light btn--lg">
              Campus gallery →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
