import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function resolveDirname() {
  try {
    if (typeof import.meta?.url === 'string' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    /* bundled CJS */
  }
  return path.join(process.cwd(), 'server');
}

const __dirname = resolveDirname();
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms.json');

const GP_ASSETS = 'https://gppharmacycollege.com/wp-content/uploads/2025/03';

export const DEFAULTS = {
  version: 1,
  updatedAt: null,
  users: [],
  site: {
    name: 'G.P. COLLEGE',
    tag: 'Tirupattur · Code 889',
    code: '889',
    logo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/GP-Logo-neww.png',
    logoMark: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/cropped-GP-Logo-32x32.png',
    phone: '+919443437487',
    phoneDisplay: '+91 94434 37487',
    phoneAlt: '+919578627535',
    phoneAltDisplay: '+91 95786 27535',
    email: 'gppharmacycollege@gmail.com',
    principalEmail: 'drthenmozhish@gmail.com',
    address: 'Vaniyambadi Main Road, Mandalavadi (Vill&Po), Jolarpet – 635851',
    whatsapp: '919443437487',
    pci: '3030',
    hours: 'Mon – Sat · 9:00 AM – 5:00 PM',
    goMs: '460 & 464',
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    seo: {
      title: 'G.P. COLLEGE | Pharmacy Education · Counselling Code 889',
      description:
        'PCI-approved pharmacy college in Tirupattur / Jolarpet. Counselling Code 889 — D.Pharm, B.Pharm, M.Pharm & Pharm-D. Talk to Admin.',
      ogImage: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/GP-Logo-neww.png',
    },
    social: {
      instagram: 'https://www.instagram.com/gppharmacycollege/',
      youtube: 'https://www.youtube.com/@gppharmacycollege',
      linkedin: 'https://www.linkedin.com/company/gp-pharmacy-college',
    },
    mapsPlaceUrl:
      'https://www.google.com/maps/place/GP+PHARMACY+COLLEGE/@12.612339,78.599926,17z',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7787.086099929674!2d78.599926!3d12.612339!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3badab4e2f3777b5%3A0xa2842979384d8d57!2sGP%20PHARMACY%20COLLEGE!5e0!3m2!1sen!2sin!4v1741348488285!5m2!1sen!2sin',
  },
  website: {
    homepage: {
      published: true,
      badge: 'PCI Approved · Counselling Code 889',
      title: 'G.P. COLLEGE',
      subtitle: 'Excellence in Pharmacy Education',
      slides: [
        `${GP_ASSETS}/G.P-Pharmacy-College-home.jpg`,
        `${GP_ASSETS}/G.P-Pharmacy-College-home2.jpg`,
        `${GP_ASSETS}/G.P.Pharmacy-College5.jpg`,
      ],
      announcement:
        'Counselling Code 889 · PCI (3030) · TN G.O (Ms) 460 & 464 · Affiliated to The Tamil Nadu Dr. M.G.R. Medical University',
      homeAbout: {
        eyebrow: 'Our College',
        title: 'Quality Pharmacy Education',
        badge: 'Est. 2019',
        image: `${GP_ASSETS}/G.P.Pharmacy-College26.jpg`,
        lead:
          'G.P. Pharmacy College is the first pharmacy college in Tirupattur and Vellore District (Est. 2019). Parents come for Counselling Code 889, PCI approval, and clear guidance on D.Pharm, B.Pharm, M.Pharm and Pharm-D.',
        facts: [
          'First pharmacy college in Tirupattur & Vellore District',
          'Established 2019 · Counselling Code 889',
          'PCI Approved · TN Dr. M.G.R. Medical University',
        ],
        ctaPrimary: 'About the college',
        ctaSecondary: 'Talk to Admin',
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
            image: `${GP_ASSETS}/Pharmaceutics-lab.jpg`,
          },
          {
            id: 'library',
            title: 'Library',
            caption:
              'Quiet study in an air-conditioned library with pharmacy texts, journals and digital resources for exams, projects and research.',
            image: `${GP_ASSETS}/G.P.-Pharmacy-College-Library.jpg`,
          },
          {
            id: 'hostel',
            title: 'Hostel',
            caption:
              'Separate boys and girls hostels with secure campus living — convenient for students from Tirupattur, Jolarpet and nearby districts.',
            image: `${GP_ASSETS}/G.P.Pharmacy-College28.jpg`,
          },
        ],
      },
      people: {
        eyebrow: 'Our People',
        title: 'Meet the college',
        lead: 'Leadership and faculty parents can put a face to.',
        slots: [
          { id: 'chairman', name: 'Er. G. Ponnusamy', role: 'Chairman · GP Group', image: `${GP_ASSETS}/G.P.Pharmacy-Chairman.jpg`, href: '/about/management' },
          { id: 'principal', name: 'Prof. Dr. S. Thenmozhi', role: 'Principal · M.Pharm., Ph.D', image: 'images/about/about-principal.png', href: '/about/principal' },
          { id: 'fac-1', name: 'Dr. P. Harini', role: 'Professor · Pharmaceutics', image: '', href: '' },
          { id: 'fac-2', name: 'Dr. K. Anand', role: 'Assoc. Professor · Analysis', image: '', href: '' },
        ],
        moreLabel: 'Campus community',
        moreCaption: 'View gallery',
        moreImage: `${GP_ASSETS}/G.P.Pharmacy-College12.jpg`,
        moreHref: '/gallery',
      },
      outcomes: {
        eyebrow: 'After GP',
        title: 'Pharmacy careers',
        items: [
          { id: 'hospital', label: 'Hospital', desc: 'Clinical & hospital pharmacy roles' },
          { id: 'industry', label: 'Industry', desc: 'Production, QA & regulatory paths' },
          { id: 'retail', label: 'Retail', desc: 'Community pharmacy & entrepreneurship' },
        ],
        linkText: 'Talk to Admin →',
        linkHref: '/contact',
      },
      campusTour: {
        youtubeUrl: 'https://youtu.be/oIsIJ6LxVQc',
        lead: 'A quick look at labs, library and grounds — then visit Jolarpet in person.',
        fallbackImage: `${GP_ASSETS}/G.P-Pharmacy-College-home.jpg`,
      },
      approvals: [
        { id: 'code', title: '889', subtitle: 'Counselling Code', href: '/admissions', linkLabel: 'Talk to Admin →', variant: 'code' },
        { id: 'pci', title: 'PCI', subtitle: 'Approved', href: '/mandatory-disclosure' },
        { id: 'univ', title: 'TN MGR', subtitle: 'University affiliation', href: '/mandatory-disclosure' },
        { id: 'disclosure', title: 'Disclosure', subtitle: 'Mandatory public info', href: '/mandatory-disclosure' },
      ],
    },
    about: {
      published: true,
      heroTitle: 'About Us',
      heroSubtitle: 'First pharmacy college in Tirupattur & Vellore District · Established 2019',
      discoverTitle: 'GP Group — Education for Every Community',
      discoverProse: [
        'Our Chairman Er. G. Ponnusamy, B.E., educationist, has provided quality education to middle-class and underserved communities since 1979 — starting with ITI, then Tirupattur Arts and Science College, GP Polytechnic, GP College of Education, and G.P. COLLEGE.',
        'G.P. COLLEGE, established in 2019, is the first pharmacy college in Tirupattur and the entire Vellore District. Affiliated to The Tamil Nadu Dr. M.G.R. Medical University and approved by PCI, we offer D.Pharm, B.Pharm, M.Pharm and Pharm-D with modern labs, digital classrooms, AC library, hostels, and strong career support.',
      ],
      discoverImage: `${GP_ASSETS}/gp-pharma-home-right1.jpg`,
      highlights: [
        { title: 'Experienced Faculty', desc: 'Real-world expertise and deep subject knowledge guiding every student.', image: `${GP_ASSETS}/G.P.Pharmacy-College22.jpg` },
        { title: 'Smart Classrooms', desc: 'Interactive digital tools for dynamic, engaging theory sessions.', image: `${GP_ASSETS}/G.P.Pharmacy-College4.jpg` },
        { title: 'Modern Laboratories', desc: 'Hands-on practical training with industry-standard equipment.', image: `${GP_ASSETS}/Pharmaceutics-lab.jpg` },
        { title: 'AC Library', desc: 'Air-conditioned library with vast resources for study and research.', image: `${GP_ASSETS}/G.P.-Pharmacy-College-Library.jpg` },
        { title: 'Separate Hostels', desc: 'Safe, comfortable hostel facilities for boys and girls.', image: `${GP_ASSETS}/G.P.Pharmacy-College28.jpg` },
        { title: 'Transport & Amenities', desc: 'Reliable college transport, purified water, and campus conveniences.', image: `${GP_ASSETS}/G.P.Pharmacy-College10.jpg` },
      ],
      leadership: [
        {
          name: 'Er. G. Ponnusamy',
          role: 'Chairman · GP Group of Institutions',
          image: `${GP_ASSETS}/G.P.Pharmacy-Chairman.jpg`,
          bio: 'Visionary educationist providing quality education since 1979 through ITI, arts & science, polytechnic, education and pharmacy colleges. His leadership established G.P. COLLEGE as the first pharmacy institution in Tirupattur and Vellore District.',
        },
        {
          name: 'Prof. Dr. S. Thenmozhi',
          role: 'Principal · G.P. COLLEGE',
          image: '/images/about/about-principal.png',
          bio: 'M.Pharm., Ph.D — Academic head responsible for institutional excellence and student outcomes.',
        },
      ],
    },
    courses: {
      published: true,
      heroTitle: 'Courses Offered',
      heroSubtitle: 'The Right Programs for You',
      programs: [
        {
          id: 'pharm-d',
          name: 'Pharm-D',
          duration: '6 years',
          intake: 30,
          published: true,
          summary:
            'Doctor of Pharmacy — patient-centered care, drug therapy management, and clinical training.',
          hospitalTieUp: {
            name: 'Government Headquarters Hospital (GH), Tirupattur',
            role: 'Hospital tie-up for Pharm-D students — clinical training and rotations',
          },
        },
        {
          id: 'bpharm',
          name: 'B.Pharm',
          duration: '4 years',
          intake: 100,
          published: true,
        },
        {
          id: 'dpharm',
          name: 'D.Pharm',
          duration: '2 years',
          intake: 60,
          published: true,
        },
        {
          id: 'mpharm',
          name: 'M.Pharm',
          duration: '2 years',
          intake: 45,
          published: true,
        },
      ],
    },
    faculty: {
      published: true,
      heroTitle: 'Faculty & Staff',
      heroSubtitle: 'Department-wise staff details — PCI-approved pharmacy education',
      members: [
        {
          id: 'fac-1',
          name: 'Prof. Dr. S. Thenmozhi',
          department: 'Administration',
          deptSlug: 'administration',
          qualification: 'M.Pharm., Ph.D',
          designation: 'Principal',
          published: true,
        },
        {
          id: 'fac-2',
          name: 'Dr. P. Harini',
          department: 'Pharmaceutics',
          deptSlug: 'pharmaceutics',
          qualification: 'M.Pharm., Ph.D',
          designation: 'Professor',
          published: true,
        },
        {
          id: 'fac-3',
          name: 'Dr. K. Anand',
          department: 'Pharmaceutical Analysis',
          deptSlug: 'analysis',
          qualification: 'M.Pharm., Ph.D',
          designation: 'Associate Professor',
          published: true,
        },
        {
          id: 'fac-4',
          name: 'Regulatory Affairs Faculty',
          department: 'Pharmaceutical Regulatory Affairs',
          deptSlug: 'regulatory',
          qualification: 'M.Pharm',
          designation: 'Professor',
          published: true,
        },
        {
          id: 'fac-5',
          name: 'Pharmaceutical Chemistry Faculty',
          department: 'Pharmaceutical Chemistry',
          deptSlug: 'chemistry',
          qualification: 'B.Pharm / D.Pharm',
          designation: 'Faculty',
          published: true,
        },
        {
          id: 'fac-6',
          name: 'Pharmacology Faculty',
          department: 'Pharmacology',
          deptSlug: 'pharmacology',
          qualification: 'B.Pharm / D.Pharm',
          designation: 'Faculty',
          published: true,
        },
      ],
    },
    contact: {
      published: true,
      heroTitle: 'Contact Us',
      heroSubtitle: 'Talk to Admin · Counselling Code 889 · Jolarpet campus',
      address:
        'Vaniyambadi Main Road, Mandalavadi (Vill&Po), Jolarpet-635851, Tirupattur Taluk & District, TN',
      principal: 'Prof. Dr. S. Thenmozhi, M.Pharm., Ph.D',
      principalEmail: 'drthenmozhish@gmail.com',
      phones: [
        { display: '+91 94434 37487', tel: '+919443437487' },
        { display: '+91 95786 27535', tel: '+919578627535' },
        { display: '+91 94432 29324', tel: '+919443229324' },
        { display: '+91 63857 59996', tel: '+916385759996' },
        { display: '04179 299723', tel: '04179299723' },
      ],
      email: 'gppharmacycollege@gmail.com',
      hours: 'Mon – Sat · 9:00 AM – 5:00 PM',
    },
    campus: {
      published: true,
      heroTitle: 'Digital Campus',
      heroSubtitle: 'World-class infrastructure for pharmacy education',
      labsIntro:
        'G.P. Pharmacy College has 16 laboratories in total — equipped for pharmaceutics, chemistry, analysis, pharmacology, practice training, and allied skills.',
      labs: [
        {
          id: 'pharmaceutics',
          index: '01',
          title: 'Pharmaceutics Lab',
          image: `${GP_ASSETS}/Pharmaceutics-lab.jpg`,
          body: 'Formulation practice for aromatic waters, syrups, liniments, lozenges, and community dispensing skills.',
          focus: ['Formulation', 'Dispensing'],
        },
        {
          id: 'chemistry',
          index: '02',
          title: 'Pharmaceutical Chemistry Lab',
          image: `${GP_ASSETS}/pharm-chemistry-lab.jpg`,
          body: 'Medicinal and organic chemistry experiments with synthesis and structural elucidation practice.',
          focus: ['Synthesis', 'Organic chemistry'],
        },
        {
          id: 'pharmacology',
          index: '03',
          title: 'Pharmacology Lab',
          image: `${GP_ASSETS}/pharmacology-lab.jpg`,
          body: 'Drug-action studies using Rota Rod, analgesiometer, electro-convulsiometer, and related apparatus.',
          focus: ['Drug action', 'Screening tools'],
        },
        {
          id: 'pharmacognosy',
          index: '04',
          title: 'Pharmacognosy Lab',
          image: `${GP_ASSETS}/pharmacognosy-lab.jpg`,
          body: 'Study of medicinal substances of biological origin with Soxhlet, LAF, UV cabinet, and balances.',
          focus: ['Herbal drugs', 'Extraction'],
        },
        {
          id: 'analysis',
          index: '05',
          title: 'Pharmaceutical Analysis Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College10.jpg`,
          body: 'Quality control and analytical method practice for assay, purity, and pharmaceutical standards.',
          focus: ['QC', 'Assay methods'],
        },
        {
          id: 'physical-pharmaceutics',
          index: '06',
          title: 'Physical Pharmaceutics Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College2.jpg`,
          body: 'Physicochemical properties of drugs and dosage forms — solubility, rheology, and stability basics.',
          focus: ['Physical pharmacy', 'Stability'],
        },
        {
          id: 'machine-room',
          index: '07',
          title: 'Machine Room / Industrial Pharmacy',
          image: `${GP_ASSETS}/G.P.Pharmacy-College4.jpg`,
          body: 'Hands-on exposure to tablet, capsule, and other small-scale manufacturing equipment.',
          focus: ['Tableting', 'Scale-up basics'],
        },
        {
          id: 'microbiology',
          index: '08',
          title: 'Microbiology Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College17.jpg`,
          body: 'Aseptic technique, culture handling, and pharmaceutical microbiology practicals.',
          focus: ['Aseptic work', 'Cultures'],
        },
        {
          id: 'biochemistry',
          index: '09',
          title: 'Biochemistry Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College12.jpg`,
          body: 'Biochemical estimations and clinical chemistry foundations for pharmacy curricula.',
          focus: ['Biochemical tests', 'Clinical basics'],
        },
        {
          id: 'hap',
          index: '10',
          title: 'Human Anatomy & Physiology Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College20.jpg`,
          body: 'Charts, models, and skeleton-based learning of body systems supporting pharmacology.',
          focus: ['Models', 'Physiology'],
        },
        {
          id: 'pharmacy-practice',
          index: '11',
          title: 'Pharmacy Practice / Model Pharmacy',
          image: `${GP_ASSETS}/G.P.Pharmacy-College5-1.jpg`,
          body: 'Counselling, prescription handling, and hospital-oriented practice simulations.',
          focus: ['Counselling', 'Prescriptions'],
        },
        {
          id: 'instrument-room',
          index: '12',
          title: 'Central Instrument Room',
          image: `${GP_ASSETS}/G.P.Pharmacy-College14.jpg`,
          body: 'Shared advanced instruments supporting analysis, research projects, and PG practicals.',
          focus: ['Instruments', 'PG support'],
        },
        {
          id: 'computer',
          index: '13',
          title: 'Computer Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College22.jpg`,
          body: 'Pharmacy software, literature search, and digital learning for students and faculty.',
          focus: ['Software', 'e-Learning'],
        },
        {
          id: 'language',
          index: '14',
          title: 'Language Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College23.jpg`,
          body: 'Communication skills for patient counselling, seminars, and professional presentations.',
          focus: ['Communication', 'Soft skills'],
        },
        {
          id: 'biotech',
          index: '15',
          title: 'Biotechnology Lab',
          image: `${GP_ASSETS}/G.P.Pharmacy-College26.jpg`,
          body: 'Introductory biotech and molecular concepts relevant to modern pharmacy education.',
          focus: ['Biotech basics', 'Molecular tools'],
        },
        {
          id: 'medicinal-chemistry',
          index: '16',
          title: 'Medicinal Chemistry Lab',
          image: `${GP_ASSETS}/Pharmaceutics-lab.jpg`,
          body: 'Drug molecule synthesis pathways and structure–activity understanding for pharmacy students.',
          focus: ['Drug design', 'Synthesis'],
        }
      ],
      facilities: [
        { title: 'Smart Classrooms', desc: 'Interactive digital tools for dynamic, engaging lectures.', image: `${GP_ASSETS}/G.P.Pharmacy-College26.jpg` },
        { title: 'AC Central Library', desc: 'Vast collection of pharmacy texts, journals, and research material.', image: `${GP_ASSETS}/G.P.Pharmacy-College1.jpg` },
        { title: 'Separate Hostels', desc: 'Secure, comfortable boys & girls hostel facilities.', image: `${GP_ASSETS}/G.P.Pharmacy-College28.jpg` },
        { title: 'College Transport', desc: 'Safe, reliable buses covering Jolarpet and surrounding areas.', image: `${GP_ASSETS}/G.P.Pharmacy-College10.jpg` },
        { title: 'Computer Center', desc: 'Modern systems with pharmacy software and internet access.', image: `${GP_ASSETS}/G.P.Pharmacy-College22.jpg` },
        { title: 'Seminar Halls', desc: 'Spacious halls for conferences, workshops, and guest lectures.', image: `${GP_ASSETS}/G.P.Pharmacy-College12.jpg` },
      ],
    },
  },
  admissions: {
    published: true,
    heroTitle: 'Talk to Admin',
    heroSubtitle: 'Call or WhatsApp for Code 889 guidance — no online application on this site',
    fee: 500,
    counsellingCode: '889',
  },
  notices: [
    {
      id: 'notice-1',
      title: 'Counselling Code 889 — Admissions open',
      summary: 'Talk to Admin for D.Pharm, B.Pharm, M.Pharm and Pharm-D guidance.',
      date: '2026-09-10',
      category: 'admission',
      urgent: true,
      published: true,
      link: '/admissions',
    },
    {
      id: 'notice-2',
      title: 'Anti-ragging helplines',
      summary:
        'National Helpline 1800-180-5522 · helpline@antiragging.in · Emergency 112 · Women Helpline 181.',
      date: '2026-09-05',
      category: 'general',
      published: true,
      link: '/contact',
    },
    {
      id: 'notice-3',
      title: 'Hostel and college bus seats',
      summary:
        'Separate boys and girls hostels and college buses covering Jolarpet routes. Ask Admin for current seat availability.',
      date: '2026-09-01',
      category: 'general',
      published: true,
      link: '/campus',
    },
    {
      id: 'notice-4',
      title: 'PCI approved · Code 889',
      summary:
        'PCI (3030). TN G.O (Ms) No. 460 & 464. Affiliated to The Tamil Nadu Dr. M.G.R. Medical University.',
      date: '2026-08-20',
      category: 'general',
      published: true,
      link: '/mandatory-disclosure',
    },
  ],
  events: [
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
  ],
  news: [
    {
      id: 'news-1',
      title: 'Admissions guidance for Counselling Code 889',
      excerpt:
        'Parents and students can talk to Admin for D.Pharm, B.Pharm, M.Pharm and Pharm-D programme guidance on the Jolarpet campus.',
      date: '2026-09-12',
      published: true,
      image: `${GP_ASSETS}/G.P-Pharmacy-College-home.jpg`,
    },
    {
      id: 'news-2',
      title: 'Campus labs ready for practical training',
      excerpt:
        'Pharmaceutics, chemistry, pharmacology and pharmacognosy labs support hands-on pharmacy education aligned to PCI standards.',
      date: '2026-09-05',
      published: true,
      image: `${GP_ASSETS}/Pharmaceutics-lab.jpg`,
    },
  ],
  placements: {
    published: true,
    heroTitle: 'Placement Portal',
    stats: [
      { label: 'Counselling Code', value: '889' },
      { label: 'Career Guidance', value: 'PDF' },
      { label: 'Office', value: '94434 37487' },
      { label: 'Established', value: '2019' },
    ],
    openings: [],
    recruiters: [],
    placedBatches: [],
  },
  research: {
    published: true,
    heroTitle: 'Research & Innovation',
    heroSubtitle:
      'Advancing pharmaceutical sciences through discovery, collaboration & industry partnerships',
    stats: [
      { label: 'Departments', value: 'Core labs' },
      { label: 'Programs', value: 'UG · PG · Pharm-D' },
      { label: 'Approvals', value: 'PCI' },
      { label: 'Affiliation', value: 'TN MGR' },
    ],
    publications: [
      {
        year: '2025',
        title: 'Development of sustained-release matrix tablets for antihypertensive agents',
        meta: 'International Journal of Pharmacy & Pharmaceutical Sciences · Dr. S. Thenmozhi et al.',
      },
      {
        year: '2025',
        title: 'RP-HPLC method for simultaneous estimation of fixed-dose combinations',
        meta: 'Asian Journal of Pharmaceutical Analysis · Pharmaceutical Analysis Dept.',
      },
      {
        year: '2024',
        title: 'Regulatory pathways for biosimilars in India: A comprehensive review',
        meta: 'Journal of Pharmaceutical Regulatory Affairs · Regulatory Affairs Dept.',
      },
      {
        year: '2024',
        title: 'Phytochemical screening and antimicrobial activity of medicinal plants',
        meta: 'Research Journal of Pharmacy & Technology · Pharmacognosy Lab',
      },
    ],
    projects: [
      {
        eyebrow: 'Ongoing',
        title: 'Novel Drug Delivery Systems',
        desc: 'Development of lipid-based nanoparticles for poorly soluble drugs.',
        tag: 'M.Pharm',
      },
      {
        eyebrow: 'Completed',
        title: 'Phytopharmaceutical Standardization',
        desc: 'Quality markers and standardization of traditional medicinal formulations.',
        tag: '2024',
      },
      {
        eyebrow: 'Ongoing',
        title: 'Bioanalytical Method Development',
        desc: 'LC-MS/MS methods for therapeutic drug monitoring in clinical samples.',
        tag: 'Analysis',
      },
    ],
  },
  achievements: [],
  gallery: [],
  enquiries: [],
  media: [],
  activityLog: [],
  cmsDraft: null,
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeDefaults(current) {
  if (!current.users?.length) current.users = [];
  if (!current.site) current.site = clone(DEFAULTS.site);
  else {
    for (const key of Object.keys(DEFAULTS.site)) {
      if (current.site[key] === undefined || current.site[key] === null) {
        current.site[key] = clone(DEFAULTS.site[key]);
      }
    }
  }
  if (!current.website) current.website = clone(DEFAULTS.website);
  if (!current.website.contact) current.website.contact = clone(DEFAULTS.website.contact);
  if (!current.website.campus) current.website.campus = clone(DEFAULTS.website.campus);
  else if (!current.website.campus.facilities) {
    current.website.campus.facilities = clone(DEFAULTS.website.campus.facilities);
  }
  if (!current.website.campus.labs?.length || current.website.campus.labs.length < 16) {
    current.website.campus.labs = clone(DEFAULTS.website.campus.labs);
  }
  if (!current.website.campus.labsIntro || /four dedicated labs/i.test(current.website.campus.labsIntro)) {
    current.website.campus.labsIntro = DEFAULTS.website.campus.labsIntro;
  }
  if (!current.website.about) current.website.about = clone(DEFAULTS.website.about);
  else {
    for (const key of Object.keys(DEFAULTS.website.about)) {
      if (current.website.about[key] === undefined || current.website.about[key] === null) {
        current.website.about[key] = clone(DEFAULTS.website.about[key]);
      }
    }
    if (!current.website.about.highlights?.length) {
      current.website.about.highlights = clone(DEFAULTS.website.about.highlights);
    }
    if (!current.website.about.leadership?.length) {
      current.website.about.leadership = clone(DEFAULTS.website.about.leadership);
    }
    if (!current.website.about.discoverProse?.length) {
      current.website.about.discoverProse = clone(DEFAULTS.website.about.discoverProse);
    }
  }
  if (!current.website.faculty) current.website.faculty = clone(DEFAULTS.website.faculty);
  else {
    if (!current.website.faculty.heroTitle) {
      current.website.faculty.heroTitle = DEFAULTS.website.faculty.heroTitle;
    }
    if (!current.website.faculty.heroSubtitle) {
      current.website.faculty.heroSubtitle = DEFAULTS.website.faculty.heroSubtitle;
    }
    if (!current.website.faculty.members?.length) {
      current.website.faculty.members = clone(DEFAULTS.website.faculty.members);
    }
  }
  if (!current.website.courses) current.website.courses = clone(DEFAULTS.website.courses);
  else if (!current.website.courses.programs?.length) {
    current.website.courses.programs = clone(DEFAULTS.website.courses.programs);
  }
  if (!current.admissions) current.admissions = clone(DEFAULTS.admissions);
  if (!current.placements) current.placements = clone(DEFAULTS.placements);
  else {
    for (const key of Object.keys(DEFAULTS.placements)) {
      if (current.placements[key] === undefined || current.placements[key] === null) {
        current.placements[key] = clone(DEFAULTS.placements[key]);
      }
    }
  }
  if (!Array.isArray(current.enquiries)) current.enquiries = [];
  if (!Array.isArray(current.media)) current.media = [];
  if (!Array.isArray(current.activityLog)) current.activityLog = [];
  if (current.cmsDraft === undefined) current.cmsDraft = null;
  if (!current.site.seo) current.site.seo = clone(DEFAULTS.site.seo);
  if (!current.site.hours) current.site.hours = DEFAULTS.site.hours;
  if (!current.site.goMs) current.site.goMs = DEFAULTS.site.goMs;
  if (!current.site.university) current.site.university = DEFAULTS.site.university;
  if (!current.research) current.research = clone(DEFAULTS.research);
  else {
    for (const key of Object.keys(DEFAULTS.research)) {
      if (current.research[key] === undefined || current.research[key] === null) {
        current.research[key] = clone(DEFAULTS.research[key]);
      }
    }
    if (!current.research.publications?.length) {
      current.research.publications = clone(DEFAULTS.research.publications);
    }
    if (!current.research.projects?.length) {
      current.research.projects = clone(DEFAULTS.research.projects);
    }
  }
  if (!Array.isArray(current.notices)) current.notices = [];
  if (!Array.isArray(current.events)) current.events = [];
  if (!Array.isArray(current.news)) current.news = [];
  if (!current.news.length) current.news = clone(DEFAULTS.news);
  if (!Array.isArray(current.achievements)) current.achievements = [];
  if (!Array.isArray(current.gallery)) current.gallery = [];
  if (!current.notices.length) current.notices = clone(DEFAULTS.notices);
  if (!current.events.length) current.events = clone(DEFAULTS.events);
  if (!current.website.contact) current.website.contact = clone(DEFAULTS.website.contact);
  if (!current.website.campus) current.website.campus = clone(DEFAULTS.website.campus);
  const hp = current.website?.homepage;
  const defHp = DEFAULTS.website.homepage;
  if (hp && defHp) {
    for (const key of Object.keys(defHp)) {
      if (hp[key] === undefined || hp[key] === null) hp[key] = clone(defHp[key]);
    }
  }
  return current;
}

