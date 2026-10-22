/**
 * About navigation — shared by header mega menu, mobile nav, and about subnav
 */

export const ABOUT_NAV = [
  { to: '/about', label: 'About G.P. Pharmacy College', id: 'about' },
  { to: '/about/management', label: 'Founder & Management', id: 'about-management' },
  { to: '/about/principal', label: "Principal's Message", id: 'about-principal' },
  { to: '/about#vision-mission', label: 'Vision & Mission', id: 'about-vm' },
  { to: '/about#college-profile', label: 'College Profile', id: 'about-profile' },
]

export const ABOUT_APPROVALS = [
  { to: '/mandatory-disclosure#pci', label: 'PCI', id: 'about-pci' },
  {
    to: '/mandatory-disclosure#university',
    label: 'University Affiliation',
    id: 'about-university',
  },
  {
    to: '/mandatory-disclosure#governing-body',
    label: 'Governing Body',
    id: 'about-governing',
  },
  {
    to: '/mandatory-disclosure',
    label: 'Mandatory Disclosures',
    id: 'about-disclosure',
  },
]

export const ABOUT_POLICIES = [
  { to: '/about/policies#anti-ragging', label: 'Anti-Ragging', id: 'policy-ragging' },
  { to: '/about/policies#grievance', label: 'Grievance Redressal', id: 'policy-grievance' },
  {
    to: '/about/policies#icc',
    label: 'Internal Complaints Committee',
    id: 'policy-icc',
  },
]

export const ABOUT_MEGA_GROUPS = [
  { title: 'About', items: ABOUT_NAV },
  { title: 'Approvals & Affiliations', items: ABOUT_APPROVALS },
  { title: 'Policies', items: ABOUT_POLICIES },
]

export const ABOUT_FLAT = [...ABOUT_NAV, ...ABOUT_APPROVALS, ...ABOUT_POLICIES]
