import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import CampusSubnav from '../components/campus/CampusSubnav'
import LabsSection from '../components/campus/LabsSection'
import { CAMPUS_FACILITY_GROUPS } from '../data/campusFacilities'
import { useCms } from '../context/CmsContext'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

function Fade({ children, className = '', ...rest }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}

function FacilityRow({ item, siblings, groupTitle }) {
  const { open } = useStoryPopup()
  const story = toStoryItem(item, {
    categoryLabel: groupTitle || 'On Campus',
    ctaTo: '/campus',
    ctaLabel: 'Explore campus →',
  })
  const pack = siblings.map((s) =>
    toStoryItem(s, {
      categoryLabel: groupTitle || 'On Campus',
      ctaTo: '/campus',
      ctaLabel: 'Explore campus →',
    }),
  )

  return (
    <li className="facility-guide__item" id={item.id}>
      <button
        type="button"
        className="facility-guide__row"
        onClick={() => open(story, pack)}
        aria-label={`About ${item.label}`}
      >
        <span className="facility-guide__thumb">
          <img src={item.image} alt="" width="160" height="120" loading="lazy" />
        </span>
        <span className="facility-guide__copy">
          <span className="facility-guide__label">{item.label}</span>
          <span className="facility-guide__summary">{item.summary}</span>
        </span>
      </button>
    </li>
  )
}

function FacilitySection({ group }) {
  return (
    <section
      className="facility-guide section space"
      id={group.id}
      aria-labelledby={`${group.id}-title`}
    >
      <div className="container">
        <div className="facility-guide__layout">
          <Fade className="facility-guide__intro">
            <h2 className="facility-guide__title" id={`${group.id}-title`}>
              {group.title}
            </h2>
            <p className="facility-guide__lead">{group.lead}</p>
            {group.image ? (
              <figure className="facility-guide__lead-media">
                <img
                  src={group.image}
                  alt=""
                  width="720"
                  height="480"
                  loading="lazy"
                />
              </figure>
            ) : null}
          </Fade>

          <Fade className="facility-guide__list-wrap">
            <ul className="facility-guide__list anim-stagger">
              {group.items.map((item) => (
                <FacilityRow
                  key={item.id}
                  item={item}
                  siblings={group.items}
                  groupTitle={group.title}
                />
              ))}
            </ul>
          </Fade>
        </div>
      </div>
    </section>
  )
}

export default function CampusPage() {
  const { campus, site } = useCms()
  const byId = Object.fromEntries(CAMPUS_FACILITY_GROUPS.map((g) => [g.id, g]))
  const sections = [
    byId.infrastructure,
    byId.library,
    byId.hostel,
    byId.transport,
    byId.healthcare,
    byId.sports,
    byId.amenities,
  ].filter(Boolean)

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Campus' }]}
        title={campus.heroTitle || 'On Campus Facilities'}
        subtitle={campus.heroSubtitle || `Jolarpet campus · Counselling Code ${site.code}`}
      />
      <CampusSubnav />

      <section className="facility-guide-intro section space" aria-labelledby="facilities-intro-title">
        <div className="container">
          <Fade className="facility-guide-intro__inner">
            <h2 className="facility-guide-intro__title" id="facilities-intro-title">
              Facilities that support pharmacy learning
            </h2>
            <p className="facility-guide-intro__text">
              {campus.labsIntro ||
                'From laboratories and library to hostels and transport — every space is built for focused pharmacy education at Jolarpet.'}
            </p>
          </Fade>
        </div>
      </section>

      {sections.map((group) => (
        <FacilitySection key={group.id} group={group} />
      ))}

      <LabsSection />
    </>
  )
}
