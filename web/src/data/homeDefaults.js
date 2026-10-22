/** Static homepage defaults matching index.html (CMS overlays when published). */

export const DEFAULT_HOME = {
  badge: 'PCI Approved, Counselling Code 889',
  title: 'G.P. COLLEGE',
  subtitle: 'Excellence in Pharmacy Education',
  announcement:
    'Counselling Code 889 · PCI (3030) · TN G.O (Ms) 460 & 464 · Affiliated to The Tamil Nadu Dr. M.G.R. Medical University',
  slides: [
    'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P-Pharmacy-College-home.jpg',
    'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P-Pharmacy-College-home2.jpg',
    'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College5.jpg',
  ],
  captions: [
    {
      title: 'Excellence in Pharmacy Education',
      subtitle: 'PCI Approved · TN Dr. M.G.R. Medical University · Counselling Code 889',
      primary: { to: '/admissions', label: 'Talk to Admin →' },
      secondary: { to: '/courses', label: 'Courses →' },
    },
    {
      title: 'Empowering Future Pharmacists',
      subtitle: 'Practical skills, proven pathways — labs, hospital exposure, and career guidance.',
      primary: { to: '/admissions', label: 'Talk to Admin →' },
      secondary: { to: '/contact', label: 'Contact →' },
    },
    {
      title: 'Practical Skills, Proven Pathways',
      subtitle: 'Visit the Jolarpet campus — tour labs, library and hostels · Code 889.',
      primary: { to: '/admissions', label: 'Talk to Admin →' },
      secondary: { to: '/gallery', label: 'Gallery →' },
    },
  ],
  homeAbout: {
    eyebrow: 'Our College',
    title: 'Quality Pharmacy Education',
    lead:
      'G.P. Pharmacy College is the first pharmacy college in Tirupattur and Vellore District (Est. 2019). Parents come for Counselling Code 889, PCI approval, and clear guidance on D.Pharm, B.Pharm, M.Pharm and Pharm-D.',
    badge: 'Est. 2019',
    image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/gp-pharma-home-right1.jpg',
    facts: [
      'First pharmacy college in Tirupattur & Vellore District',
      'Established 2019 · Counselling Code 889',
      'PCI Approved · TN Dr. M.G.R. Medical University',
    ],
    ctaPrimary: 'About the college',
    ctaSecondary: 'Talk to Admin',
  },
  attributes: {
    eyebrow: 'Why G.P.',
    title: 'Empowering lives through pharmacy education',
    lead: 'Clear approvals, clinical exposure, and campus support — not generic brochure lines.',
    items: [
      {
        id: 'pci',
        title: 'PCI Approved · ID 3030',
        desc: 'Pharmacy Council of India approval with public mandatory disclosure on intake and affiliation.',
      },
      {
        id: 'code',
        title: 'Counselling Code 889',
        desc: 'Use Code 889 in TN paramedical counselling. Talk to Admin for course and seat guidance.',
      },
      {
        id: 'pharmd',
        title: 'Pharm-D at GH Tirupattur',
        desc: 'Clinical training pathway linked with Government Hospital Tirupattur for hospital practice.',
      },
      {
        id: 'campus',
        title: 'Hostels, buses & AC library',
        desc: 'Separate boys and girls hostels, college buses around Jolarpet, and an AC central library.',
      },
    ],
  },
  stats: {
    eyebrow: 'At a glance',
    title: 'Pharmacy education that builds careers',
    lead: 'Clear approvals, structured programs and campus facilities for every learner.',
    items: [
      { id: 'code', value: '889', label: 'Counselling code' },
      { id: 'programs', value: '4', label: 'Programs offered' },
      { id: 'labs', value: '16', label: 'Laboratories' },
      { id: 'year', value: '2019', label: 'Established' },
    ],
  },
  campusShow: {
    eyebrow: 'On Campus',
    title: 'Labs · Library · Hostel',
    lead: 'Real spaces where pharmacy learning happens every day — open for campus visits.',
    items: [
      {
        id: 'lab',
        title: 'Lab',
        caption:
          'Hands-on pharmaceutical training in PCI-aligned labs — formulation, chemistry, pharmacology and practice skills for D.Pharm, B.Pharm, M.Pharm and Pharm-D.',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Pharmaceutics-lab.jpg',
      },
      {
        id: 'library',
        title: 'Library',
        caption:
          'Quiet study in an air-conditioned library with pharmacy texts, journals and digital resources for exams, projects and research.',
        image:
          'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.-Pharmacy-College-Library.jpg',
      },
      {
        id: 'hostel',
        title: 'Hostel',
        caption:
          'Separate boys and girls hostels with secure campus living — convenient for students from Tirupattur, Jolarpet and nearby districts.',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College28.jpg',
      },
    ],
  },
  programsShow: {
    eyebrow: 'Programs',
    title: 'Explore Our Popular Courses',
    lead: 'B.Pharm and D.Pharm first — plus PG paths that build on them.',
    ctaText: 'All courses',
    ctaHref: '/courses',
    items: [
      {
        id: 'bpharm',
        name: 'B.Pharm',
        duration: '4 years',
        blurb: 'Graduate pharmacist for hospital, industry & retail',
        href: '/courses#bpharm',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College22.jpg',
      },
      {
        id: 'dpharm',
        name: 'D.Pharm',
        duration: '2 years',
        blurb: 'Diploma pharmacist ready for retail & hospital support',
        href: '/courses#dpharm',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/Pharmaceutics-lab.jpg',
      },
      {
        id: 'mpharm',
        name: 'M.Pharm',
        duration: '2 years · PG',
        blurb: 'Pharmaceutics · Analysis · Regulatory Affairs',
        href: '/courses#mpharm',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College26.jpg',
      },
      {
        id: 'pharmd',
        name: 'Pharm-D',
        duration: '6 years',
        blurb: 'Clinical pharmacist path · hospital training at GH Tirupattur',
        href: '/courses#pharmd',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College10.jpg',
      },
    ],
  },
  people: {
    eyebrow: 'Our People',
    title: 'Meet the college',
    lead: 'Leadership and faculty parents can put a face to.',
    slots: [
      {
        id: 'chairman',
        name: 'Er. G. Ponnusamy',
        role: 'Chairman · GP Group',
        image: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-Chairman.jpg',
        href: '/about/management',
      },
      {
        id: 'principal',
        name: 'Prof. Dr. S. Thenmozhi',
        role: 'Principal · M.Pharm., Ph.D',
        image: '/images/about/about-principal.png',
        href: '/about/principal',
      },
      {
        id: 'fac-1',
        name: 'Dr. P. Harini',
        role: 'Professor · Pharmaceutics',
        image: '',
        href: '',
      },
      {
        id: 'fac-2',
        name: 'Dr. K. Anand',
        role: 'Assoc. Professor · Analysis',
        image: '',
        href: '',
      },
    ],
    moreLabel: 'Campus community',
    moreCaption: 'View gallery',
    moreImage: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College12.jpg',
    moreHref: '/gallery',
  },
  outcomes: {
    eyebrow: 'After GP',
    title: 'Pharmacy careers',
    lead: 'Career opportunities after pharmacy — industry, hospitals, higher studies, abroad pathways, and entrepreneurship.',
    linkText: 'Placements',
    linkHref: '/placements',
    items: [
      { id: 'hospital', label: 'Hospital', desc: 'Clinical & hospital pharmacy roles' },
      { id: 'industry', label: 'Industry', desc: 'Production, QA & regulatory paths' },
      { id: 'retail', label: 'Retail', desc: 'Community pharmacy & entrepreneurship' },
    ],
    groups: [
      {
        id: 'opportunities',
        title: 'Career Opportunities After Pharmacy',
        featured: true,
        topics: [
          'Pharmaceutical Industry',
          'Hospital Pharmacy',
          'Clinical Pharmacy',
          'Community Pharmacy',
          'Pharmacovigilance',
          'Clinical Research',
          'Quality Control (QC)',
          'Quality Assurance (QA)',
          'Regulatory Affairs',
          'Pharmaceutical Production',
          'Research & Development',
          'Drug Inspector',
          'Government Jobs',
          'Pharmaceutical Marketing',
          'Medical Representative',
          'Medical Writing',
          'Medical Coding',
          'Drug Safety',
        ],
      },
      {
        id: 'higher-studies',
        title: 'Higher Studies',
        topics: [
          'M.Pharm Opportunities',
          'Pharm.D Opportunities',
          'MBA & Healthcare Management',
          'Ph.D. & Research Careers',
        ],
      },
      {
        id: 'abroad',
        title: 'Career Opportunities Abroad',
        topics: [
          'USA Pharmacy Pathway',
          'UK Pharmacy Pathway',
          'Canada Pharmacy Pathway',
          'Australia Pharmacy Pathway',
        ],
      },
      {
        id: 'entrepreneurship',
        title: 'Entrepreneurship in Pharmacy',
        topics: ['Pharmacy Startup Opportunities'],
      },
      {
        id: 'guidance',
        title: 'Guidance & Growth',
        topics: [
          'Internships & Industrial Training',
          'Placement Opportunities',
          'Skill Development',
          'Career Roadmap',
          'Alumni Career Success',
          'Industry–Academia Opportunities',
          'Emerging Careers in Pharmacy',
          'Future of Pharmacy',
          'Career Guidance & Counselling',
        ],
      },
    ],
  },
  campusTour: {
    youtubeUrl: 'https://youtu.be/oIsIJ6LxVQc',
    lead: 'A quick look at labs, library and grounds — then visit Jolarpet in person.',
    fallbackImage:
      'https://gppharmacycollege.com/wp-content/uploads/2025/03/video-overlay-v3.jpg',
  },
  recruitersLabel: '',
  recruiters: [
    'Hospital Pharmacy',
    'Pharma Industry',
    'Community Retail',
    'Clinical Research',
    'Pharmacovigilance',
    'Regulatory Affairs',
    'Quality Control',
    'Medical Coding',
  ],
  approvals: [
    {
      id: 'code',
      title: '889',
      subtitle: 'Counselling Code',
      detail: 'TN paramedical admissions identity',
      href: '/admissions',
      linkLabel: 'Talk to Admin →',
      variant: 'code',
    },
    {
      id: 'pci',
      title: 'PCI',
      subtitle: 'Approved',
      detail: 'Pharmacy Council of India · ID 3030',
      href: '/mandatory-disclosure',
      linkLabel: 'View disclosure →',
    },
    {
      id: 'univ',
      title: 'TN Dr. M.G.R.',
      subtitle: 'University affiliation',
      detail: 'The Tamil Nadu Dr. M.G.R. Medical University',
      href: '/mandatory-disclosure',
      linkLabel: 'Affiliation details →',
    },
    {
      id: 'disclosure',
      title: 'Disclosure',
      subtitle: 'Mandatory public info',
      detail: 'Approvals, intake & institutional transparency',
      href: '/mandatory-disclosure',
      linkLabel: 'View →',
    },
  ],
}

