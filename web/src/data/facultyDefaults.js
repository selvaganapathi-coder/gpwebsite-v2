/** Default department-wise staff (no mobile numbers). */
export const DEFAULT_FACULTY = {
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
}

const DEPT_ORDER = [
  'administration',
  'pharmaceutics',
  'analysis',
  'regulatory',
  'chemistry',
  'pharmacology',
  'pharmacognosy',
  'pharmacy-practice',
]

function parseRole(role = '') {
  const text = String(role).trim()
  if (!text) return { qualification: '', designation: '' }
  const parts = text.split(/\s*[—–-]\s*/)
  if (parts.length >= 2) {
    return {
      qualification: parts[0].trim(),
      designation: parts.slice(1).join(' — ').trim(),
    }
  }
  return { qualification: text, designation: '' }
}

function slugifyDept(dept = '') {
  return String(dept)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function normalizeFacultyMember(raw = {}, index = 0) {
  const fromRole = parseRole(raw.role)
  const department = (raw.department || raw.dept || '').trim()
  const qualification = (raw.qualification || fromRole.qualification || '').trim()
  const designation = (raw.designation || fromRole.designation || '').trim()
  const deptSlug = (raw.deptSlug || slugifyDept(department)).trim()

  return {
    id: raw.id || `fac-${index + 1}`,
    name: (raw.name || '').trim(),
    department,
    deptSlug,
    qualification,
    designation,
    role:
      (raw.role || '').trim() ||
      [qualification, designation].filter(Boolean).join(' — '),
    image: raw.image || '',
    bio: raw.bio || '',
    published: raw.published !== false,
  }
}

export function sortFacultyMembers(members) {
  return [...members].sort((a, b) => {
    const ai = DEPT_ORDER.indexOf(a.deptSlug)
    const bi = DEPT_ORDER.indexOf(b.deptSlug)
    const aOrder = ai === -1 ? 99 : ai
    const bOrder = bi === -1 ? 99 : bi
    if (aOrder !== bOrder) return aOrder - bOrder
    const deptCmp = a.department.localeCompare(b.department)
    if (deptCmp) return deptCmp
    return a.name.localeCompare(b.name)
  })
}

export function mergeFaculty(cmsFaculty) {
  const base = DEFAULT_FACULTY
  const source =
    cmsFaculty && Array.isArray(cmsFaculty.members) ? cmsFaculty.members : base.members

  const members = sortFacultyMembers(
    source.map((m, i) => normalizeFacultyMember(m, i)).filter((m) => m.published && m.name),
  )

  return {
    published: cmsFaculty?.published !== false,
    heroTitle: cmsFaculty?.heroTitle || base.heroTitle,
    heroSubtitle: cmsFaculty?.heroSubtitle || base.heroSubtitle,
    members,
  }
}
