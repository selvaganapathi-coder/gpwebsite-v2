const fs = require('fs')

function stripSection(html, startNeedle, endNeedle = '</section>') {
  const start = html.indexOf(startNeedle)
  if (start < 0) return { html, changed: false }
  // walk back to <section
  const sec = html.lastIndexOf('<section', start)
  if (sec < 0) return { html, changed: false }
  let depth = 1
  let i = sec + 8
  let end = -1
  while (i < html.length) {
    const open = html.indexOf('<section', i)
    const close = html.indexOf(endNeedle, i)
    if (close < 0) break
    if (open >= 0 && open < close) {
      depth++
      i = open + 8
      continue
    }
    depth--
    i = close + endNeedle.length
    if (depth === 0) {
      end = i
      break
    }
  }
  if (end < 0) return { html, changed: false }
  return { html: html.slice(0, sec) + html.slice(end), changed: true }
}

// index.html home partners marquee
{
  let html = fs.readFileSync('index.html', 'utf8')
  const r = stripSection(html, 'home-partners')
  if (r.changed) {
    fs.writeFileSync('index.html', r.html)
    console.log('index.html: removed home-partners')
  } else console.log('index.html: no home-partners section')
}

// placements.html recruiters
{
  let html = fs.readFileSync('placements.html', 'utf8')
  const r = stripSection(html, 'id="recruiters"')
  if (r.changed) {
    html = r.html.replace(/<li><a[^>]*>Recruiters<\/a><\/li>\s*/i, '')
    fs.writeFileSync('placements.html', html)
    console.log('placements.html: removed recruiters')
  } else console.log('placements.html: no recruiters section')
}

// netlify placements
{
  const p = 'web/_netlify_src/placements.html'
  if (fs.existsSync(p)) {
    let html = fs.readFileSync(p, 'utf8')
    const r = stripSection(html, 'id="recruiters"')
    if (r.changed) {
      html = r.html.replace(/<li><a[^>]*>Recruiters<\/a><\/li>\s*/i, '')
      fs.writeFileSync(p, html)
      console.log('netlify placements: removed recruiters')
    }
  }
}

console.log('placements.js still clean?', !fs.readFileSync('web/src/content/pages/placements.js','utf8').includes('Our Recruiters'))
