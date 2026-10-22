/** Shared site constants — Talk to Admin model (no apply wizard). */

export const SITE = {
  name: 'G.P. COLLEGE',
  tag: 'Tirupattur · Code 889',
  code: '889',
  logo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/GP-Logo-neww.png',
  logoMark: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/cropped-GP-Logo-32x32.png',
  phone: '+919443437487',
  phoneDisplay: '+91 94434 37487',
  phoneAlt: '+919578627535',
  phoneAltDisplay: '+91 95786 27535',
  principalEmail: 'drthenmozhish@gmail.com',
  email: 'gppharmacycollege@gmail.com',
  address: 'Vaniyambadi Main Road, Mandalavadi (Vill&Po), Jolarpet – 635851',
  mapsPlaceUrl:
    'https://www.google.com/maps/place/GP+PHARMACY+COLLEGE/@12.612339,78.599926,17z',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7787.086099929674!2d78.599926!3d12.612339!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3badab4e2f3777b5%3A0xa2842979384d8d57!2sGP%20PHARMACY%20COLLEGE!5e0!3m2!1sen!2sin!4v1741348488285!5m2!1sen!2sin',
  pci: '3030',
  hours: 'Mon – Sat · 9:00 AM – 5:00 PM',
  goMs: '460 & 464',
  university: 'The Tamil Nadu Dr. M.G.R. Medical University',
  whatsapp: '919443437487',
  seo: {
    title: 'G.P. COLLEGE | Pharmacy Education · Counselling Code 889',
    description:
      'PCI-approved pharmacy college in Tirupattur / Jolarpet. Counselling Code 889 — D.Pharm, B.Pharm, M.Pharm & Pharm-D. Talk to Admin.',
    ogImage: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/GP-Logo-neww.png',
  },
  social: {
    instagram: 'https://www.instagram.com/gppharmacycollege/',
    youtube: 'https://www.youtube.com/@gppharmacycollege',
    linkedin: 'https://www.linkedin.com/company/gp-pharmacy-college',
  },
}

/** Live CMS overlay — updated by CmsContext so one site edit reaches all helpers. */
let liveSite = { ...SITE }

export function setLiveSite(partial = {}) {
  const next = { ...SITE, ...liveSite, ...partial }
  const code = String(next.code || SITE.code).trim() || SITE.code
  next.code = code
  next.tag = `Tirupattur · Code ${code}`
  const wa = String(next.whatsapp || next.phone || SITE.whatsapp).replace(/\D/g, '')
  next.whatsapp = wa
  liveSite = next
  return liveSite
}

export function getLiveSite() {
  return liveSite
}

export const WHATSAPP = {
  number: '919443437487',
  message: 'Hi, I want admission info — Code 889.',
}

export function whatsappUrl(message) {
  const number = String(liveSite.whatsapp || WHATSAPP.number).replace(/\D/g, '') || WHATSAPP.number
  const code = liveSite.code || SITE.code
  const text =
    message ||
    `Hi, I want admission info — Code ${code}.`
  const withCode = String(text).replace(/Code\s*\d{2,5}/gi, `Code ${code}`).replace(/\b889\b/g, code)
  return `https://wa.me/${number}?text=${encodeURIComponent(withCode)}`
}

