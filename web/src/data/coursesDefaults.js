/**
 * Courses / programmes data for CoursesPage
 */

const GP = 'https://gppharmacycollege.com/wp-content/uploads/2025/03'

export const UG_PROGRAMMES = [
  {
    id: 'bpharm',
    title: 'B.Pharm',
    meta: '4 years · Intake 100',
    image: `${GP}/G.P.Pharmacy-College22.jpg`,
    href: '/courses#bpharm-detail',
  },
  {
    id: 'dpharm',
    title: 'D.Pharm',
    meta: '2 years · Intake 60',
    image: `${GP}/Pharmaceutics-lab.jpg`,
    href: '/courses#dpharm-detail',
  },
  {
    id: 'pharmd',
    title: 'Pharm-D',
    meta: '6 years · Intake 30',
    image: `${GP}/G.P.Pharmacy-College10.jpg`,
    href: '/courses#pharmd-detail',
  },
  {
    id: 'bpharm-lateral',
    title: 'B.Pharm Lateral Entry',
    meta: '3 years · Direct 2nd year',
    image: `${GP}/G.P.Pharmacy-College4.jpg`,
    href: '/courses#lateral-detail',
  },
]

export const PG_PROGRAMMES = [
  {
    id: 'mpharm-pharmaceutics',
    title: 'M.Pharm — Pharmaceutics',
    meta: '2 years · Intake 15',
    image: `${GP}/Pharmaceutics-lab.jpg`,
    href: '/courses#mpharm-detail',
  },
  {
    id: 'mpharm-analysis',
    title: 'M.Pharm — Pharmaceutical Analysis',
    meta: '2 years · Intake 15',
    image: `${GP}/G.P.Pharmacy-College26.jpg`,
    href: '/courses#mpharm-detail',
  },
  {
    id: 'mpharm-regulatory',
    title: 'M.Pharm — Regulatory Affairs',
    meta: '2 years · Intake 15',
    image: `${GP}/G.P.Pharmacy-College4.jpg`,
    href: '/courses#mpharm-detail',
  },
]

export const COURSE_DETAILS = [
  {
    id: 'pharmd-detail',
    label: 'Doctorate Program',
    title: 'Pharm-D',
    meta: 'Duration: 6 years · Intake: 30',
    image: `${GP}/G.P.Pharmacy-College2.jpg`,
    flip: false,
    body: 'The Pharm-D (Doctor of Pharmacy) is a 6-year professional degree that prepares students for clinical pharmacy — patient-centred care, drug therapy management, and public health. Classroom learning is combined with clinical experience. Graduates focus on optimising medication and improving patient outcomes.',
    note: 'Full Scholarship Opportunities for SC/ST Students',
    hospital:
      'Government Headquarters Hospital (GH), Tirupattur — clinical training hospital for Pharm-D students.',
  },
  {
    id: 'bpharm-detail',
    label: 'Undergraduate Program',
    title: 'B.Pharm',
    meta: 'Duration: 4 years · Intake: 100',
    image: `${GP}/G.P.Pharmacy-College4.jpg`,
    flip: true,
    body: 'Bachelor of Pharmacy is an undergraduate degree for students who want a career in pharmacy after class 12. Graduates can practise as pharmacists in hospitals, community pharmacies, and industries related to prescription, manufacture, and provision of medicines.',
  },
  {
    id: 'dpharm-detail',
    label: 'Diploma Program',
    title: 'D.Pharm',
    meta: 'Duration: 2 years · Intake: 60',
    image: `${GP}/G.P.Pharmacy-College7.jpg`,
    flip: false,
    body: 'D.Pharm is a 2-year diploma for aspirants who wish to study pharmacy and work under a licensed pharmacist in hospitals, community pharmacies, and related pharmaceutical fields.',
  },
  {
    id: 'mpharm-detail',
    label: 'Postgraduate Program',
    title: 'M.Pharm',
    meta: 'Duration: 2 years',
    image: `${GP}/Pharmaceutics-lab.jpg`,
    flip: true,
    body: 'M.Pharm specialisations in Pharmaceutics, Pharmaceutical Analysis, and Regulatory Affairs provide advanced training for industry, research, and regulatory careers.',
    list: [
      'Pharmaceutics — Intake: 15',
      'Pharmaceutical Analysis — Intake: 15',
      'Pharmaceutical Regulatory Affairs — Intake: 15',
    ],
  },
  {
    id: 'lateral-detail',
    label: 'Lateral Entry',
    title: 'B.Pharm (Direct Second Year)',
    meta: 'Duration: 3 years',
    image: `${GP}/G.P.Pharmacy-College22.jpg`,
    flip: false,
    body: 'Candidates who have completed Diploma in Pharmacy can join the second year of B.Pharm through lateral entry — a direct path to advance within the pharmaceutical field.',
    eligibility: true,
  },
]
