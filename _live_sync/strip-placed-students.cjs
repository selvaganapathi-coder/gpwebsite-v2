const fs = require('fs')

const path = 'web/src/content/pages/placements.js'
let t = fs.readFileSync(path, 'utf8')

t = t.replace(
  /<li><a class='placement-subnav__link' href='\/placed-students'>Placed Students<\/a><\/li>\\r\\n\s*/g,
  '',
)
t = t.replace(
  /Sample placement success stories — see full batch-wise records on Placed Students\./g,
  'Placement support and career guidance for GP Pharmacy graduates.',
)
t = t.replace(
  /<a class='btn btn--red' href='\/placed-students'>View All Placed Students →<\/a>/g,
  "<a class='btn btn--red' href='/contact'>Talk to T&amp;P Cell →</a>",
)

fs.writeFileSync(path, t)
console.log('placed-students refs left:', (t.match(/placed-students/g) || []).length)
