/**
 * Student Activities — student-focused campus programmes
 */

const GP = 'https://gppharmacycollege.com/wp-content/uploads/2025/03'

export const STUDENT_ACTIVITY_GROUPS = [
  {
    id: 'learning',
    title: 'Learning',
    lead: 'Pharmacy Week, seminars, guest lectures, and industrial & hospital visits.',
    image: `${GP}/G.P.Pharmacy-College5.jpg`,
    items: [
      {
        id: 'pharmacy-week',
        label: 'Pharmacy Week',
        summary:
          'A focused week of talks, displays, and student programmes celebrating the pharmacy profession.',
        image: `${GP}/G.P.Pharmacy-College5.jpg`,
      },
      {
        id: 'seminars-workshops',
        label: 'Seminars & Workshops',
        summary:
          'Subject seminars and skill workshops where students learn new topics beyond the regular timetable.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
      {
        id: 'guest-lectures',
        label: 'Guest Lectures',
        summary:
          'Talks by industry, hospital, and academic guests that connect syllabus topics to real practice.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
      {
        id: 'industrial-visits',
        label: 'Industrial Visits',
        summary:
          'Visits to pharma industries so students see manufacturing, quality, and workplace routines first-hand.',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
      },
      {
        id: 'hospital-visits',
        label: 'Hospital Visits',
        summary:
          'Hospital exposure that shows pharmacy roles in wards, dispensing, and patient care settings.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
    ],
  },
  {
    id: 'campus-life',
    title: 'Campus Life',
    lead: 'Culture, sports, clubs, wellness, national days, and student competitions.',
    image: `${GP}/G.P.Pharmacy-College1.jpg`,
    items: [
      {
        id: 'cultural-activities',
        label: 'Cultural Activities',
        summary:
          'Music, dance, arts, and college cultural programmes where students perform and organise events.',
        image: `${GP}/G.P.Pharmacy-College1.jpg`,
      },
      {
        id: 'sports-activities',
        label: 'Sports',
        summary:
          'Indoor and outdoor sports meets that encourage fitness, fair play, and batch spirit.',
        image: `${GP}/G.P.Pharmacy-College5.jpg`,
      },
      {
        id: 'student-clubs',
        label: 'Student Clubs',
        summary:
          'Student-led clubs for interests such as science, culture, language, and campus initiatives.',
        image: `${GP}/G.P.Pharmacy-College26.jpg`,
      },
      {
        id: 'yoga-wellness',
        label: 'Yoga & Wellness',
        summary:
          'Yoga and wellness sessions that help students manage stress during busy academic weeks.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
      {
        id: 'national-days',
        label: 'National / International Days',
        summary:
          'Observances such as Independence Day, Republic Day, and health awareness days on campus.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
      {
        id: 'student-competitions',
        label: 'Student Competitions',
        summary:
          'Quizzes, poster contests, and academic competitions that build confidence and teamwork.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
    ],
  },
  {
    id: 'outreach',
    title: 'Service & Outreach',
    lead: 'NSS, health camps, community pharmacy work, and alumni links that serve society.',
    image: `${GP}/G.P.Pharmacy-College28.jpg`,
    items: [
      {
        id: 'nss',
        label: 'NSS / Social Service',
        summary:
          'National Service Scheme and social service activities that build civic responsibility.',
        image: `${GP}/G.P.Pharmacy-College28.jpg`,
      },
      {
        id: 'health-awareness',
        label: 'Health Awareness',
        summary:
          'Campus and community programmes that spread simple, useful health messages.',
        image: `${GP}/G.P.Pharmacy-College12.jpg`,
      },
      {
        id: 'blood-donation',
        label: 'Blood Donation Camps',
        summary:
          'Voluntary blood donation camps organised with partner hospitals and blood banks.',
        image: `${GP}/G.P.Pharmacy-College4.jpg`,
      },
      {
        id: 'community-pharmacy',
        label: 'Community Pharmacy',
        summary:
          'Outreach that shows how community pharmacists counsel patients and support local health needs.',
        image: `${GP}/G.P.Pharmacy-College10.jpg`,
      },
      {
        id: 'pharmacy-awareness',
        label: 'Pharmacy Awareness',
        summary:
          'Programmes that explain the role of pharmacists in safe medicine use and public health.',
        image: `${GP}/Pharmaceutics-lab.jpg`,
      },
      {
        id: 'alumni-activities',
        label: 'Alumni Activities',
        summary:
          'Alumni meets and interactions that connect current students with graduates and mentors.',
        image: `${GP}/G.P.Pharmacy-College22.jpg`,
      },
    ],
  },
]

/** Mega menu columns — same items as page sections */
export const ACTIVITIES_MEGA_GROUPS = [
  {
    title: 'Learning',
    items: [
      { to: '/student-activities', label: 'All Student Activities', id: 'act-home' },
      { to: '/student-activities#pharmacy-week', label: 'Pharmacy Week', id: 'act-pharmacy-week' },
      { to: '/student-activities#seminars-workshops', label: 'Seminars & Workshops', id: 'act-seminars' },
      { to: '/student-activities#guest-lectures', label: 'Guest Lectures', id: 'act-guest' },
      { to: '/student-activities#industrial-visits', label: 'Industrial Visits', id: 'act-industrial' },
      { to: '/student-activities#hospital-visits', label: 'Hospital Visits', id: 'act-hospital' },
    ],
  },
  {
    title: 'Campus Life',
    items: [
      { to: '/student-activities#cultural-activities', label: 'Cultural Activities', id: 'act-cultural' },
      { to: '/student-activities#sports-activities', label: 'Sports', id: 'act-sports' },
      { to: '/student-activities#student-clubs', label: 'Student Clubs', id: 'act-clubs' },
      { to: '/student-activities#yoga-wellness', label: 'Yoga & Wellness', id: 'act-yoga' },
      { to: '/student-activities#national-days', label: 'National / International Days', id: 'act-days' },
      { to: '/student-activities#student-competitions', label: 'Student Competitions', id: 'act-competitions' },
    ],
  },
  {
    title: 'Service & Outreach',
    items: [
      { to: '/student-activities#nss', label: 'NSS / Social Service', id: 'act-nss' },
      { to: '/student-activities#health-awareness', label: 'Health Awareness', id: 'act-health' },
      { to: '/student-activities#blood-donation', label: 'Blood Donation Camps', id: 'act-blood' },
      { to: '/student-activities#community-pharmacy', label: 'Community Pharmacy', id: 'act-community' },
      { to: '/student-activities#pharmacy-awareness', label: 'Pharmacy Awareness', id: 'act-awareness' },
      { to: '/student-activities#alumni-activities', label: 'Alumni Activities', id: 'act-alumni' },
    ],
  },
]

export const ACTIVITIES_FLAT = ACTIVITIES_MEGA_GROUPS.flatMap((g) => g.items)

export const ACTIVITIES_SUBNAV = [
  { to: '/student-activities#learning', label: 'Learning', id: 'learning' },
  { to: '/student-activities#campus-life', label: 'Campus Life', id: 'campus-life' },
  { to: '/student-activities#outreach', label: 'Service', id: 'outreach' },
]
