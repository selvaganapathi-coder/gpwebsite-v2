const fs = require('fs')

const path = 'web/src/content/pages/placements.js'
let t = fs.readFileSync(path, 'utf8')

const comment = '<!-- Recruiters -->'
const openTag = '<section class=\\"section\\" id=\\"recruiters\\">'
const startComment = t.indexOf(comment)
const sectionStart = t.indexOf(openTag)
if (sectionStart < 0) {
  console.error('recruiters section not found')
  process.exit(1)
}

const from = startComment >= 0 ? startComment : sectionStart
let depth = 1
let i = sectionStart + openTag.length
let end = -1
while (i < t.length) {
  const open = t.indexOf('<section', i)
  const close = t.indexOf('</section>', i)
  if (close < 0) break
  if (open >= 0 && open < close) {
    depth++
    i = open + 8
    continue
  }
  depth--
  i = close + '</section>'.length
  if (depth === 0) {
    end = i
    break
  }
}

if (end < 0) {
  console.error('could not find section end, depth', depth)
  process.exit(1)
}

const replacement =
  '<!-- Placement contact -->\\r\\n' +
  '  <section class=\\"section\\" id=\\"placement-contact\\">\\r\\n' +
  '    <div class=\\"container fade-up\\">\\r\\n' +
  '      <div class=\\"info-banner\\">\\r\\n' +
  '        <p>Placement enquiries: <a href=\\"tel:+919443437487\\">+91 94434 37487</a></p>\\r\\n' +
  '        <a class=\\\'btn btn--red\\\' href=\\\'/contact\\\'>Talk to T&amp;P Cell</a>\\r\\n' +
  '      </div>\\r\\n' +
  '    </div>\\r\\n' +
  '  </section>'

t = t.slice(0, from) + replacement + t.slice(end)

t = t.replace(
  "<li><a class='placement-subnav__link' href='/placements#recruiters'>Recruiters</a></li>\\r\\n        ",
  '',
)

fs.writeFileSync(path, t)
console.log('updated', path)
console.log('Our Recruiters?', t.includes('Our Recruiters'))
console.log('Sample partner?', t.includes('Sample partner'))
console.log('company-logo Sun?', /company-logo.*Sun Pharma/.test(t))