export const SEED_NOTICES = [
  {
    id: 'admission-open',
    title: 'Counselling Code 889 — Admissions open',
    summary:
      'Talk to Admin for D.Pharm, B.Pharm, M.Pharm and Pharm-D guidance. No online application on this site.',
    category: 'admission',
    date: '2026-09-10',
    urgent: true,
    published: true,
    link: '/admissions',
  },
  {
    id: 'anti-ragging',
    title: 'Anti-ragging helplines',
    summary:
      'National Helpline 1800-180-5522 · helpline@antiragging.in · Emergency 112 · Women Helpline 181.',
    category: 'general',
    date: '2026-09-05',
    published: true,
    link: '/contact',
  },
  {
    id: 'hostel-transport',
    title: 'Hostel and college bus seats',
    summary:
      'Separate boys and girls hostels and college buses covering Jolarpet routes. Ask Admin for current seat availability.',
    category: 'general',
    date: '2026-09-01',
    published: true,
    link: '/contact',
  },
  {
    id: 'pci-approved',
    title: 'PCI approved · Code 889',
    summary:
      'PCI (3030). TN G.O (Ms) No. 460 & 464. Affiliated to The Tamil Nadu Dr. M.G.R. Medical University.',
    category: 'general',
    date: '2026-08-20',
    published: true,
    link: '/mandatory-disclosure',
  },
]

export const SEED_EVENTS = [
  {
    id: 'campus-visit',
    title: 'Visit Campus — Jolarpet',
    summary: 'Tour labs, library and hostels. Call +91 94434 37487 to schedule a visit.',
    date: '2026-09-25',
    category: 'academic',
    published: true,
  },
  {
    id: 'skills-lab',
    title: 'Clinical Skills Workshop',
    summary: 'Hands-on case discussions and dispensing practice for final-year pharmacy students.',
    date: '2026-10-08',
    category: 'workshop',
    published: true,
  },
  {
    id: 'pharmacy-week',
    title: 'Pharmacy Week Orientation',
    summary: 'Department showcases, guest talk, and student competitions on campus.',
    date: '2026-10-22',
    category: 'seminar',
    published: true,
  },
]
