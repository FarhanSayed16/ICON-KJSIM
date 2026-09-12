// ============================================
// ICON 2026 — Static Data & Content Model
// Single source of truth for events, sponsors,
// team, and site constants.
// ============================================

// ── Site Constants ──
export const SITE_CONFIG = {
  name: 'ICON 2026',
  theme: 'DATATRON',
  tagline: 'The Core of Tomorrow\'s Digital Revolution',
  description: 'Official Techfest of the Department of Data Science & Technology',
  institution: 'K J Somaiya Institute of Management',
  university: 'Somaiya Vidyavihar University',
  eventDates: { start: '2026-02-13', end: '2026-02-14' },
  countdownTarget: '2026-02-13T09:00:00+05:30',
  venue: {
    name: 'K J Somaiya Institute of Management',
    address: 'Vidyanagar, Vidya Vihar East, Vidyavihar, Mumbai, Maharashtra 400077',
    mapsQuery: 'KJ+Somaiya+Institute+of+Management',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.793994956178!2d72.89523516477274!3d19.072792973172707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c89d872d6e89%3A0x2d6190e60dcda447!2sK%20J%20Somaiya%20Institute%20of%20Management!5e0!3m2!1sen!2sin!4v1789222910888!5m2!1sen!2sin',
  },
  contacts: [
    { name: 'Ajil George', phone: '+91-8828279724' },
    { name: 'Abin Cheruvathoor', phone: '+91-8355868197' },
  ],
  email: 'icon.simsr@somaiya.edu',
  socials: {
    facebook: 'https://www.facebook.com/somaiya.vidyavihar',
    instagram: 'https://www.instagram.com/kjsim_official',
    linkedin: 'https://www.linkedin.com/school/k-j-somaiya-institute-of-management',
  },
  stats: {
    participants: 1000,
    events: 13,
    prizePool: 50000,
    colleges: 30,
  },
};

// Live stream ops — flip isLive + youtubeVideoId on event day
export const LIVE_STREAM = {
  isLive: false,
  youtubeVideoId: '', // e.g. 'jfKfPfyJRdk' for testing
  currentEventTitle: 'ICON 2026 — Main Stage',
  description: 'Official live coverage of ICON 2026 — DATATRON.',
};

// ── Navigation Links ──
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Hackathon', href: '/hackathon' },
  { label: 'Live', href: '/live' },
];

