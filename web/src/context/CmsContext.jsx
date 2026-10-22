import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_HOME, SEED_EVENTS, SEED_NOTICES } from '../data/homeDefaults'
import { GALLERY_ITEMS } from '../data/gallery'
import { mergeFaculty } from '../data/facultyDefaults'
import { DEFAULT_LABS, DEFAULT_LABS_INTRO } from '../data/labsDefaults'
import { SITE as SITE_FALLBACK, assetUrl, setLiveSite, toAppPath } from '../lib/site'
import { CMS_CHANNEL, fetchCmsHealth, fetchPublicContent } from '../lib/cmsApi'

const CmsContext = createContext(null)

/** Remove AICTE claims — college is PCI-approved only. */
function stripAicte(text) {
  if (text == null || typeof text !== 'string') return text
  return text
    .replace(/\s*[·|&]\s*AICTE[^\n|·]*/gi, '')
    .replace(/AICTE\s*[·|&]\s*/gi, '')
    .replace(/AICTE\s*\([^)]*\)\s*&?\s*/gi, '')
    .replace(/AICTE\s*&\s*/gi, '')
    .replace(/&\s*AICTE/gi, '')
    .replace(/AICTE[,\s]+New Delhi,?\s*and\s*/gi, '')
    .replace(/as per norms of AICTE,?\s*New Delhi,?\s*and\s*/gi, 'as per ')
    .replace(/norms of AICTE,?\s*New Delhi,?\s*and\s*/gi, '')
    .replace(/AICTE,?\s*/gi, '')
    .replace(/ID:\s*1-4713123911/gi, '')
    .replace(/1-4713123911/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .trim()
}

function stripArrowLabel(text) {
  return String(text || '')
    .replace(/\s*→\s*$/u, '')
    .trim()
}

