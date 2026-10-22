import { Link } from 'react-router-dom'
import { useFadeUp } from '../hooks/useFadeUp'
import PageHero from '../components/media/PageHero'
import ActivitiesSubnav from '../components/activities/ActivitiesSubnav'
import { STUDENT_ACTIVITY_GROUPS } from '../data/studentActivities'
import { useCms } from '../context/CmsContext'
import { useStoryPopup, toStoryItem } from '../components/media/StoryPopupContext'

function Fade({ children, className = '', style, ...rest }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  )
}

function ActivityCard({ item, index, siblings, groupTitle }) {
  const { open } = useStoryPopup()
  const extras = {
    categoryLabel: groupTitle || 'Student Activity',
    ctaTo: '/student-activities',
    ctaLabel: 'All activities →',
  }
  const story = toStoryItem(item, extras)
  const pack = siblings.map((s) => toStoryItem(s, extras))
  const num = String(index + 1).padStart(2, '0')

  return (
    <li className="sa-card" id={item.id}>
      <button
        type="button"
        className="sa-card__btn"
        onClick={() => open(story, pack)}
        aria-label={`About ${item.label}`}
      >
        <span className="sa-card__media" aria-hidden="true">
          <img src={item.image} alt="" width="480" height="300" loading="lazy" />
          <span className="sa-card__num">{num}</span>
        </span>
        <span className="sa-card__body">
          <span className="sa-card__label">{item.label}</span>
          <span className="sa-card__summary">{item.summary}</span>
        </span>
      </button>
    </li>
  )
}

function ActivityGroup({ group, ordinal }) {
  const n = String(ordinal).padStart(2, '0')

  return (
    <section className="sa-group" id={group.id} aria-labelledby={`${group.id}-title`}>
      <div className="container">
        <Fade className="sa-group__head">
          <p className="sa-group__eyebrow">
            {n} · {group.title}
          </p>
          <div className="sa-group__head-row">
            <div>
              <h2 className="sa-group__title" id={`${group.id}-title`}>
                {group.title}
              </h2>
              <p className="sa-group__lead">{group.lead}</p>
            </div>
            <p className="sa-group__count">
              <strong>{group.items.length}</strong>
              <span>programmes</span>
            </p>
          </div>
        </Fade>

        <Fade>
          <ul className="sa-grid">
            {group.items.map((item, index) => (
              <ActivityCard
                key={item.id}
                item={item}
                index={index}
                siblings={group.items}
                groupTitle={group.title}
              />
            ))}
          </ul>
        </Fade>
      </div>
    </section>
  )
}

export default function StudentActivitiesPage() {
  const { site } = useCms()

  return (
    <>
      <PageHero
        variant="compact"
        crumbs={[{ label: 'Student Activities' }]}
        title="Student Activities"
        subtitle="Pharmacy Week · seminars · visits · culture · sports · service · clubs"
      />
      <ActivitiesSubnav />

      <section className="sa-intro" aria-labelledby="activities-intro-title">
        <div className="container sa-intro__grid">
          <Fade className="sa-intro__copy">
            <p className="sa-intro__eyebrow">Campus programmes</p>
            <h2 className="sa-intro__title" id="activities-intro-title">
              Life beyond the lecture hall
            </h2>
            <p className="sa-intro__text">
              Pharmacy Week, seminars, industrial and hospital visits, cultural programmes, sports,
              NSS, health camps, and alumni meets — skills, confidence, and community spirit · Code{' '}
              {site.code}.
            </p>
            <div className="sa-intro__actions">
              <Link to="/events" className="btn btn--red">
                Upcoming events →
              </Link>
              <Link to="/gallery" className="btn btn--outline-dark">
                Gallery →
              </Link>
            </div>
          </Fade>
        </div>
      </section>

      {STUDENT_ACTIVITY_GROUPS.map((group, i) => (
        <ActivityGroup key={group.id} group={group} ordinal={i + 1} />
      ))}

      <section className="page-cta-band" aria-label="See more">
        <div className="container page-cta-band__inner">
          <div>
            <h2>See what’s happening next</h2>
            <p>Events and campus photos · Counselling Code {site.code}.</p>
          </div>
          <div className="page-cta-band__actions">
            <Link to="/events" className="btn btn--light btn--lg">
              Events →
            </Link>
            <Link to="/gallery" className="btn btn--outline-light btn--lg">
              Gallery →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