/** Map legacy .html paths to React Router paths. */
export function toAppPath(href = '') {
  if (!href || href === '#') return '#'
  if (/^(https?:|tel:|mailto:|wa\.me)/i.test(href) || href.startsWith('//')) return href
  const [pathPart, hash = ''] = String(href).split('#')
  const hashSuffix = hash ? `#${hash}` : ''
  let file = pathPart.replace(/^\.?\//, '').toLowerCase()
  if (!file || file === 'index.html' || file === '/') return `/${hashSuffix}`.replace('//', '/') || '/'
  // Netlify-style paths without .html
  const bare = {
    'about-management': '/about/management',
    'about-principal': '/about/principal',
    'about-policies': '/about/policies',
    'anti-ragging': '/about/policies#anti-ragging',
    grievance: '/about/policies#grievance',
    icc: '/about/policies#icc',
    about: '/about',
    admissions: '/admissions',
    contact: '/contact',
    courses: '/courses',
    campus: '/campus',
    'student-activities': '/student-activities',
    activities: '/student-activities',
    placements: '/placements',
    faculty: '/faculty',
    amc: '/amc',
    'adr-monitoring': '/amc',
    departments: '/departments',
    resources: '/resources',
    news: '/news',
    events: '/events',
    gallery: '/gallery',
    alumni: '/alumni',
    'route-map': '/route-map',
    research: '/research',
    'mandatory-disclosure': '/mandatory-disclosure',
    erp: '/erp',
    blog: '/blog',
    magazine: '/magazine',
    'placed-students': '/placements',
  }
  if (bare[file]) return `${bare[file]}${hashSuffix}`
  const map = {
    'about.html': '/about',
    'about-management.html': '/about/management',
    'about-principal.html': '/about/principal',
    'about-policies.html': '/about/policies',
    'admissions.html': '/admissions',
    'contact.html': '/contact',
    'courses.html': '/courses',
    'campus.html': '/gallery',
    'student-activities.html': '/student-activities',
    'activities.html': '/student-activities',
    'placements.html': '/placements',
    'faculty.html': '/gallery',
    'amc.html': '/amc',
    'adr-monitoring.html': '/amc',
    'departments.html': '/departments',
    'resources.html': '/resources',
    'news.html': '/news',
    'events.html': '/events',
    'gallery.html': '/gallery',
    'alumni.html': '/',
    'route-map.html': '/route-map',
    'research.html': '/research',
    'mandatory-disclosure.html': '/mandatory-disclosure',
    'erp.html': '/erp',
    'blog.html': '/blog',
    'magazine.html': '/magazine',
    'placed-students.html': '/placements',
    'event.html': '/news',
    'admin.html': '/admin',
  }
  const base = map[file] || (file.startsWith('/') ? file : `/${file.replace(/\.html$/, '')}`)
  return `${base}${hashSuffix}`
}

export function assetUrl(url) {
  if (!url) return ''
  const raw = String(url).trim()
  if (!raw || /^javascript:/i.test(raw)) return ''
  if (/^https?:\/\//i.test(raw) || raw.startsWith('//') || raw.startsWith('data:')) return raw
  if (raw.startsWith('/')) return raw
  return `/${raw}`
}

export function youtubeEmbedUrl(url) {
  if (!url) return ''
  const raw = String(url).trim()
  if (!raw) return ''
  let id = ''
  const short = raw.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  const watch = raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/)
  const embed = raw.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/)
  if (short) id = short[1]
  else if (watch) id = watch[1]
  else if (embed) id = embed[1]
  else if (/^[A-Za-z0-9_-]{6,}$/.test(raw)) id = raw
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : ''
}

export function initials(name) {
  return (
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  )
}

export function formatEventDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ]
  return {
    month: months[d.getMonth()] || '',
    day: String(d.getDate()).padStart(2, '0'),
    year: d.getFullYear(),
  }
}

export const CATEGORY_LABELS = {
  admission: 'Admission',
  counselling: 'Counselling',
  exam: 'Examination',
  general: 'General',
  academic: 'Academic',
  seminar: 'Seminar',
  workshop: 'Workshop',
  placement: 'Placement',
  outreach: 'Outreach',
  event: 'Event',
  visit: 'Industrial Visit',
  editorial: 'Editorial',
  'campus-life': 'Campus Life',
  academics: 'Academics',
  research: 'Research & Labs',
  practice: 'Pharmacy Practice',
  careers: 'Careers',
  culture: 'Culture & Sports',
  creative: 'Creative Writing',
}

export function categoryLabel(cat) {
  return CATEGORY_LABELS[cat] || cat
}
