import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GALLERY_CATEGORIES } from '../data/gallery'
import { enrichGalleryList } from '../data/galleryStories'
import { useCms } from '../context/CmsContext'
import { useFadeUp } from '../hooks/useFadeUp'
import MediaSubnav from '../components/media/MediaSubnav'
import PageHero from '../components/media/PageHero'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function GalleryPage() {
  const { gallery } = useCms()
  const { open } = useStoryPopup()
  const [filter, setFilter] = useState('all')

  const photos = useMemo(
    () =>
      enrichGalleryList(
        gallery.filter((i) => i.type !== '360' && i.type !== 'video'),
      ),
    [gallery],
  )

  const items = useMemo(() => {
    if (filter === 'all') return photos
    return photos.filter((i) => i.category === filter)
  }, [filter, photos])

  const pack = useMemo(
    () =>
      items.map((item) =>
        toStoryItem(item, {
          categoryLabel: item.categoryLabel,
          ctaTo: '/events',
          ctaLabel: 'View events →',
        }),
      ),
    [items],
  )

  useEffect(() => {
    /* filter change — nothing to close; shared popup handles itself */
  }, [filter])

  const openAt = useCallback(
    (index) => {
      open(pack[index], pack)
    },
    [open, pack],
  )

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Media' }, { label: 'Gallery' }]}
        title="Gallery"
        subtitle="Campus life, labs, and college moments — click any photo to learn more"
      />
      <MediaSubnav />

      <section className="section advanced-gallery-section">
        <div className="container">
          <Fade className="gallery-filter-bar">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`gallery-filter${filter === cat.id ? ' gallery-filter--active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </Fade>

          <div className="advanced-gallery-grid anim-stagger fade-up">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`advanced-gallery-item advanced-gallery-item--${item.size || 'normal'}`}
                onClick={() => openAt(index)}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <span className="advanced-gallery-item__label">{item.title}</span>
              </button>
            ))}
          </div>

          <div className="programs-cta fade-up visible" style={{ marginTop: '2rem' }}>
            <Link to="/admissions" className="btn btn--red btn--lg">
              Talk to Admin →
            </Link>
            <Link to="/contact" className="btn btn--amber">
              Contact →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
