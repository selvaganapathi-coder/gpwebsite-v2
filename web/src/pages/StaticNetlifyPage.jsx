import NetlifyHtmlPage from '../components/NetlifyHtmlPage'
import about from '../content/pages/about'
import aboutManagement from '../content/pages/about-management'
import aboutPrincipal from '../content/pages/about-principal'
import admissions from '../content/pages/admissions'
import contact from '../content/pages/contact'
import courses from '../content/pages/courses'
import campus from '../content/pages/campus'
import placements from '../content/pages/placements'
import resources from '../content/pages/resources'
import faculty from '../content/pages/faculty'
import departments from '../content/pages/departments'
import alumni from '../content/pages/alumni'
import routeMap from '../content/pages/route-map'

const PAGES = {
  about,
  'about-management': aboutManagement,
  'about-principal': aboutPrincipal,
  admissions,
  contact,
  courses,
  campus,
  placements,
  resources,
  faculty,
  departments,
  alumni,
  'route-map': routeMap,
}

export default function StaticNetlifyPage({ pageKey }) {
  const html = PAGES[pageKey]
  if (!html) {
    return (
      <main className="section">
        <div className="container">
          <p>Page content missing for “{pageKey}”.</p>
        </div>
      </main>
    )
  }
  return <NetlifyHtmlPage html={html} />
}
