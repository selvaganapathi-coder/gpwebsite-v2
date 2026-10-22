/**
 * Contact form email settings.
 * Enquiries are sent to recipientEmail via FormSubmit.
 * On first use, FormSubmit will email recipientEmail — click the activation link once.
 */
window.GP_CONTACT = {
  recipientEmail: 'gppharmacycollege@gmail.com',
  whatsapp: {
    number: '919443437487',
    display: '+91 94434 37487',
    message: 'Hi, I want admission info — Code 889.',
  },
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7787.086099929674!2d78.599926!3d12.612339!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3badab4e2f3777b5%3A0xa2842979384d8d57!2sGP%20PHARMACY%20COLLEGE!5e0!3m2!1sen!2sin!4v1741348488285!5m2!1sen!2sin',
  mapsPlaceUrl: 'https://www.google.com/maps/place/GP+PHARMACY+COLLEGE/@12.612339,78.599926,17z',
  mapsReviewUrl: 'https://www.google.com/maps/place/GP+PHARMACY+COLLEGE/@12.612339,78.599926,17z',
  subject: 'New Enquiry — G.P. Pharmacy College Website',
  autoResponseTemplate: [
    'Dear {{name}},',
    '',
    'Thank you for contacting G.P. Pharmacy College, Tirupattur.',
    '',
    'We have received your enquiry and our team will get back to you within 1–2 working days.',
    '',
    'For urgent queries, call +91 94434 37487 or +91 95786 27535.',
    '',
    'Best regards,',
    'G.P. Pharmacy College',
    'Counselling Code: 889',
  ].join('\n'),
  courseLabels: {
    dpharm: 'D.Pharm',
    bpharm: 'B.Pharm',
    mpharm: 'M.Pharm',
    pharmd: 'Pharm-D',
    lateral: 'B.Pharm Lateral Entry',
  },
  limits: {
    nameMin: 2,
    nameMax: 80,
    messageMax: 1000,
  },
};
