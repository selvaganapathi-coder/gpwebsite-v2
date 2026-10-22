import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Announcement from './Announcement'
import Header from './Header'
import Footer from './Footer'
import MobileDock from './MobileDock'
import WhatsAppFloat from './WhatsAppFloat'
import SiteLoader from './SiteLoader'
import PageRouteLoader from './PageRouteLoader'
import MotionChrome from './MotionChrome'
import { StoryPopupProvider } from '../media/StoryPopupContext'
import { usePageReveal } from '../../hooks/usePageReveal'
import ContentProtect from './ContentProtect'
import { useCms } from '../../context/CmsContext'

function updateStickyOffset() {
  const header = document.getElementById('siteHeader')
  const announcement = document.querySelector('.announcement')
  const headerH = header?.getBoundingClientRect().height || 0
  const annH = announcement?.getBoundingClientRect().height || 0
  const stickyTop = header?.classList.contains('scrolled') ? headerH : headerH
  document.documentElement.style.setProperty('--header-sticky-offset', `${Math.round(stickyTop)}px`)
  document.documentElement.style.setProperty(
    '--hash-scroll-margin',
    `calc(${Math.round(headerH + annH)}px + var(--page-subnav-height) + 0.75rem)`
  )
}

function applySeo(site) {
  const seo = site?.seo || {}
  const title = seo.title || `${site?.name || 'G.P. COLLEGE'} · Code ${site?.code || '889'}`
  const description =
    seo.description ||
    'PCI-approved pharmacy college in Jolarpet / Tirupattur. Talk to Admin for admissions.'
  const ogImage = seo.ogImage || site?.logo || ''

  document.title = title

  const upsert = (attr, key, value) => {
    if (!value) return
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', value)
  }

  upsert('name', 'description', description)
  upsert('property', 'og:title', title)
  upsert('property', 'og:description', description)
  if (ogImage) upsert('property', 'og:image', ogImage)
}

export default function SiteLayout() {
  const { pathname, hash } = useLocation()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  const { site } = useCms()

  usePageReveal(!isAdmin)

  useEffect(() => {
    if (!isAdmin) applySeo(site)
  }, [site, isAdmin])

  useLayoutEffect(() => {
    if (isAdmin) return undefined
    updateStickyOffset()
    const onResize = () => updateStickyOffset()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize)
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) return undefined
    updateStickyOffset()
    if (!hash) {
      window.scrollTo(0, 0)
      return undefined
    }
    const id = decodeURIComponent(hash.slice(1))
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [pathname, hash, isAdmin])

  if (isAdmin) {
    return (
      <>
        <BootClear />
        <ContentProtect enabled site={site} />
        <Outlet />
      </>
    )
  }

  return (
    <div id="site-root">
      <ContentProtect enabled site={site} />
      <StoryPopupProvider>
        <SiteLoader />
        <PageRouteLoader />
        <MotionChrome />
        <Announcement />
        <Header />
        <Outlet />
        <Footer />
        <MobileDock />
        <WhatsAppFloat />
      </StoryPopupProvider>
    </div>
  )
}

function BootClear() {
  useEffect(() => {
    document.getElementById('boot-loader')?.remove()
  }, [])
  return null
}

