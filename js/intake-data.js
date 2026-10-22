/**
 * Official program intake — single source of truth.
 * Update here; sync courses, admissions, CMS, and assistant answers.
 */
window.GP_INTAKE = {
  programs: [
    { id: 'bpharm', name: 'B.Pharm', duration: '4 years', intake: 100 },
    { id: 'dpharm', name: 'D.Pharm', duration: '2 years', intake: 60 },
    { id: 'pharmd', name: 'Pharm-D', duration: '6 years', intake: 30, note: 'SC/ST Scholarship available' },
    {
      id: 'mpharm',
      name: 'M.Pharm',
      duration: '2 years',
      intake: 45,
      specializations: [
        { name: 'Pharmaceutics', intake: 15 },
        { name: 'Pharmaceutical Analysis', intake: 15 },
        { name: 'Pharmaceutical Regulatory Affairs', intake: 15 },
      ],
    },
    { id: 'bpharm-lateral', name: 'B.Pharm Lateral Entry', duration: '3 years', intake: null, note: 'For D.Pharm holders' },
  ],
};