function mergeHomepage(cmsHp, about, placements) {
  const hp = cmsHp?.published ? cmsHp : null
  const base = { ...DEFAULT_HOME }

  if (!hp) {
    return {
      ...base,
      recruiters: placements?.recruiters?.length ? placements.recruiters : base.recruiters || [],
    }
  }

  const captions =
    Array.isArray(hp.captions) && hp.captions.length
      ? hp.captions.map((c, i) => {
          const fallback = base.captions[i] || base.captions[0]
          const rawTitle = (c.title || '').trim()
          const looksLikeBrand =
            !rawTitle ||
            /^g\.?\s*p\.?\s*pharmacy/i.test(rawTitle) ||
            rawTitle.toLowerCase() === String(base.title || '').toLowerCase()
          return {
            title: stripAicte(looksLikeBrand ? fallback.title : rawTitle),
            subtitle: stripAicte(c.subtitle || fallback.subtitle || base.subtitle),
            primary: fallback.primary,
            secondary: fallback.secondary,
          }
        })
      : base.captions

  const homeAbout = { ...base.homeAbout, ...(hp.homeAbout || {}) }
  if (homeAbout.image) homeAbout.image = assetUrl(homeAbout.image)
  if (/^about\s+g\.?\s*p\.?\s*college/i.test(String(homeAbout.title || '').trim())) {
    homeAbout.title = base.homeAbout.title
  }
  if (!homeAbout.facts?.length) homeAbout.facts = base.homeAbout.facts
  if (!homeAbout.lead || String(homeAbout.lead).length > 280) {
    homeAbout.lead = base.homeAbout.lead
  }
  homeAbout.ctaPrimary = stripArrowLabel(homeAbout.ctaPrimary || base.homeAbout.ctaPrimary)
  homeAbout.ctaSecondary = stripArrowLabel(homeAbout.ctaSecondary || base.homeAbout.ctaSecondary)
  homeAbout.title = stripAicte(homeAbout.title)
  homeAbout.lead = stripAicte(homeAbout.lead)
  homeAbout.facts = (homeAbout.facts || []).map(stripAicte)

  const cmsAttrItems = hp.attributes?.items || []
  const attrsLookSpecific = cmsAttrItems.some((item) => item.id === 'pci' || item.id === 'code')
  const attributes = {
    ...base.attributes,
    ...(hp.attributes || {}),
    items: attrsLookSpecific ? cmsAttrItems : base.attributes?.items || [],
  }

  const stats = {
    ...base.stats,
    ...(hp.stats || {}),
    items: hp.stats?.items?.length > 0 ? hp.stats.items : base.stats?.items || [],
  }

  const campusShow = {
    ...base.campusShow,
    ...(hp.campusShow || {}),
    items: (hp.campusShow?.items?.length ? hp.campusShow.items : base.campusShow.items).map(
      (item) => ({
        ...item,
        image: assetUrl(item.image),
      }),
    ),
  }

  const programsShow = {
    ...base.programsShow,
    ...(hp.programsShow || {}),
    ctaHref: toAppPath(hp.programsShow?.ctaHref || base.programsShow.ctaHref),
    items: (hp.programsShow?.items?.length ? hp.programsShow.items : base.programsShow.items).map(
      (item) => ({
        ...item,
        href: toAppPath(item.href || `/courses#${item.id}`),
        image: assetUrl(item.image),
      }),
    ),
  }

  const peopleSlots = (hp.people?.slots?.length ? hp.people.slots : base.people.slots).map(
    (slot) => {
      let { name, role, image, href } = slot
      if (slot.id === 'chairman' && about?.chairman) {
        name = name || about.chairman.name
        role = role || about.chairman.title
        image = image || about.chairman.image
      }
      if (slot.id === 'principal' && about?.leadership?.length) {
        const principal =
          about.leadership.find((l) => /principal/i.test(l.role || '')) || about.leadership[1]
        if (principal) {
          name = name || principal.name
          role = role || principal.role
          image = image || principal.image
        }
      }
      return {
        ...slot,
        name,
        role,
        image: assetUrl(image),
        href: href ? toAppPath(href) : '',
      }
    },
  )

  const people = {
    ...base.people,
    ...(hp.people || {}),
    slots: peopleSlots,
    moreHref: toAppPath(hp.people?.moreHref || base.people.moreHref),
    moreImage: assetUrl(hp.people?.moreImage || base.people.moreImage),
  }

  const outcomes = {
    ...base.outcomes,
    ...(hp.outcomes || {}),
    items: hp.outcomes?.items?.length ? hp.outcomes.items : base.outcomes.items,
    groups: hp.outcomes?.groups?.length ? hp.outcomes.groups : base.outcomes.groups,
    linkHref: toAppPath(hp.outcomes?.linkHref || base.outcomes.linkHref),
  }

  const approvals = (hp.approvals?.length ? hp.approvals : base.approvals)
    .filter(
      (item) =>
        item.id !== 'aicte' &&
        !/aicte/i.test(String(item.title || '')) &&
        !/aicte/i.test(String(item.subtitle || '')) &&
        !/1-4713123911/.test(String(item.detail || '')),
    )
    .map((item) => {
      const fallback = base.approvals.find((a) => a.id === item.id) || {}
      const href = item.pdfUrl || item.href || fallback.href
      return {
        ...fallback,
        ...item,
        title: stripAicte(item.title || fallback.title),
        subtitle: stripAicte(item.subtitle || fallback.subtitle),
        detail: stripAicte(item.detail || fallback.detail || ''),
        href: toAppPath(href),
        linkLabel:
          item.pdfUrl
            ? 'Open PDF →'
            : item.linkLabel || fallback.linkLabel || 'View →',
        variant: item.id === 'code' ? 'code' : fallback.variant || item.variant,
      }
    })
    .sort((a, b) => (a.variant === 'code' ? -1 : b.variant === 'code' ? 1 : 0))

  return {
    ...base,
    badge: stripAicte(hp.badge || base.badge),
    title: hp.title || base.title,
    subtitle: stripAicte(hp.subtitle || base.subtitle),
    announcement: stripAicte(hp.announcement || base.announcement),
    slides: (hp.slides?.length ? hp.slides : base.slides).map(assetUrl).filter(Boolean),
    captions,
    homeAbout,
    attributes,
    stats,
    campusShow,
    programsShow,
    people,
    outcomes,
    recruitersLabel: hp.recruitersLabel || base.recruitersLabel || '',
    recruiters: normalizeRecruiters(placements?.recruiters, base.recruiters || []),
    campusTour: {
      ...base.campusTour,
      ...(hp.campusTour || {}),
      fallbackImage: assetUrl(hp.campusTour?.fallbackImage || base.campusTour.fallbackImage),
    },
    approvals,
  }
}

