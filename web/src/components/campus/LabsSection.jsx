import { useCms } from '../../context/CmsContext'
import { TOTAL_LABS } from '../../data/labsDefaults'
import { useFadeUp } from '../../hooks/useFadeUp'
import { useStoryPopup, toStoryItem } from '../media/StoryPopupContext'

function Fade({ children, className = '' }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function LabsSection({ id = 'laboratories' }) {
  const { labs, campusIntro } = useCms()
  const { open } = useStoryPopup()
  const total = Math.max(labs.length, TOTAL_LABS)
  const leadImage = labs[0]?.image

  const pack = labs.map((lab) =>
    toStoryItem(
      {
        id: lab.id,
        title: lab.title,
        image: lab.image,
        summary: lab.body,
      },
      {
        categoryLabel: 'Laboratory',
        ctaTo: '/campus#laboratories',
        ctaLabel: 'All labs →',
      },
    ),
  )

  return (
    <section className="facility-guide facility-guide--labs section space" id={id} aria-labelledby="campus-labs-title">
      <div className="container">
        <div className="facility-guide__layout">
          <Fade className="facility-guide__intro">
            <p className="facility-guide__eyebrow">On Campus</p>
            <h2 className="facility-guide__title" id="campus-labs-title">
              Our Laboratories
            </h2>
            <p className="facility-guide__count">
              <strong>{total}</strong> laboratories in total
            </p>
            <p className="facility-guide__lead">{campusIntro}</p>
            {leadImage ? (
              <figure className="facility-guide__lead-media">
                <img src={leadImage} alt="" width="720" height="480" loading="lazy" />
              </figure>
            ) : null}
          </Fade>

          <Fade className="facility-guide__list-wrap">
            <ul className="facility-guide__list anim-stagger">
              {labs.map((lab, i) => (
                <li key={lab.id} className="facility-guide__item" id={lab.id}>
                  <button
                    type="button"
                    className="facility-guide__row"
                    onClick={() => open(pack[i], pack)}
                    aria-label={`About ${lab.title}`}
                  >
                    <span className="facility-guide__thumb">
                      <img src={lab.image} alt="" width="160" height="120" loading="lazy" />
                    </span>
                    <span className="facility-guide__copy">
                      <span className="facility-guide__label">
                        <span className="facility-guide__index" aria-hidden="true">
                          {lab.index}
                        </span>
                        {lab.title}
                      </span>
                      <span className="facility-guide__summary">{lab.body}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Fade>
        </div>
      </div>
    </section>
  )
}
