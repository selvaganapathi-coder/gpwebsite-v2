/**
 * G.P. Pharmacy College — Achievements Data (sample, ERP-ready)
 */
window.GPAchievements = {
  categories: [
    { id: 'rank', icon: '🏆', label: 'University Rank' },
    { id: 'academic', icon: '🥇', label: 'Academic Excellence' },
    { id: 'research', icon: '🔬', label: 'Research Award' },
    { id: 'placement', icon: '💼', label: 'Placement Achievement' },
    { id: 'sports', icon: '🏅', label: 'Sports Achievement' },
    { id: 'certification', icon: '📜', label: 'Certification' },
  ],

  items: [
    {
      id: 'ach-1', category: 'rank',
      student: 'R. Priya', course: 'B.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College32.jpg',
      achievement: 'University Rank — 2nd Place',
      date: '2025-05-15',
      event: 'TN Dr. M.G.R. Medical University B.Pharm Examinations',
      certificate: true,
    },
    {
      id: 'ach-2', category: 'academic',
      student: 'K. Arun', course: 'Pharm-D',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College22.jpg',
      achievement: 'Gold Medal — Academic Excellence',
      date: '2025-04-20',
      event: 'Annual Academic Awards Ceremony',
      certificate: true,
    },
    {
      id: 'ach-3', category: 'research',
      student: 'S. Deepa', course: 'M.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College10.jpg',
      achievement: 'Best Research Paper Award',
      date: '2025-03-08',
      event: 'PCI National Pharmacy Conference, Chennai',
      certificate: true,
    },
    {
      id: 'ach-4', category: 'placement',
      student: 'M. Kumar', course: 'B.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College26.jpg',
      achievement: 'Placed at Sun Pharma — ₹3.2 LPA',
      date: '2025-02-28',
      event: 'Campus Placement Drive 2025',
      certificate: false,
    },
    {
      id: 'ach-5', category: 'sports',
      student: 'V. Meena', course: 'D.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College23.jpg',
      achievement: 'District Athletics — 100m Gold',
      date: '2025-01-18',
      event: 'Vellore District Inter-College Sports Meet',
      certificate: true,
    },
    {
      id: 'ach-6', category: 'certification',
      student: 'J. Rahul', course: 'B.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College19.jpg',
      achievement: 'GCP & Clinical Research Certification',
      date: '2024-11-12',
      event: 'Online Certification Programme — ClinSkill Academy',
      certificate: true,
    },
    {
      id: 'ach-7', category: 'academic',
      student: 'A. Lakshmi', course: 'M.Pharm',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College21.jpg',
      achievement: 'Department Topper — Pharmaceutics',
      date: '2024-10-05',
      event: 'M.Pharm Semester Examinations',
      certificate: true,
    },
    {
      id: 'ach-8', category: 'placement',
      student: 'P. Divya', course: 'Pharm-D',
      photo: 'https://gppharmacycollege.com/wp-content/uploads/2025/03/G.P.Pharmacy-College20.jpg',
      achievement: 'Apollo Hospitals — Clinical Pharmacist',
      date: '2024-09-22',
      event: 'Hospital Recruitment Drive',
      certificate: false,
    },
  ],

  getByCategory(cat) {
    if (!cat || cat === 'all') return this.items;
    return this.items.filter(a => a.category === cat);
  },

  getCategory(id) {
    return this.categories.find(c => c.id === id);
  },

  formatDate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  },
};