export function loadStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial = mergeDefaults(clone(DEFAULTS));
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  return mergeDefaults(parsed);
}

export function saveStore(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return data;
}

function isLambda() {
  return Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
}

let memoryStore = null

/**
 * Copy default keys that are missing entirely. Existing values — including
 * empty arrays and empty strings — stay as stored. Used for MongoDB so a
 * later read cannot put deleted notices, labs, or news back.
 */
export function fillMissing(current, defaults) {
  if (current === undefined) return clone(defaults)
  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    return current === undefined ? clone(defaults) : current
  }
  if (!current || typeof current !== 'object' || Array.isArray(current)) return current
  const out = { ...current }
  for (const key of Object.keys(defaults)) {
    if (out[key] === undefined) out[key] = clone(defaults[key])
    else out[key] = fillMissing(out[key], defaults[key])
  }
  return out
}

/** Safe message for API clients. Connection strings stay in the server log. */
export function storageErrorMessage(err) {
  const message = String(err?.message || '')
  if (/MONGODB_URI is missing/.test(message)) return message
  if (/JWT_SECRET/.test(message)) return message
  if (/mongodb(\+srv)?:\/\//i.test(message) || /authentication failed/i.test(message)) {
    return 'Database connection failed. Check MONGODB_URI (user, password, and database) on the API host.'
  }
  if (/ENOTFOUND|ECONNREFUSED|timed out|server selection|MongoServerSelection|MongoNetwork|MongoParse/i.test(message)) {
    return 'Database connection failed. Check MONGODB_URI and Atlas Network Access (allow 0.0.0.0/0 so Vercel can connect). A paused free cluster can take a few seconds to wake.'
  }
  return 'Could not read or save CMS data.'
}

