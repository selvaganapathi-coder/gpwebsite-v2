import { Link } from 'react-router-dom'
import { BLOG_POSTS } from '../data/media'
import { toAppPath } from '../lib/site'
import { useFadeUp } from '../hooks/useFadeUp'
import MediaSubnav from '../components/media/MediaSubnav'
import PageHero from '../components/media/PageHero'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function BlogPage() {
  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Media' }, { label: 'Blog' }]}
        title="Blog"
        subtitle="Insights on pharmacy education, careers & campus life"
      />
      <MediaSubnav />

      <section className="section">
        <div className="container">
          <Fade className="section__header">
            <span className="section__label">From Our Campus</span>
            <h2 className="section__title">Latest Articles</h2>
          </Fade>
          <div className="media-blog-grid anim-stagger fade-up">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="media-blog-card">
                <Link to={toAppPath(post.href)} className="media-blog-card__media">
                  <img src={post.image} alt="" loading="lazy" />
                </Link>
                <div className="media-blog-card__body">
                  <time dateTime={post.date}>{post.date}</time>
                  <h3>
                    <Link to={toAppPath(post.href)}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <span className="media-blog-card__author">{post.author}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
