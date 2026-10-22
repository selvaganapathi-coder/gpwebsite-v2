/**
 * One-shot: ensure responsive.css loads on all viewports + mobile SEO meta.
 * Safe UTF-8 writes only when content actually changes.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'))

let fixedMedia = 0
let fixedMeta = 0
const bad = []

for (const f of files) {
  const full = path.join(root, f)
  let t = fs.readFileSync(full, 'utf8')
  if (!t.includes('<!DOCTYPE') && !t.includes('<!doctype')) {
    bad.push(`${f}: no doctype`)
    continue
  }
  const buf = Buffer.from(t, 'utf8')
  if (buf.length && buf.every((b) => b === 0)) {
    bad.push(`${f}: null`)
    continue
  }

  let next = t.replace(
    /href="css\/responsive\.css"\s+media="\(min-width:\s*769px\)"/g,
    'href="css/responsive.css"'
  )
  if (next !== t) {
    fixedMedia += 1
    t = next
  }

  if (!/theme-color/.test(t) && /name=["']viewport["']/.test(t)) {
    t = t.replace(
      /(<meta[^>]*name=["']viewport["'][^>]*>)/i,
      '$1\n  <meta name="theme-color" content="#6e1018">\n  <meta name="format-detection" content="telephone=yes">'
    )
    fixedMeta += 1
  }

  const prev = fs.readFileSync(full, 'utf8')
  if (t !== prev) fs.writeFileSync(full, t, 'utf8')
}

console.log(JSON.stringify({ fixedMedia, fixedMeta, bad, count: files.length }, null, 2))

for (const f of files) {
  const b = fs.readFileSync(path.join(root, f))
  if (b.length && [...b].every((x) => x === 0)) console.log('NULL', f)
}

const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
console.log('index responsive', /responsive\.css/.test(idx))
console.log('index media gate', /responsive\.css" media=/.test(idx))
console.log('index theme', /theme-color/.test(idx))
console.log(idx.split(/\n/).slice(0, 28).join('\n'))