function normalizeRecruiters(list, fallback) {
  const raw = Array.isArray(list) && list.length ? list : fallback
  return raw
    .map((item) => (typeof item === 'string' ? item : item?.name || item?.title || ''))
    .map((s) => String(s).trim())
    .filter(Boolean)
}

function normalizeNotices(list, fallback) {
  const items = Array.isArray(list) && list.length ? list : fallback
  return items
    .filter((n) => n.published !== false)
    .map((n) => ({ ...n, link: n.link ? toAppPath(n.link) : '/news' }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function normalizeEvents(list, fallback) {
  const items = Array.isArray(list) && list.length ? list : fallback
  return items
    .filter((e) => e.published !== false)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

function normalizeNews(list) {
  const items = Array.isArray(list) ? list : []
  return items
    .filter((n) => n.published !== false)
    .map((n) => ({
      ...n,
      image: assetUrl(n.image),
    }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
}

function mergeSite(cmsSite) {
  const merged = { ...SITE_FALLBACK, ...(cmsSite || {}) }
  merged.social = {
    ...(SITE_FALLBACK.social || {}),
    ...((cmsSite && cmsSite.social) || {}),
  }
  const rawName = String(merged.name || '').trim()
  if (
    !rawName ||
    /^g\.?\s*p\.?\s*pharmacy\s*college$/i.test(rawName) ||
    /^gp\s*pharmacy\s*college$/i.test(rawName)
  ) {
    merged.name = SITE_FALLBACK.name
  }
  const code = String(merged.code || SITE_FALLBACK.code).trim() || SITE_FALLBACK.code
  merged.code = code
  merged.tag = `Tirupattur · Code ${code}`
  const wa = String(merged.whatsapp || merged.phone || SITE_FALLBACK.whatsapp || '').replace(/\D/g, '')
  merged.whatsapp = wa || SITE_FALLBACK.whatsapp
  if (!merged.hours) merged.hours = SITE_FALLBACK.hours
  if (!merged.pci) merged.pci = SITE_FALLBACK.pci
  if (!merged.goMs) merged.goMs = SITE_FALLBACK.goMs
  if (!merged.university) merged.university = SITE_FALLBACK.university
  merged.seo = { ...(SITE_FALLBACK.seo || {}), ...(merged.seo || {}) }
  return merged
}

function mergeContact(cmsContact, site) {
  const c = cmsContact || {}
  const code = site.code || SITE_FALLBACK.code
  const phones = Array.isArray(c.phones) && c.phones.length
    ? c.phones.map((p) =>
        typeof p === 'string' ? { display: p, tel: p.replace(/\s/g, '') } : p,
      )
    : [
        { display: site.phoneDisplay, tel: site.phone },
        { display: site.phoneAltDisplay, tel: site.phoneAlt },
      ]
  const heroSubtitleRaw =
    c.heroSubtitle || `Talk to Admin · Counselling Code ${code} · Jolarpet campus`
  return {
    heroTitle: c.heroTitle || 'Contact Us',
    heroSubtitle: String(heroSubtitleRaw)
      .replace(/Counselling Code\s*\d{2,5}/gi, `Counselling Code ${code}`)
      .replace(/Code\s*\d{2,5}/gi, `Code ${code}`)
      .replace(/\b889\b/g, code),
    address: c.address || site.address,
    principal: c.principal || 'Prof. Dr. S. Thenmozhi, M.Pharm., Ph.D',
    principalEmail: c.principalEmail || site.principalEmail,
    email: c.email || site.email,
    hours: c.hours || site.hours || 'Mon – Sat · 9:00 AM – 5:00 PM',
    phones,
    mapsEmbedUrl: site.mapsEmbedUrl || SITE_FALLBACK.mapsPlaceUrl,
  }
}

/** Keep homepage copy aligned with live site code/name even before a full CMS resync. */
function alignHomepageWithSite(homepage, site) {
  if (!homepage || !site?.code) return homepage
  const code = site.code
  const replaceCode = (text) =>
    typeof text !== 'string'
      ? text
      : text
          .replace(/Counselling Code\s*\d{2,5}/gi, `Counselling Code ${code}`)
          .replace(/Code\s*\d{2,5}/g, `Code ${code}`)
          .replace(/\b889\b/g, code)

  const next = { ...homepage }
  if (site.name) next.title = site.name
  next.badge = replaceCode(next.badge || `PCI Approved, Counselling Code ${code}`)
  next.announcement = replaceCode(next.announcement)
  next.subtitle = replaceCode(next.subtitle)
  if (Array.isArray(next.captions)) {
    next.captions = next.captions.map((c) => ({
      ...c,
      subtitle: replaceCode(c.subtitle),
    }))
  }
  if (Array.isArray(next.approvals)) {
    next.approvals = next.approvals.map((item) =>
      item?.id === 'code' || item?.variant === 'code'
        ? { ...item, title: code, subtitle: item.subtitle || 'Counselling Code' }
        : item,
    )
  }
  if (Array.isArray(next.stats?.items)) {
    next.stats = {
      ...next.stats,
      items: next.stats.items.map((item) =>
        item?.id === 'code' ? { ...item, value: code } : item,
      ),
    }
  }
  if (Array.isArray(next.attributes?.items)) {
    next.attributes = {
      ...next.attributes,
      items: next.attributes.items.map((item) =>
        item?.id === 'code'
          ? {
              ...item,
              title: `Counselling Code ${code}`,
              desc: replaceCode(item.desc),
            }
          : item,
      ),
    }
  }
  if (next.homeAbout) {
    next.homeAbout = {
      ...next.homeAbout,
      lead: replaceCode(next.homeAbout.lead),
      facts: Array.isArray(next.homeAbout.facts)
        ? next.homeAbout.facts.map(replaceCode)
        : next.homeAbout.facts,
    }
  }
  return next
}

function mergeLabs(campus) {
  const cmsLabs = Array.isArray(campus?.labs) ? campus.labs : []
  const byId = new Map(cmsLabs.map((lab) => [lab.id, lab]))

  const source =
    cmsLabs.length >= DEFAULT_LABS.length
      ? cmsLabs
      : DEFAULT_LABS.map((def) => ({ ...def, ...(byId.get(def.id) || {}) }))

  return source.map((lab, i) => {
    const fallback = DEFAULT_LABS[i] || DEFAULT_LABS[0]
    return {
      ...fallback,
      ...lab,
      id: lab.id || fallback.id,
      index: lab.index || String(i + 1).padStart(2, '0'),
      image: assetUrl(lab.image || fallback.image),
      focus: Array.isArray(lab.focus) ? lab.focus : fallback.focus || [],
    }
  })
}

const DEFAULT_FACILITIES = [
  {
    title: 'Smart Classrooms',
    desc: 'Interactive digital tools for dynamic, engaging lectures.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College26.jpg',
  },
  {
    title: 'AC Central Library',
    desc: 'Vast collection of pharmacy texts, journals, and research material.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College1.jpg',
  },
  {
    title: 'Separate Hostels',
    desc: 'Secure, comfortable boys & girls hostel facilities.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College28.jpg',
  },
  {
    title: 'College Transport',
    desc: 'Safe, reliable buses covering Jolarpet and surrounding areas.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College10.jpg',
  },
  {
    title: 'Computer Center',
    desc: 'Modern systems with pharmacy software and internet access.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College22.jpg',
  },
  {
    title: 'Seminar Halls',
    desc: 'Spacious halls for conferences, workshops, and guest lectures.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College12.jpg',
  },
]

const DEFAULT_HIGHLIGHTS = [
  {
    title: 'Experienced and Skilled Faculty',
    desc: 'Our faculty boasts extensive real-world experience and deep subject matter expertise.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Staff.png',
  },
  {
    title: 'Smart Classrooms',
    desc: 'Interactive tech enhances learning. Digital tools drive dynamic, engaging classrooms.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Smartclass.png',
  },
  {
    title: 'Well-equipped Computer Center',
    desc: 'Modern computers, helpful software, and effective, practical, hands-on learning.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Smart-library.png',
  },
  {
    title: 'Modern Laboratories',
    desc: 'Hands-on learning with modern equipment. Practical skills developed in cutting-edge labs.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Labs.png',
  },
  {
    title: 'Separate Male & Female Hostel',
    desc: 'Comfortable, secure hostels ensure student well-being. Separate facilities provide privacy and safety.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/hostel.png',
  },
  {
    title: 'Excellent Library with AC',
    desc: 'Air-conditioned library offers a vast collection. Comfortable space for focused study and research.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/library.png',
  },
  {
    title: 'Transportation Facilities',
    desc: 'Convenient transportation options ensure easy commutes. Safe and reliable travel for all students.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Transport.png',
  },
  {
    title: 'Purified Drinking Water',
    desc: 'Safe, purified drinking water readily available. Healthy hydration for all students and staff.',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/water.png',
  },
]

const DEFAULT_DISCOVER_PROSE = [
  'Our Chairman Er. G. Ponnusamy, B.E., educationist, is providing basic education to middle-class and underserved communities. He started ITI in 1979, then Tirupattur Arts and Science College, GP Polytechnic, GP College of Education, and G.P. Pharmacy College.',
  'G.P. Pharmacy College is the first pharmacy college in Tirupattur as well as Vellore District. It started in 2019 with infrastructure as per Pharmacy Council of India (PCI), New Delhi. Affiliated to The Tamil Nadu Dr. M.G.R. Medical University, we offer D.Pharm, B.Pharm, M.Pharm and Pharm-D.',
]

function mergeFacilities(campus) {
  const list = campus?.facilities?.length ? campus.facilities : DEFAULT_FACILITIES
  return list.map((f) => ({
    ...f,
    image: assetUrl(f.image),
  }))
}

function mergeAbout(about) {
  const a = about || {}
  const highlights = a.highlights?.length ? a.highlights : DEFAULT_HIGHLIGHTS
  const defaultLeadership = [
    {
      name: 'Er. G. Ponnusamy',
      role: 'Chairman · GP Group of Institutions',
      image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-Chairman.jpg',
      bio: 'Visionary educationist providing quality education since 1979 through ITI, arts & science, polytechnic, education and pharmacy colleges.',
    },
    {
      name: 'Prof. Dr. S. Thenmozhi',
      role: 'Principal · M.Pharm., Ph.D',
      image: '/images/about/about-principal.png',
      bio: 'Academic head responsible for institutional excellence and student outcomes.',
      href: '/about/principal',
    },
  ]
  const leadershipRaw = a.leadership?.length ? a.leadership : defaultLeadership
  return {
    heroTitle: a.heroTitle || 'About Us',
    heroSubtitle:
      a.heroSubtitle || 'First pharmacy college in Tirupattur & Vellore District · Established 2019',
    discoverTitle: a.discoverTitle || 'GP Group — Education for Every Community',
    discoverProse: (
      Array.isArray(a.discoverProse) && a.discoverProse.length
        ? a.discoverProse
        : DEFAULT_DISCOVER_PROSE
    ).map(stripAicte),
    discoverImage: assetUrl(
      a.discoverImage ||
        'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P-Pharmacy-College-home.jpg',
    ),
    highlights: highlights.map((h) => ({
      ...h,
      title: stripAicte(h.title),
      desc: stripAicte(h.desc),
      image: assetUrl(h.image),
    })),
    leadership: leadershipRaw.map((l) => ({
      ...l,
      bio: stripAicte(l.bio),
      image: assetUrl(l.image),
    })),
    chairman: {
      name: a.chairman?.name || 'Er. G. Ponnusamy',
      title: a.chairman?.title || 'Chairman · GP Group of Institutions',
      bio: stripAicte(a.chairman?.bio || ''),
      image: assetUrl(
        a.chairman?.image ||
          'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-Chairman.jpg',
      ),
    },
  }
}

function mergeCampus(campus) {
  return {
    heroTitle: campus?.heroTitle || 'Digital Campus',
    heroSubtitle: campus?.heroSubtitle || 'World-class infrastructure for pharmacy education',
    labsIntro: campus?.labsIntro || DEFAULT_LABS_INTRO,
    labs: mergeLabs(campus),
    facilities: mergeFacilities(campus),
  }
}

function mergeResearch(research) {
  const r = research || {}
  return {
    heroTitle: r.heroTitle || 'Research & Innovation',
    heroSubtitle:
      r.heroSubtitle ||
      'Advancing pharmaceutical sciences through discovery, collaboration & industry partnerships',
    publications: Array.isArray(r.publications) ? r.publications : [],
    projects: Array.isArray(r.projects) ? r.projects : [],
    stats: Array.isArray(r.stats) ? r.stats : [],
  }
}

export function CmsProvider({ children }) {
  const [raw, setRaw] = useState(null)
  const [status, setStatus] = useState('loading')
  const updatedAtRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchPublicContent()
      setRaw(data)
      updatedAtRef.current = data.updatedAt || null
      setStatus('ready')
    } catch {
      setRaw(null)
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setLiveSite(mergeSite(raw?.site))
  }, [raw])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CMS_CHANNEL) load()
    }
    const onLocal = () => load()
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(CMS_CHANNEL, onLocal)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)

    let channel
    try {
      channel = new BroadcastChannel(CMS_CHANNEL)
      channel.onmessage = () => load()
    } catch {
      /* ignore */
    }

    const poll = window.setInterval(async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const health = await fetchCmsHealth()
        if (health.updatedAt && health.updatedAt !== updatedAtRef.current) {
          await load()
        }
      } catch {
        /* ignore */
      }
    }, 4000)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CMS_CHANNEL, onLocal)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      channel?.close()
      window.clearInterval(poll)
    }
  }, [load])

  const value = useMemo(() => {
    const site = mergeSite(raw?.site)
    const homepage = alignHomepageWithSite(
      mergeHomepage(raw?.website?.homepage, raw?.website?.about, raw?.placements),
      site,
    )
    const campus = mergeCampus(raw?.website?.campus)
    const gallerySource =
      Array.isArray(raw?.gallery) && raw.gallery.length
        ? raw.gallery.filter((g) => g.published !== false)
        : GALLERY_ITEMS
    const admissionsRaw = raw?.admissions || null
    const admissions = admissionsRaw
      ? {
          ...admissionsRaw,
          counsellingCode: site.code || admissionsRaw.counsellingCode,
          heroSubtitle: admissionsRaw.heroSubtitle
            ? String(admissionsRaw.heroSubtitle)
                .replace(/Counselling Code\s*\d{2,5}/gi, `Counselling Code ${site.code}`)
                .replace(/Code\s*\d{2,5}/gi, `Code ${site.code}`)
                .replace(/\b889\b/g, site.code)
            : admissionsRaw.heroSubtitle,
        }
      : null
    return {
      status,
      raw,
      site,
      homepage,
      contact: mergeContact(raw?.website?.contact, site),
      campus,
      labs: campus.labs,
      facilities: campus.facilities,
      campusIntro: campus.labsIntro,
      notices: normalizeNotices(raw?.notices, SEED_NOTICES),
      events: normalizeEvents(raw?.events, SEED_EVENTS),
      news: normalizeNews(raw?.news),
      gallery: gallerySource.map((item) => ({
        ...item,
        src: assetUrl(item.src || item.image || item.url),
        image: assetUrl(item.src || item.image || item.url),
      })),
      about: mergeAbout(raw?.website?.about),
      faculty: mergeFaculty(raw?.website?.faculty),
      courses: raw?.website?.courses || null,
      placements: raw?.placements || null,
      admissions,
      research: mergeResearch(raw?.research),
      refresh: load,
    }
  }, [raw, status, load])

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
