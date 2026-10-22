const fs = require('fs')
const t = fs.readFileSync('web/dist/assets/index-DvuF_CF-.js', 'utf8')
const re = /AICTE[^"'`]{0,100}/gi
let m
let c = 0
while ((m = re.exec(t)) && c < 20) {
  console.log(++c + ':', JSON.stringify(m[0].slice(0, 120)))
}
console.log('total AICTE mentions:', (t.match(/AICTE/gi) || []).length)
console.log('Approved by AICTE:', /Approved by AICTE/i.test(t))
console.log('AICTE amp PCI:', /AICTE\s*&(?:amp;)?\s*PCI/i.test(t))
console.log('has id 1-471:', t.includes('1-4713123911'))
console.log('strip fn present:', /stripAicte|Remove AICTE|college is PCI/i.test(t))
