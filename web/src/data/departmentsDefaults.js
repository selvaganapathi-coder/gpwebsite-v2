/**
 * Departments data for DepartmentsPage
 */

const GP = 'https://gppharmacycollege.com/wp-content/uploads/2025/03'

export const DEPARTMENTS = [
  {
    id: 'pharmaceutics',
    title: 'Pharmaceutics',
    programs: [
      {
        name: 'M.Pharm — Pharmaceutics',
        image: `${GP}/Pharmaceutics-lab.jpg`,
        href: '/courses#mpharm-detail',
      },
      {
        name: 'B.Pharm — Formulation Lab',
        image: `${GP}/G.P.Pharmacy-College2.jpg`,
        href: '/campus#pharmaceutics',
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Pharmaceutical Analysis',
    programs: [
      {
        name: 'M.Pharm — Pharmaceutical Analysis',
        image: `${GP}/pharm-chemistry-lab.jpg`,
        href: '/courses#mpharm-detail',
      },
    ],
  },
  {
    id: 'regulatory',
    title: 'Pharmaceutical Regulatory Affairs',
    programs: [
      {
        name: 'M.Pharm — Regulatory Affairs',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
        href: '/courses#mpharm-detail',
      },
    ],
  },
  {
    id: 'chemistry',
    title: 'Pharmaceutical Chemistry',
    programs: [
      {
        name: 'Pharmaceutical Chemistry Lab',
        image: `${GP}/pharm-chemistry-lab.jpg`,
        href: '/campus#chemistry',
      },
    ],
  },
  {
    id: 'pharmacology',
    title: 'Pharmacology',
    programs: [
      {
        name: 'Pharmacology Laboratory',
        image: `${GP}/pharmacology-lab.jpg`,
        href: '/campus#pharmacology',
      },
    ],
  },
  {
    id: 'pharmacognosy',
    title: 'Pharmacognosy',
    programs: [
      {
        name: 'Pharmacognosy Laboratory',
        image: `${GP}/pharmacognosy-lab.jpg`,
        href: '/campus#pharmacognosy',
      },
    ],
  },
  {
    id: 'practice',
    title: 'Pharmacy Practice',
    programs: [
      {
        name: 'Pharm-D — Clinical Practice',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
        href: '/courses#pharmd-detail',
      },
      {
        name: 'Hospital Training',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
        href: '/campus#hospital-training',
      },
    ],
  },
]
