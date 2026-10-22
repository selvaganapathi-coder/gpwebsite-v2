/**
 * Enrich gallery photos with readable titles + event-style explanations
 * for the image story popup.
 */

const STORIES = {
  campus: {
    label: 'Campus',
    titles: ['Main Campus View', 'College Entrance', 'Campus Pathways', 'Jolarpet Campus'],
    text: 'A look at G.P. COLLEGE on Vaniyambadi Main Road, Jolarpet — Tirupattur’s first pharmacy college (Est. 2019, Counselling Code 889).',
  },
  labs: {
    label: 'Laboratories',
    titles: ['Pharmacy Lab Session', 'Practical Training Lab', 'Hands-on Lab Work'],
    text: 'Students practise pharmaceutical techniques in modern labs — pharmaceutics, pharmacology, chemistry, and analysis — building skills for hospital and industry careers.',
  },
  classrooms: {
    label: 'Classrooms',
    titles: ['Smart Classroom', 'Theory Session', 'Interactive Learning'],
    text: 'Theory classes use interactive teaching tools so students connect classroom learning with real pharmacy practice.',
  },
  events: {
    label: 'Campus Event',
    titles: [
      'College Event Day',
      'Guest Programme',
      'Student Gathering',
      'Campus Celebration',
      'Academic Event',
    ],
    text: 'Campus events bring students, faculty, and guests together — seminars, awareness programmes, and celebrations that strengthen college community life.',
  },
  'pharmacy-week': {
    label: 'Pharmacy Week',
    titles: ['Pharmacy Week Showcase', 'Pharmacy Week Activity', 'Department Display'],
    text: 'Pharmacy Week highlights the profession with department showcases, competitions, and guest talks that inspire future pharmacists.',
  },
  industrial: {
    label: 'Industrial Visit',
    titles: ['Industry Visit', 'Manufacturing Tour', 'Plant Exposure'],
    text: 'Industrial visits expose students to real manufacturing and quality systems — bridging classroom theory with industry practice.',
  },
  hospital: {
    label: 'Hospital Training',
    titles: ['Hospital Training', 'Clinical Exposure', 'Ward Visit'],
    text: 'Hospital training builds clinical confidence — case observation, patient counselling practice, and pharmacy service exposure.',
  },
  sports: {
    label: 'Sports',
    titles: ['Sports Day', 'Campus Sports', 'Athletic Meet'],
    text: 'Sports and fitness activities keep student life balanced — teamwork, discipline, and healthy competition on campus.',
  },
  cultural: {
    label: 'Cultural',
    titles: ['Cultural Programme', 'Talent Showcase', 'College Fest'],
    text: 'Cultural programmes celebrate student talent through music, dance, and stage events that build confidence beyond academics.',
  },
  placements: {
    label: 'Placements',
    titles: ['Placement Drive', 'Career Session', 'Recruiter Interaction'],
    text: 'Placement and career sessions connect students with hospital, industry, and community pharmacy pathways after graduation.',
  },
  convocation: {
    label: 'Convocation',
    titles: ['Graduation Day', 'Convocation Ceremony', 'Degree Celebration'],
    text: 'Convocation marks academic achievement — celebrating graduates who complete pharmacy programmes at G.P. COLLEGE.',
  },
}

function looksGeneric(title) {
  const t = String(title || '').trim()
  if (!t) return true
  return /^(campus(\s+photo)?(\s+\d+(\s+\d+)?)?|photo\s+\d+)$/i.test(t)
}

export function enrichGalleryItem(item, index = 0) {
  const story = STORIES[item.category] || STORIES.campus
  const pick = story.titles[index % story.titles.length]
  const title = item.title && !looksGeneric(item.title) ? item.title : pick
  return {
    ...item,
    title,
    categoryLabel: story.label,
    description: item.description || item.caption || item.summary || story.text,
  }
}

export function enrichGalleryList(list = []) {
  return list.map((item, i) => enrichGalleryItem(item, i))
}
