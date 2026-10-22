/**
 * Normalize static HTML to current crimson/gold CSS stack + mobile foundation.
 * Preserves page-specific stylesheets; does not rewrite body content.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const FONT =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0;500;0;600;0;700;1;500&family=Poppins:wght@400;500;600;700&display=swap"

const CORE = [
  'css/style.css',
  'css/design.css',
  'css/advanced.css',
  'css/signal.css',
  'css/mobile.css',
]

const OPTIONAL_BY_PAGE = {
  'index.html': ['css/home.css', 'css/community.css'],
  'courses.html': ['css/community.css'],
  'contact.html': ['css/contact.css'],
  'gallery.html': ['css/media-pages.css'],
  'news.html': ['css/media-pages.css'],
  'blog.html': ['css/media-pages.css'],
  'magazine.html': ['css/media-pages.css'],
  'events.html': ['css/media-pages.css'],
  'event.html': ['css/media-pages.css'],
  'about.html': ['css/about-pages.css'],
  'about-management.html': ['css/about-pages.css'],
  'about-principal.html': ['css/about-pages.css'],
  'faculty.html': ['css/faculty.css'],
  'departments.html': ['css/departments.css'],
  'alumni.html': ['css/alumni.css'],
  'research.html': ['css/research.css'],
  'placed-students.html': ['css/placed-students.css'],
  'route-map.html': ['css/route-map.css'],
  'admissions.html': ['css/admissions-connect.css'],
  'admin.html': ['css/admin.css'],
}

function stylesheetHref(href, media) {
  if (media) return `  <link rel="stylesheet" href="${href}" media="${media}">`
  return `  <link rel="stylesheet" href="${href}">`
}

let updated = 0
for (const f of fs.readdirSync(root).filter((x) => x.endsWith('.html'))) {
  const full = path.join(root, f)
  let t = fs.readFileSync(full, 'utf8')
  if (!/<!DOCTYPE html>/i.test(t)) continue

  // Font
  t = t.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet">/,
    `<link href="${FONT}" rel="stylesheet">`
  )

  // Collect page-specific css already present (not in core/theme/responsive/home/community)
  const existing = [...t.matchAll(/href="(css\/[^"]+\.css)"/g)].map((m) => m[1])
  const pageExtras = OPTIONAL_BY_PAGE[f] || []
  const extras = [
    ...pageExtras,
    ...existing.filter(
      (h) =>
        ![
          ...CORE,
          'css/theme.css',
          'css/responsive.css',
          'css/home.css',
          'css/community.css',
          ...pageExtras,
        ].includes(h)
    ),
  ].filter((v, i, a) => a.indexOf(v) === i)

  const block = [
    ...CORE.map((h) => stylesheetHref(h)),
    ...extras.map((h) => stylesheetHref(h)),
    stylesheetHref('css/theme.css', '(min-width: 901px)'),
    stylesheetHref('css/responsive.css'),
  ].join('\n')

  // Replace contiguous stylesheet block(s) for css/*
  const next = t.replace(
    /(\s*<link rel="stylesheet" href="css\/[^"]+"[^>]*>)+/,
    `\n${block}`
  )

  if (next !== t) {
    fs.writeFileSync(full, next, 'utf8')
    updated += 1
    console.log('updated', f)
  } else {
    console.log('unchanged', f)
  }
}

console.log('done', { updated })