// ── Events Data ──
export const EVENTS = [
  // Technical Events
  {
    name: 'Code Icon',
    slug: 'code-icon',
    category: 'technical',
    shortDesc: 'The flagship 24-hour hackathon — build, innovate, disrupt.',
    description: 'Code Icon is the flagship hackathon of ICON 2026. Teams of 2-4 compete to build innovative solutions around the DATATRON theme. From AI-powered apps to data visualization tools, push your limits and compete for glory.',
    date: '2026-02-13',
    time: '10:00 AM - 4:00 PM (next day)',
    venue: 'KJSIM Lab-205',
    registrationFee: 500,
    prizePool: 22500,
    teamSize: '2-4 members',
    maxParticipants: null,
    posterImage: '/images/events/Icon_Hackathon.jpeg',
    rules: [
      'Teams of 2-4 members',
      'All code must be written during the hackathon',
      'Any tech stack allowed',
      'Working demo required for judging',
      'Internet allowed for reference only',
    ],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Debugging Challenge',
    slug: 'debugging',
    category: 'technical',
    shortDesc: 'Find bugs before they find you. Race against the clock.',
    description: 'Put your debugging skills to the test. You\'ll be given buggy code across multiple languages and must fix them in the shortest time possible.',
    date: '2026-02-13',
    time: '11:00 AM - 1:00 PM',
    venue: 'KJSIM Lab-301',
    registrationFee: 100,
    prizePool: 2000,
    teamSize: 'Solo',
    maxParticipants: 60,
    posterImage: '/images/events/debugging.svg',
    rules: ['Individual participation', 'No external tools allowed', '90-minute time limit'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Web Dev Showdown',
    slug: 'web-dev',
    category: 'technical',
    shortDesc: 'Design and develop a website from scratch in 3 hours.',
    description: 'A timed web development competition where participants build a responsive website based on a given theme. Creativity, code quality, and UX are judged.',
    date: '2026-02-14',
    time: '10:00 AM - 1:00 PM',
    venue: 'KJSIM Lab-205',
    registrationFee: 150,
    prizePool: 3000,
    teamSize: 'Solo or Duo',
    maxParticipants: 40,
    posterImage: '/images/events/web-dev.svg',
    rules: ['Solo or team of 2', 'Any framework allowed', 'No templates/pre-built code', 'Must be responsive'],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Tech Quiz',
    slug: 'tech-quiz',
    category: 'technical',
    shortDesc: 'Test your knowledge across tech, science, and pop culture.',
    description: 'A multi-round quiz covering programming, data science, AI/ML, cybersecurity, and general tech trivia. Fast fingers and sharp minds win.',
    date: '2026-02-13',
    time: '2:00 PM - 4:00 PM',
    venue: 'KJSIM Seminar Hall',
    registrationFee: 50,
    prizePool: 1500,
    teamSize: 'Solo',
    maxParticipants: 100,
    posterImage: '/images/events/tech-quiz.svg',
    rules: ['Individual participation', 'Multiple rounds', 'No devices during quiz'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },

  // Non-Technical Events
  {
    name: 'Treasure Hunt',
    slug: 'treasure-hunt',
    category: 'non-technical',
    shortDesc: 'Follow the clues, solve the puzzles, claim the treasure.',
    description: 'An exciting campus-wide treasure hunt with cryptic clues, riddles, and physical challenges. Teams race to find the final treasure.',
    date: '2026-02-14',
    time: '11:00 AM - 2:00 PM',
    venue: 'KJSIM Campus',
    registrationFee: 250,
    prizePool: 2000,
    teamSize: '3 members',
    maxParticipants: 20,
    posterImage: '/images/events/Icon_TreasureHunt.jpeg',
    rules: ['Teams of 3-5', 'Campus grounds only', 'No running in buildings', 'All clues must be returned'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Photography Contest',
    slug: 'photography',
    category: 'non-technical',
    shortDesc: 'Capture the moment. Theme reveal on the day.',
    description: 'A photography competition with an on-the-spot theme reveal. Use your phone or camera to capture stunning shots within the campus.',
    date: '2026-02-13',
    time: '10:00 AM - 3:00 PM',
    venue: 'KJSIM Campus',
    registrationFee: 50,
    prizePool: 1500,
    teamSize: 'Solo',
    maxParticipants: null,
    posterImage: '/images/events/photography.svg',
    rules: ['Phone or camera allowed', 'No heavy editing', 'Submit max 3 photos', 'Theme announced at 10 AM'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Creative Writing',
    slug: 'creative-writing',
    category: 'non-technical',
    shortDesc: 'Let your words paint worlds. Topic given on the spot.',
    description: 'Express your creativity through words. Topic revealed on-the-spot. Write a short story, poem, or essay in 90 minutes.',
    date: '2026-02-14',
    time: '2:00 PM - 3:30 PM',
    venue: 'KJSIM Room 102',
    registrationFee: 0,
    prizePool: 1000,
    teamSize: 'Solo',
    maxParticipants: null,
    posterImage: '/images/events/creative-writing.svg',
    rules: ['Individual participation', 'Handwritten submissions', '90-minute limit', 'Original work only'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },

  // Gaming Events
  {
    name: 'BGMI',
    slug: 'bgmi',
    category: 'gaming',
    shortDesc: 'Battlegrounds Mobile India — squad up and dominate.',
    description: 'Compete in an intense Battlegrounds Mobile India tournament. Squad-based gameplay with multiple rounds leading to a grand finale.',
    date: '2026-02-13',
    time: '10:00 AM onwards',
    venue: 'K J Somaiya Institute of Management',
    registrationFee: 200,
    prizePool: 2000,
    teamSize: '4 members (Squad)',
    maxParticipants: 25,
    posterImage: '/images/events/Icon_BGMI.jpeg',
    rules: ['Squad of 4 players', 'Bring your own device', 'No emulators', 'Fair play policy enforced'],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'FIFA Tournament',
    slug: 'fifa',
    category: 'gaming',
    shortDesc: 'Console football showdown — claim the title.',
    description: 'Compete in an intense console football showdown and claim the title. 1v1 knockout format on PlayStation.',
    date: '2026-02-14',
    time: '10:00 AM onwards',
    venue: 'KJSIM LAB-205',
    registrationFee: 120,
    prizePool: 2000,
    teamSize: 'Solo',
    maxParticipants: 32,
    posterImage: '/images/events/fifa.jpeg',
    rules: ['1v1 knockout format', 'PlayStation provided', '6-minute halves', 'No custom tactics glitching'],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Pickleball',
    slug: 'pickleball',
    category: 'gaming',
    shortDesc: 'Fast-paced paddle sport — doubles tournament.',
    description: 'A doubles pickleball tournament on campus. Fast-paced, fun, and fiercely competitive.',
    date: '2026-02-14',
    time: '11:00 AM onwards',
    venue: 'Pickleball Court',
    registrationFee: 200,
    prizePool: 2000,
    teamSize: '2 members (Doubles)',
    maxParticipants: 16,
    posterImage: '/images/events/pickleball.jpeg',
    rules: ['Doubles format', 'Rally scoring to 11', 'Equipment provided', 'Sports shoes mandatory'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Chess',
    slug: 'chess',
    category: 'gaming',
    shortDesc: 'Classic strategy — checkmate your way to the top.',
    description: 'A chess tournament for ICON 2026. Test your strategy and composure across timed matches.',
    date: '2026-02-14',
    time: '10:00 AM onwards',
    venue: 'K J Somaiya Institute of Management',
    registrationFee: 100,
    prizePool: 1000,
    teamSize: 'Solo',
    maxParticipants: 64,
    posterImage: '/images/events/Icon_chess.jpeg',
    rules: ['Individual participation', 'Standard tournament rules', 'Clocks provided'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Football',
    slug: 'football',
    category: 'gaming',
    shortDesc: '8-a-side football — compete for campus glory.',
    description: 'An 8-a-side football tournament at ICON 2026. Bring your squad and compete for the prize pool.',
    date: '2026-02-13',
    time: '9:00 AM onwards',
    venue: 'K J Somaiya Institute of Management',
    registrationFee: 500,
    prizePool: 5000,
    teamSize: '8 members',
    maxParticipants: 12,
    posterImage: '/images/events/football.jpeg',
    rules: ['Team of 8', 'Sports shoes mandatory', 'Fair play enforced'],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Tech Fair',
    slug: 'tech-fair',
    category: 'non-technical',
    shortDesc: 'Explore stalls, demos, and innovations at the Amphitheatre.',
    description: 'ICON 2026 Tech Fair — visit the Amphitheatre for demos, exhibits, and campus innovation showcases.',
    date: '2026-02-13',
    time: 'All day',
    venue: 'Amphitheatre, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Open',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Open to all attendees', 'Follow stall guidelines'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
];

// ── Event Category Labels ──
export const EVENT_CATEGORIES = [
  { key: 'all', label: 'All Events' },
  { key: 'technical', label: 'Technical Events' },
  { key: 'non-technical', label: 'Non-Technical Events' },
  { key: 'gaming', label: 'Gaming Events' },
];

// ── Sponsors Data ──
export const SPONSORS = [
  {
    name: 'TechNova',
    tier: 'Title Sponsor',
    logo: '/images/sponsors/technova.svg',
    url: '#',
  },
  {
    name: 'abCoffee',
    tier: 'Hydration Partner',
    logo: '/images/sponsors/abcoffee.svg',
    url: 'https://abcoffee.in',
  },
  {
    name: 'Decathlon',
    tier: 'Sports Partner',
    logo: '/images/sponsors/decathlon.svg',
    url: 'https://www.decathlon.in',
  },
  {
    name: 'Softmark',
    tier: 'Technology Partner',
    logo: '/images/sponsors/softmark.svg',
    url: '#',
  },
];

// ── Sponsor Tiers ──
export const SPONSOR_TIERS = [
  'Title Sponsor',
  'Sports Partner',
  'Technology Partner',
  'Hydration Partner',
  'Media Partner',
];

// ── Team Data ──
export const TEAM_MEMBERS = [
  // Faculty Coordinators
  {
    name: 'Dr. Jaya Vinod Iyer',
    role: 'Faculty Coordinator',
    team: 'Faculty',
    photo: '/images/team/jayaiyer.jpg',
    objectPosition: '59% 0%',
    scale: 1.10,
    bio: 'Associate Professor at K J Somaiya Institute of Management.',
    linkedin: 'https://www.linkedin.com',
    email: 'jayaiyer@somaiya.edu',
    instagram: null,
    order: 1,
  },

  // Organizing Committee
  {
    name: 'Abin Cheruvathoor',
    role: 'Team Head (Main Admin)',
    team: 'Organizing Committee',
    photo: '/images/team/abin.jpeg',
    objectPosition: '100% 92%',
    scale: 1.25,
    bio: 'Leading the organizing committee for ICON 2026 — DATATRON.',
    linkedin: 'https://www.linkedin.com',
    email: 'abin.c@somaiya.edu',
    instagram: 'https://www.instagram.com',
    order: 1,
  },
  {
    name: 'Aryan Dalvi',
    role: 'PR Team Head',
    team: 'Organizing Committee',
    photo: '/images/team/aryaan.jpg',
    objectPosition: '80% 0%',
    scale: 1.15,
    bio: 'Spearheading Public Relations and Outreach.',
    linkedin: 'https://www.linkedin.com',
    email: 'aryan.d@somaiya.edu',
    instagram: 'https://www.instagram.com',
    order: 2,
  },

  // Core Committee
  {
    name: 'Event Ops Lead',
    role: 'Core Committee — Events',
    team: 'Core Committee',
    photo: '',
    bio: 'Coordinates technical and non-technical event operations.',
    linkedin: null,
    email: 'icon.simsr@somaiya.edu',
    instagram: null,
    order: 1,
  },
  {
    name: 'Gaming Lead',
    role: 'Core Committee — Gaming',
    team: 'Core Committee',
    photo: '',
    bio: 'Owns gaming arena logistics and tournament brackets.',
    linkedin: null,
    email: 'icon.simsr@somaiya.edu',
    instagram: null,
    order: 2,
  },

  // Development Team
  {
    name: 'Farhan Sayed',
    role: 'Lead Developer',
    team: 'Development Team',
    photo: '/images/team/farhan.jpeg',
    objectPosition: '5% 0%',
    scale: 1.15,
    bio: 'Full-stack developer building the ICON 2026 experience.',
    linkedin: 'https://www.linkedin.com',
    email: 'farhan@somaiya.edu',
    instagram: 'https://www.instagram.com',
    order: 1,
  },

  // Marketing & PR
  {
    name: 'Outreach Coordinator',
    role: 'Social & Campus Outreach',
    team: 'Marketing & PR',
    photo: '',
    bio: 'Campus ambassadors, social media, and college outreach.',
    linkedin: null,
    email: 'icon.simsr@somaiya.edu',
    instagram: 'https://www.instagram.com',
    order: 1,
  },

  // Logistics
  {
    name: 'Logistics Coordinator',
    role: 'Venue & Operations',
    team: 'Logistics & Operations',
    photo: '',
    bio: 'Venue readiness, hospitality, and day-of operations.',
    linkedin: null,
    email: 'icon.simsr@somaiya.edu',
    instagram: null,
    order: 1,
  },
];

// ── Live Schedule Seed ──
export const LIVE_SCHEDULE = [
  { time: '09:00 AM', event: 'Opening Ceremony', status: 'upcoming' },
  { time: '10:00 AM', event: 'Hackathon Begins', status: 'upcoming' },
  { time: '11:00 AM', event: 'BGMI Tournament', status: 'upcoming' },
  { time: '12:00 PM', event: 'Tech Quiz Round 1', status: 'upcoming' },
  { time: '02:00 PM', event: 'Photography Submissions', status: 'upcoming' },
  { time: '03:00 PM', event: 'Debugging Challenge', status: 'upcoming' },
  { time: '04:00 PM', event: 'Hackathon Presentations', status: 'upcoming' },
  { time: '05:00 PM', event: 'Prize Distribution', status: 'upcoming' },
];

// ── Helper: Get events by category ──
export function getEventsByCategory(category) {
  if (category === 'all') return EVENTS.filter(e => e.isActive);
  return EVENTS.filter(e => e.category === category && e.isActive);
}

// ── Helper: Get event by slug ──
export function getEventBySlug(slug) {
  return EVENTS.find(e => e.slug === slug);
}

// ── Helper: Get all event names for registration ──
export function getEventOptions() {
  return EVENTS.filter(e => e.isActive).map(e => ({
    name: e.name,
    slug: e.slug,
    category: e.category,
    fee: e.registrationFee,
  }));
}
