const fs = require('fs')
const vm = require('vm')

// Validate cms-store
try {
  vm.runInNewContext(fs.readFileSync('js/cms-store.js', 'utf8'), {
    window: global,
    localStorage: { getItem: () => null, setItem() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    console,
  })
  console.log('cms-store: ok')
} catch (e) {
  console.log('cms-store runtime error:', e.message)
}

// Fix notices id
{
  let t = fs.readFileSync('js/notices-data.js', 'utf8')
  const next = t.replace("id: '-pci'", "id: 'pci-approved'")
  if (next !== t) {
    fs.writeFileSync('js/notices-data.js', next)
    console.log('notices-data: fixed id')
  }
}

// Fix index.html duplicates
{
  let idx = fs.readFileSync('index.html', 'utf8')
  idx = idx
    .replace(
      '<span>PCI Approved</span> <span>PCI Approved</span> <span>Code 889</span>',
      '<span>PCI Approved</span> <span>Code 889</span>',
    )
    .replace(
      '<div class="home-stat"> <strong>PCI</strong> <span></span> </div> <div class="home-stat"> <strong>PCI</strong> <span>3030</span> </div>',
      '<div class="home-stat"> <strong>PCI</strong> <span>3030</span> </div> <div class="home-stat"> <strong>4</strong> <span>Programs</span> </div>',
    )
  fs.writeFileSync('index.html', idx)
  console.log(
    'index dup PCI badge:',
    /PCI Approved<\/span> <span>PCI/.test(idx),
    'empty PCI stat:',
    /<strong>PCI<\/strong> <span><\/span>/.test(idx),
  )
}

for (const f of ['about.html', 'research.html', 'placements.html']) {
  let t = fs.readFileSync(f, 'utf8')
  const before = t
  t = t
    .replace(/<div class="about-stat-pill"><strong>PCI<\/strong><span><\/span><\/div>\s*/g, '')
    .replace(/<div class="research-stat"><strong>PCI<\/strong><span><\/span><\/div>\s*/g, '')
    .replace(/<div><strong>PCI<\/strong><span><\/span><\/div>\s*/g, '')
  if (t !== before) {
    fs.writeFileSync(f, t)
    console.log(f, 'cleaned empty PCI slots')
  } else {
    console.log(f, 'ok')
  }
}