function createEmptyStore() {
  const initial = mergeDefaults(clone(DEFAULTS))
  initial.updatedAt = new Date().toISOString()
  return initial
}

/**
 * Async load via storage driver (json | blobs | mongodb | memory).
 * MongoDB reads the live document every call. Missing keys are filled in
 * memory only — this function does not write back.
 */
export async function loadStoreAsync() {
  const { storageLoad, describeStorage, getStorageMode } = await import('./storage/index.js')
  const mode = getStorageMode()
  try {
    const raw = await storageLoad(createEmptyStore)
    memoryStore = mode === 'mongodb' ? fillMissing(raw, DEFAULTS) : mergeDefaults(raw)
    if (process.env.CMS_STORAGE_LOG === '1') {
      console.log(`[cms] storage=${mode} → ${describeStorage()}`)
    }
    return memoryStore
  } catch (err) {
    console.error('[cms] storage load failed:', err?.message || err)
    if (mode === 'mongodb') throw err
    if (memoryStore) return memoryStore
    if (!isLambda()) {
      try {
        memoryStore = loadStore()
        return memoryStore
      } catch (fsErr) {
        console.warn('[cms] filesystem fallback failed:', fsErr?.message || fsErr)
      }
    }
    memoryStore = createEmptyStore()
    return memoryStore
  }
}

