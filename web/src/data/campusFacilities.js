/**
 * Campus facilities — nav mega menu + page sections
 * Brief explanations for each space on campus.
 */

const GP = 'https://gppharmacycollege.com/wp-content/uploads/2025/03'

export const CAMPUS_FACILITY_GROUPS = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    lead: 'The academic buildings where lectures, seminars, and college administration take place.',
    image: `${GP}/G.P.Pharmacy-College1.jpg`,
    items: [
      {
        id: 'college-building',
        label: 'College Building',
        summary:
          'Main academic block with classrooms, lab corridors, and common areas for pharmacy programmes.',
        image: `${GP}/G.P.Pharmacy-College1.jpg`,
      },
      {
        id: 'classrooms',
        label: 'Classrooms',
        summary:
          'Well-lit theory rooms sized for B.Pharm and D.Pharm batches, used for regular lectures.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
      {
        id: 'smart-classrooms',
        label: 'Smart Classrooms',
        summary:
          'Rooms with AV support for presentations, demos, and interactive teaching sessions.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
      {
        id: 'seminar-hall',
        label: 'Seminar Hall / Auditorium',
        summary:
          'Large hall for guest lectures, orientation, college events, and academic gatherings.',
        image: `${GP}/G.P.Pharmacy-College5.jpg`,
      },
      {
        id: 'admin-block',
        label: 'Administrative Block',
        summary:
          'Offices for admissions, fees, certificates, and day-to-day student services.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
    ],
  },
  {
    id: 'laboratories',
    title: 'Pharmacy Laboratories',
    lead: 'Hands-on labs where pharmacy theory is practised through experiments and training.',
    image: `${GP}/Pharmaceutics-lab.jpg`,
    items: [
      {
        id: 'pharmaceutics',
        label: 'Pharmaceutics Lab',
        summary: 'Students learn to prepare and evaluate basic dosage forms such as liquids and tablets.',
        image: `${GP}/Pharmaceutics-lab.jpg`,
      },
      {
        id: 'chemistry',
        label: 'Pharmaceutical Chemistry Lab',
        summary: 'Organic and medicinal chemistry practicals with standard glassware and safety practice.',
        image: `${GP}/pharm-chemistry-lab.jpg`,
      },
      {
        id: 'pharmacology',
        label: 'Pharmacology Lab',
        summary: 'Practical study of how drugs act on the body, using syllabus-linked experiments.',
        image: `${GP}/pharmacology-lab.jpg`,
      },
      {
        id: 'pharmacognosy',
        label: 'Pharmacognosy Lab',
        summary: 'Identification and study of medicinal plants, crude drugs, and natural products.',
        image: `${GP}/pharmacognosy-lab.jpg`,
      },
      {
        id: 'analysis',
        label: 'Pharmaceutical Analysis Lab',
        summary: 'Quality-control practice — assay, purity checks, and basic analytical methods.',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
      },
      {
        id: 'pharmacy-practice',
        label: 'Pharmacy Practice / Clinical Pharmacy Lab',
        summary: 'Dispensing skills, counselling practice, and clinical pharmacy problem-solving.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
      {
        id: 'computer',
        label: 'Computer Lab',
        summary: 'Shared computers for assignments, e-learning, and pharmacy-related software work.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
    ],
  },
  {
    id: 'library',
    title: 'Central Library',
    lead: 'A quiet place to study with pharmacy books, references, journals, and digital resources.',
    image: `${GP}/G.P.-Pharmacy-College-Library.jpg`,
    items: [
      {
        id: 'pharmacy-books',
        label: 'Pharmacy Books',
        summary: 'Core textbooks aligned with B.Pharm and D.Pharm subjects each semester.',
        image: `${GP}/G.P.-Pharmacy-College-Library.jpg`,
      },
      {
        id: 'reference-books',
        label: 'Reference Books',
        summary: 'Advanced titles for assignments, viva preparation, and deeper subject reading.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
      {
        id: 'journals',
        label: 'Journals',
        summary: 'Pharmacy periodicals for seminars, projects, and staying updated in the field.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
      {
        id: 'digital-resources',
        label: 'Digital Resources',
        summary: 'Online notes and e-resources available through campus systems where provided.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
      {
        id: 'reading-hall',
        label: 'Reading Hall',
        summary: 'Quiet seating area for focused study during free periods and exam time.',
        image: `${GP}/G.P.-Pharmacy-College-Library.jpg`,
      },
    ],
  },
  {
    id: 'hostel',
    title: 'Hostel',
    lead: 'Separate residential facilities with dining support for students living away from home.',
    image: `${GP}/G.P.Pharmacy-College28.jpg`,
    items: [
      {
        id: 'boys-hostel',
        label: 'Boys Hostel',
        summary: 'Accommodation for male students with warden support, close to the college.',
        image: `${GP}/G.P.Pharmacy-College28.jpg`,
      },
      {
        id: 'girls-hostel',
        label: 'Girls Hostel',
        summary: 'Separate hostel for women students with supervised residential arrangements.',
        image: `${GP}/G.P.Pharmacy-College28.jpg`,
      },
      {
        id: 'hostel-facilities',
        label: 'Hostel Facilities',
        summary: 'Basic residential amenities that support daily living and study routines.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
      {
        id: 'dining-mess',
        label: 'Dining / Mess',
        summary: 'Regular meals for hostel residents, timed around class and lab schedules.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
    ],
  },
  {
    id: 'transport',
    title: 'Transport',
    lead: 'College bus service connecting Jolarpet and nearby areas for daily commuting.',
    image: `${GP}/G.P.Pharmacy-College10.jpg`,
    items: [
      {
        id: 'college-bus',
        label: 'College Bus',
        summary: 'Institution buses that carry students on fixed routes to and from campus.',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
      },
      {
        id: 'routes',
        label: 'Routes',
        summary: 'Stops across Jolarpet and nearby towns — ask the office for the current list.',
        image: `${GP}/G.P.Pharmacy-College5.jpg`,
      },
      {
        id: 'transport-info',
        label: 'Transport Information',
        summary: 'Details on fees, timings, and seats are shared during admission counselling.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    lead: 'Basic medical support on campus, plus clinical training links for pharmacy practice.',
    image: `${GP}/G.P.Pharmacy-College12.jpg`,
    items: [
      {
        id: 'first-aid',
        label: 'First Aid',
        summary: 'Quick care for minor injuries or illness during college hours.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
      {
        id: 'medical-support',
        label: 'Medical Support',
        summary: 'Help arranging further care when a student needs attention beyond first aid.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
      {
        id: 'hospital-training',
        label: 'Hospital / Clinical Training Facilities',
        summary: 'Clinical exposure that connects classroom learning with hospital pharmacy practice.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
    ],
  },
  {
    id: 'sports',
    title: 'Sports & Recreation',
    lead: 'Indoor and outdoor games that help students stay active alongside academic work.',
    image: `${GP}/G.P.Pharmacy-College5.jpg`,
    items: [
      {
        id: 'indoor-games',
        label: 'Indoor Games',
        summary: 'Indoor recreation for short breaks between classes and after study hours.',
        image: `${GP}/G.P.Pharmacy-College5.jpg`,
      },
      {
        id: 'outdoor-games',
        label: 'Outdoor Games',
        summary: 'Open-air sports and games that encourage fitness and teamwork on campus.',
        image: `${GP}/G.P.Pharmacy-College1.jpg`,
      },
      {
        id: 'fitness',
        label: 'Fitness / Recreation',
        summary: 'Simple fitness and recreation options to balance long lab and lecture days.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
    ],
  },
  {
    id: 'amenities',
    title: 'Campus Facilities',
    lead: 'Everyday campus services — food, water, Wi-Fi, parking, power backup, and security.',
    image: `${GP}/G.P.Pharmacy-College22.jpg`,
    items: [
      {
        id: 'canteen',
        label: 'Canteen',
        summary: 'On-campus snacks and meals available during breaks between lectures and labs.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
      {
        id: 'drinking-water',
        label: 'Drinking Water',
        summary: 'Drinking water points placed across classrooms, labs, and common areas.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
      {
        id: 'wifi',
        label: 'Wi-Fi',
        summary: 'Campus internet for academic browsing, submissions, and digital study needs.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
      {
        id: 'parking',
        label: 'Parking',
        summary: 'Space for two-wheelers and visitors within the campus grounds.',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
      },
      {
        id: 'power-backup',
        label: 'Power Backup',
        summary: 'Backup power so classes, labs, and exams continue during electricity outages.',
        image: `${GP}/G.P.Pharmacy-College1.jpg`,
      },
      {
        id: 'cctv-security',
        label: 'CCTV & Security',
        summary: 'Campus CCTV and security presence for safer movement across the grounds.',
        image: `${GP}/G.P.Pharmacy-College28.jpg`,
      },
    ],
  },
]

/** Mega menu columns for header */
export const CAMPUS_MEGA_GROUPS = [
  {
    title: 'Infrastructure',
    items: [
      { to: '/campus#infrastructure', label: 'Infrastructure', id: 'campus-infrastructure' },
      ...CAMPUS_FACILITY_GROUPS[0].items.map((i) => ({
        to: `/campus#${i.id}`,
        label: i.label,
        id: `campus-${i.id}`,
      })),
    ],
  },
  {
    title: 'Labs & Library',
    items: [
      { to: '/campus#laboratories', label: 'Pharmacy Laboratories', id: 'campus-laboratories' },
      { to: '/campus#library', label: 'Central Library', id: 'campus-library' },
      { to: '/campus#pharmaceutics', label: 'Pharmaceutics Lab', id: 'campus-pharmaceutics' },
      { to: '/campus#chemistry', label: 'Pharmaceutical Chemistry Lab', id: 'campus-chemistry' },
      { to: '/campus#pharmacology', label: 'Pharmacology Lab', id: 'campus-pharmacology' },
      { to: '/campus#pharmacognosy', label: 'Pharmacognosy Lab', id: 'campus-pharmacognosy' },
      { to: '/campus#analysis', label: 'Pharmaceutical Analysis Lab', id: 'campus-analysis' },
    ],
  },
  {
    title: 'Hostel & Transport',
    items: [
      { to: '/campus#hostel', label: 'Hostel', id: 'campus-hostel' },
      { to: '/campus#boys-hostel', label: 'Boys Hostel', id: 'campus-boys-hostel' },
      { to: '/campus#girls-hostel', label: 'Girls Hostel', id: 'campus-girls-hostel' },
      { to: '/campus#transport', label: 'Transport', id: 'campus-transport' },
      { to: '/campus#college-bus', label: 'College Bus', id: 'campus-college-bus' },
      { to: '/campus#routes', label: 'Routes', id: 'campus-routes' },
    ],
  },
  {
    title: 'Life on Campus',
    items: [
      { to: '/campus#healthcare', label: 'Healthcare', id: 'campus-healthcare' },
      { to: '/campus#sports', label: 'Sports & Recreation', id: 'campus-sports' },
      { to: '/campus#amenities', label: 'Campus Facilities', id: 'campus-amenities' },
      { to: '/campus#canteen', label: 'Canteen', id: 'campus-canteen' },
      { to: '/campus#wifi', label: 'Wi-Fi', id: 'campus-wifi' },
      { to: '/campus#cctv-security', label: 'CCTV & Security', id: 'campus-cctv' },
    ],
  },
]

export const CAMPUS_FLAT = CAMPUS_MEGA_GROUPS.flatMap((g) => g.items)

export const CAMPUS_SUBNAV = [
  { to: '/campus#infrastructure', label: 'Infrastructure', id: 'infrastructure' },
  { to: '/campus#laboratories', label: 'Laboratories', id: 'laboratories' },
  { to: '/campus#library', label: 'Library', id: 'library' },
  { to: '/campus#hostel', label: 'Hostel', id: 'hostel' },
  { to: '/campus#transport', label: 'Transport', id: 'transport' },
  { to: '/campus#healthcare', label: 'Healthcare', id: 'healthcare' },
  { to: '/campus#sports', label: 'Sports', id: 'sports' },
  { to: '/campus#amenities', label: 'Facilities', id: 'amenities' },
]
