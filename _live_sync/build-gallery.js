const fs = require('fs');
const urls = fs.readFileSync('D:/gp website/_live_sync/gallery-urls.txt', 'utf8').trim().split(/\n/);
const cats = [
  'campus', 'labs', 'classrooms', 'events', 'pharmacy-week',
  'industrial', 'hospital', 'sports', 'cultural', 'placements', 'convocation',
];
const sizes = ['normal', 'large', 'wide', 'tall'];

const items = urls.map((src, i) => {
  const file = src.split('/').pop().replace(/\.[^.]+$/, '');
  let category = cats[i % cats.length];
  if (/Pharmaceutics-lab|pharm-chemistry|pharmacology-lab|pharmacognosy/i.test(src)) category = 'labs';
  else if (/Library|about-gp|College-home|College28|College1\.jpg|College26/i.test(src)) category = 'campus';
  else if (/clg/i.test(src)) category = i % 2 ? 'events' : 'campus';
  const title = file
    .replace(/^G\.P\.?Pharmacy-College/i, 'Campus ')
    .replace(/^G\.P-Pharmacy-College/i, 'Campus ')
    .replace(/^clg/i, 'Campus photo ')
    .replace(/[-_]+/g, ' ')
    .trim();
  return {
    id: `g${i + 1}`,
    category,
    type: 'photo',
    title: title || `Campus photo ${i + 1}`,
    src,
    size: sizes[i % sizes.length],
  };
});

// Keep 360 tour entry at top
items.unshift({
  id: 'g-tour',
  category: 'campus',
  type: '360',
  title: '360° Campus Tour',
  src: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P-Pharmacy-College-home.jpg',
  size: 'wide',
  tourUrl: 'campus.html',
});

const out = `/**
 * G.P. Pharmacy College — Advanced Gallery Data
 * Synced from live WP gallery (gppharmacycollege.com)
 */
window.GPGallery = {
  categories: [
    { id: 'all', label: 'All' },
    { id: 'campus', label: 'Campus' },
    { id: 'labs', label: 'Labs' },
    { id: 'classrooms', label: 'Classrooms' },
    { id: 'events', label: 'Events' },
    { id: 'pharmacy-week', label: 'Pharmacy Week' },
    { id: 'industrial', label: 'Industrial Visits' },
    { id: 'hospital', label: 'Hospital Training' },
    { id: 'sports', label: 'Sports' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'placements', label: 'Placements' },
    { id: 'convocation', label: 'Convocation' },
  ],

  items: ${JSON.stringify(items, null, 2)},

  getByCategory(cat) {
    if (!cat || cat === 'all') return this.items;
    return this.items.filter((i) => i.category === cat);
  },
};
`;

fs.writeFileSync('D:/gp website/js/gallery-data.js', out);
console.log('wrote', items.length, 'items');
