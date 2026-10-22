const fs = require('fs')
const path = require('path')

const webRoot = path.join(__dirname, '..')
const cssRoot = path.join(webRoot, '..', 'css')
const names = [
  'style.css',
  'design.css',
  'home.css',
  'home-srec.css',
  'home-polish.css',
  'home-careers.css',
  'community.css',
  'advanced.css',
  'signal.css',
  'mobile.css',
  'theme.css',
  'srec-layout.css',
  'responsive.css',
  'responsive-foundation.css',
  'common-pages.css',
  'resources-hub.css',
  'about-pages.css',
  'contact.css',
  'admissions-connect.css',
  'placed-students.css',
  'media-pages.css',
  'route-map.css',
  'departments.css',
  'research.css',
  'amc.css',
  'disclosure.css',
  'campus.css',
  'campus-labs-grid.css',
  'student-activities.css',
  'academics.css',
  'faculty.css',
  'events-calendar.css',
  'admin-react.css',
  'site-loader.css',
  'motion-polish.css',
  'popup-hits.css',
  'visual-polish.css',
]

let out = ''
for (const name of names) {
  const file = path.join(cssRoot, name)
  if (!fs.existsSync(file)) {
    console.warn('skip missing', name)
    continue
  }
  let text = fs.readFileSync(file, 'utf8')
  if (name === 'design.css') {
    text = text.replace(/@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);\s*/g, '')
  }
  out += '/* === ' + name + ' === */\n' + text + '\n\n'
}

const stylesDir = path.join(webRoot, 'src', 'styles')
fs.mkdirSync(stylesDir, { recursive: true })
fs.writeFileSync(path.join(stylesDir, 'bundle.css'), out)
console.log('Wrote src/styles/bundle.css —', Buffer.byteLength(out), 'bytes')