/**
 * Async save via the same storage driver.
 * MongoDB failures throw so the API can return 500 instead of pretending the edit was stored.
 */
export async function saveStoreAsync(data) {
  data.updatedAt = new Date().toISOString()
  const { storageSave, getStorageMode } = await import('./storage/index.js')
  const mode = getStorageMode()
  try {
    await storageSave(data)
    memoryStore = data
    return data
  } catch (err) {
    console.error('[cms] storage save failed:', err?.message || err)
    if (mode === 'mongodb') throw err
    if (!isLambda() && mode !== 'memory') {
      try {
        const saved = saveStore(data)
        memoryStore = saved
        return saved
      } catch (fsErr) {
        console.warn('[cms] filesystem save failed:', fsErr?.message || fsErr)
      }
    }
    if (mode === 'memory') {
      memoryStore = data
      return data
    }
    throw err
  }
}

export function getPublicContent(data) {
  const copy = clone(data);
  delete copy.users;
  delete copy.enquiries;
  delete copy.activityLog;
  delete copy.cmsDraft;
  copy.notices = (copy.notices || []).filter((item) => item.published !== false);
  copy.events = (copy.events || []).filter((item) => item.published !== false);
  copy.news = (copy.news || []).filter((item) => item.published !== false);
  copy.achievements = (copy.achievements || []).filter((item) => item.published !== false);
  copy.gallery = (copy.gallery || []).filter((item) => item.published !== false);
  copy.media = (copy.media || []).filter((item) => item.published !== false);
  return copy;
}

export function appendActivity(store, entry) {
  const log = Array.isArray(store.activityLog) ? store.activityLog : [];
  log.unshift({
    id: `log-${Date.now()}`,
    at: new Date().toISOString(),
    ...entry,
  });
  store.activityLog = log.slice(0, 100);
  return store;
}
