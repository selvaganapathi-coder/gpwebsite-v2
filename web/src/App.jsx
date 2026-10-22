import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CmsProvider } from './context/CmsContext'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AboutManagementPage from './pages/AboutManagementPage'
import AboutPrincipalPage from './pages/AboutPrincipalPage'
import AboutPoliciesPage from './pages/AboutPoliciesPage'
import StaticNetlifyPage from './pages/StaticNetlifyPage'
import NewsPage from './pages/NewsPage'
import EventsPage from './pages/EventsPage'
import BlogPage from './pages/BlogPage'
import MagazinePage from './pages/MagazinePage'
import GalleryPage from './pages/GalleryPage'
import ResourcesPage from './pages/ResourcesPage'
import ResearchPage from './pages/ResearchPage'
import MandatoryDisclosurePage from './pages/MandatoryDisclosurePage'
import StudentActivitiesPage from './pages/StudentActivitiesPage'
import CoursesPage from './pages/CoursesPage'
import DepartmentsPage from './pages/DepartmentsPage'
import AmcPage from './pages/AmcPage'
import ContactPage from './pages/ContactPage'
import RouteMapPage from './pages/RouteMapPage'
import AdminPage from './pages/AdminPage'

function page(key) {
  return <StaticNetlifyPage pageKey={key} />
}

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="about/management" element={<AboutManagementPage />} />
            <Route path="about/principal" element={<AboutPrincipalPage />} />
            <Route path="about/policies" element={<AboutPoliciesPage />} />
            <Route path="about-management" element={<Navigate to="/about/management" replace />} />
            <Route path="about-principal" element={<Navigate to="/about/principal" replace />} />
            <Route path="about-policies" element={<Navigate to="/about/policies" replace />} />
            <Route path="anti-ragging" element={<Navigate to="/about/policies#anti-ragging" replace />} />
            <Route path="grievance" element={<Navigate to="/about/policies#grievance" replace />} />
            <Route path="icc" element={<Navigate to="/about/policies#icc" replace />} />
            <Route path="admissions" element={page('admissions')} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="campus" element={<Navigate to="/gallery" replace />} />
            <Route path="student-activities" element={<StudentActivitiesPage />} />
            <Route path="activities" element={<Navigate to="/student-activities" replace />} />
            <Route path="placements" element={page('placements')} />
            <Route path="placed-students" element={<Navigate to="/placements" replace />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="faculty" element={<Navigate to="/" replace />} />
            <Route path="amc" element={<AmcPage />} />
            <Route path="adr-monitoring" element={<Navigate to="/amc" replace />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="magazine" element={<MagazinePage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="alumni" element={<Navigate to="/" replace />} />
            <Route path="route-map" element={<RouteMapPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="mandatory-disclosure" element={<MandatoryDisclosurePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="erp" element={<Navigate to="/contact" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  )
}
