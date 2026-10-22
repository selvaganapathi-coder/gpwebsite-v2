const fs = require('fs')
const path = require('path')

function stripAicte(text) {
  if (typeof text !== 'string') return text
  return text
    .replace(/AICTE\s*&\s*PCI/gi, 'PCI')
    .replace(/PCI\s*&\s*AICTE/gi, 'PCI')
    .replace(/AICTE\s*·\s*PCI/gi, 'PCI')
    .replace(/as per PCI\s*&\s*AICTE standards/gi, 'as per PCI standards')
    .replace(/as per norms of AICTE,?\s*New Delhi,?\s*and\s*/gi, 'as per ')
    .replace(/norms of AICTE,?\s*New Delhi,?\s*and\s*/gi, '')
    .replace(/AICTE\s*\(No\.\s*1-4713123911\)\s*&\s*/gi, '')
    .replace(/AICTE\s*\(1-4713123911\)\s*&amp;\s*/gi, '')
    .replace(/AICTE\s*\(1-4713123911\)\s*&\s*/gi, '')
    .replace(/AICTE\s*\([^)]*\)\s*&amp;\s*/gi, '')
    .replace(/AICTE\s*\([^)]*\)\s*&?\s*/gi, '')
    .replace(/Approved by AICTE\s*&amp;\s*PCI/gi, 'Approved by PCI')
    .replace(/Approved by AICTE\s*&\s*PCI/gi, 'Approved by PCI')
    .replace(/approved by AICTE\s*&amp;\s*PCI/gi, 'approved by PCI')
    .replace(/approved by AICTE\s*&\s*PCI/gi, 'approved by PCI')
    .replace(/AICTE\s*&amp;\s*PCI/gi, 'PCI')
    .replace(/AICTE\s*&\s*/gi, '')
    .replace(/&\s*AICTE/gi, '')
    .replace(/&amp;\s*AICTE/gi, '')
    .replace(/AICTE\s*[·|]\s*/gi, '')
    .replace(/\s*[·|]\s*AICTE[^\n|·]*/gi, '')
    .replace(/AICTE,?\s*PCI and university/gi, 'PCI and university')
    .replace(/AICTE,?\s*PCI,/gi, 'PCI,')
    .replace(/compliance with AICTE,?\s*PCI/gi, 'compliance with PCI')
    .replace(/meets AICTE,?\s*PCI/gi, 'meets PCI')
    .replace(/<tr><th>AICTE Approval<\/th><td>Yes — ID: 1-4713123911<\/td><\/tr>/gi, '')
    .replace(/antiragging@aicte-india\.org/gi, 'helpline@antiragging.in')
    .replace(/ID:\s*1-4713123911/gi, '')
    .replace(/1-4713123911/g, '')
    .replace(/\{\s*id:\s*'aicte'[^}]*\}?,?\s*/g, '')
    .replace(/\{\s*label:\s*'AICTE',\s*value:\s*'[^']*'\s*\}?,?\s*/g, '')
    .replace(/\{\s*label:\s*'Approvals',\s*value:\s*'AICTE · PCI'\s*\}/g, "{ label: 'Approvals', value: 'PCI' }")
    .replace(/AICTE Approved/gi, 'PCI Approved')
    .replace(/<strong>AICTE<\/strong>/gi, '<strong>PCI</strong>')
    .replace(/AICTE[,\s]+New Delhi,?\s*and\s*/gi, '')
    .replace(/AICTE,?\s*/gi, '')
    .replace(/·\s*·/g, '·')
    .replace(/\|\s*\|/g, '|')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
}

const roots = [
  'index.html',
  'about.html',
  'admissions.html',
  'research.html',
  'placements.html',
  'mandatory-disclosure.html',
  'about-principal.html',
  'js/cms-store.js',
  'js/notices-data.js',
  'js/site.js',
  'web/_netlify_src/index.html',
  'web/_netlify_src/about.html',
  'web/_netlify_src/admissions.html',
  'web/_netlify_src/resources.html',
  'web/_netlify_src/campus.html',
  'web/_netlify_src/about-principal.html',
]

const base = path.join(__dirname, '..')
const changed = []
for (const rel of roots) {
  const p = path.join(base, rel)
  if (!fs.existsSync(p)) {
    console.log('MISS', rel)
    continue
  }
  const before = fs.readFileSync(p, 'utf8')
  const after = stripAicte(before)
  if (after !== before) {
    fs.writeFileSync(p, after)
    changed.push(rel)
  }
}
console.log('Updated', changed.length, 'files:')
changed.forEach((f) => console.log(' -', f))
