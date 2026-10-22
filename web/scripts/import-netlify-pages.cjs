/**
 * Extract #site-root body HTML from downloaded Netlify pages → React content modules.
 */
const fs = require('fs')
const path = require('path')

const webRoot = path.join(__dirname, '..')
const srcDir = path.join(webRoot, '_netlify_src')
const outDir = path.join(webRoot, 'src', 'content', 'pages')

const PATH_MAP = {
  '/about-management': '/about/management',
  '/about-principal': '/about/principal',
  '/about-management.html': '/about/management',
  '/about-principal.html': '/about/principal',
  'about-management.html': '/about/management',
  'about-principal.html': '/about/principal',
  'about.html': '/about',
  'index.html': '/',
  'admissions.html': '/admissions',
  'contact.html': '/contact',
  'courses.html': '/courses',
  'campus.html': '/campus',
  'placements.html': '/placements',
  'faculty.html': '/faculty',
  'departments.html': '/departments',
  'resources.html': '/resources',
  'news.html': '/news',
  'events.html': '/events',
  'gallery.html': '/gallery',
  'alumni.html': '/alumni',
  'route-map.html': '/route-map',
  'research.html': '/research',
  'blog.html': '/blog',
  'magazine.html': '/magazine',
  'placed-students.html': '/placed-students',
  'mandatory-disclosure.html': '/mandatory-disclosure',
  'erp.html': '/erp',
}

const PAGES = [
  { file: 'about.html', key: 'about' },
  { file: 'about-management.html', key: 'about-management' },
  { file: 'about-principal.html', key: 'about-principal' },
  { file: 'admissions.html', key: 'admissions' },
  { file: 'contact.html', key: 'contact' },
  { file: 'courses.html', key: 'courses' },
  { file: 'campus.html', key: 'campus' },
  { file: 'placements.html', key: 'placements' },
  { file: 'placed-students.html', key: 'placed-students' },
  { file: 'resources.html', key: 'resources' },
  { file: 'faculty.html', key: 'faculty' },
  { file: 'departments.html', key: 'departments' },
  { file: 'news.html', key: 'news' },
  { file: 'events.html', key: 'events' },
  { file: 'blog.html', key: 'blog' },
  { file: 'magazine.html', key: 'magazine' },
  { file: 'gallery.html', key: 'gallery' },
  { file: 'alumni.html', key: 'alumni' },
  { file: 'route-map.html', key: 'route-map' },
]

function rewriteHref(href) {
  if (!href) return href
  const raw = href.trim()
  if (/^(https?:|tel:|mailto:|#|\/\/)/i.test(raw)) return raw
  const [pathPart, hash = ''] = raw.split('#')
  const hashSuffix = hash ? `#${hash}` : ''
  let p = pathPart.replace(/^\.\//, '')
  if (!p.startsWith('/') && p.endsWith('.html')) {
    const mapped = PATH_MAP[p] || PATH_MAP[`/${p}`]
    if (mapped) return `${mapped}${hashSuffix}`
  }
  if (PATH_MAP[p]) return `${PATH_MAP[p]}${hashSuffix}`
  if (PATH_MAP[p.replace(/^\//, '')]) return `${PATH_MAP[p.replace(/^\//, '')]}${hashSuffix}`
  // bare netlify paths already like /courses
  if (p.startsWith('/')) return `${p}${hashSuffix}`
  if (p.endsWith('.html')) return `/${p.replace(/\.html$/, '')}${hashSuffix}`
  return href
}

function rewriteHtml(html) {
  return html.replace(/\b(href|action)=(["'])([^"']*)\2/gi, (full, attr, q, val) => {
    const next = rewriteHref(val)
    return `${attr}=${q}${next}${q}`
  })
}

function extractSiteRoot(html) {
  const m = html.match(/<div\s+id=["']site-root["'][^>]*>([\s\S]*?)<\/div>\s*(?:<script|$)/i)
  if (!m) throw new Error('site-root not found')
  return m[1].trim()
}

fs.mkdirSync(outDir, { recursive: true })

const index = []
for (const page of PAGES) {
  const full = path.join(srcDir, page.file)
  if (!fs.existsSync(full)) {
    console.warn('missing', page.file)
    continue
  }
  let body = extractSiteRoot(fs.readFileSync(full, 'utf8'))
  body = rewriteHtml(body)
  const outFile = path.join(outDir, `${page.key}.js`)
  const code = `/** Auto-generated from Netlify ${page.file} — do not edit by hand; re-run import-netlify-pages.cjs */\nexport default ${JSON.stringify(body)}\n`
  fs.writeFileSync(outFile, code)
  index.push(page.key)
  console.log('wrote', page.key, Buffer.byteLength(body), 'bytes')
}

fs.writeFileSync(
  path.join(outDir, 'index.js'),
  `/** Page HTML content keys */\n${index.map((k) => `export { default as ${k.replace(/-/g, '_')} } from './${k}.js'`).join('\n')}\n`
)
console.log('done', index.length, 'pages')
