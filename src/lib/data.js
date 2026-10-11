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
    // 4 technical + 1 sports + 2 indoor categories + 6 mini-games
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

// ── Events Data (ICON 2026 confirmed lineup) ──
export const EVENTS = [
  // 1) Technical
  {
    name: 'Hackathon',
    slug: 'hackathon',
    category: 'technical',
    shortDesc: 'Flagship build challenge — ship something real around DATATRON.',
    description:
      'The ICON 2026 hackathon. Teams build innovative solutions around data, automation, and AI. Bring a working demo for judging.',
    date: '2026-02-13',
    time: '10:00 AM onwards',
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
    ],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Project Exhibition / ICON Gallery',
    slug: 'icon-gallery',
    category: 'technical',
    shortDesc: 'Showcase your project — stalls, demos, and jury feedback.',
    description:
      'ICON Gallery is the project exhibition for ICON 2026. Present your work at a stall, talk to visitors and faculty, and compete for recognition.',
    date: '2026-02-14',
    time: '10:00 AM - 4:00 PM',
    venue: 'KJSIM Exhibition Area',
    registrationFee: 100,
    prizePool: 5000,
    teamSize: '1-4 members',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: [
      'Bring a poster / laptop demo',
      'Teams of 1-4',
      'Original student work only',
      'Be present at your stall during judging',
    ],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Debate Competition',
    slug: 'debate',
    category: 'technical',
    shortDesc: 'Argue the future of tech — structured rounds, sharp rebuttals.',
    description:
      'A formal debate competition on technology and society themes. Motion(s) announced closer to the event. Clarity, evidence, and rebuttal quality are judged.',
    date: '2026-02-13',
    time: '2:00 PM - 5:00 PM',
    venue: 'KJSIM Seminar Hall',
    registrationFee: 100,
    prizePool: 3000,
    teamSize: 'Solo or Duo',
    maxParticipants: 40,
    posterImage: '/images/events/tech-quiz.svg',
    rules: [
      'Solo or duo entries',
      'Motions announced before rounds',
      'No personal attacks',
      'Time limits enforced per speaker',
    ],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Prompt Engineering Competition',
    slug: 'prompt-engineering',
    category: 'technical',
    shortDesc:
      'Final format to be decided: Video Generation or another prompt-based challenge.',
    description:
      'An AI prompt engineering competition. Final format will be decided closer to ICON — video generation or another prompt-based challenge. Bring creativity and precise prompting skills.',
    date: '2026-02-14',
    time: '11:00 AM - 1:00 PM',
    venue: 'KJSIM Lab-301',
    registrationFee: 100,
    prizePool: 3000,
    teamSize: 'Solo or Duo',
    maxParticipants: 60,
    posterImage: '/images/events/debugging.svg',
    rules: [
      'Solo or duo',
      'Only tools announced on the day',
      'Fair-play / no pre-baked submissions unless allowed',
      'Final format confirmed before fest week',
    ],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },

  // 2) Sports — one slot; final title TBD among the three options
  {
    name: 'Sports',
    slug: 'sports',
    category: 'sports',
    shortDesc: 'One sport to be finalised: Football OR Box Cricket OR Badminton.',
    description:
      'ICON 2026 has one sports event slot. Final sport will be chosen from Football, Box Cricket, or Badminton. Working option for planning: Box Cricket. Format and squad size confirmed closer to the fest.',
    date: '2026-02-13',
    time: '9:00 AM onwards',
    venue: 'KJSIM Sports Area',
    registrationFee: 400,
    prizePool: 5000,
    teamSize: 'Team (size TBD)',
    maxParticipants: null,
    posterImage: '/images/events/football.jpeg',
    includes: ['Football OR', 'Box Cricket OR', 'Badminton'],
    rules: [
      'One sports event will be finalised from the shortlist',
      'Sports shoes mandatory',
      'Fair play enforced',
      'Squad size announced with the final sport',
    ],
    poc: { name: 'Ajil George', phone: '8828279724', email: 'ajil.g@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },

  // 3) Indoor Games & Esports — two categories (Chess + Gaming)
  {
    name: 'Chess',
    slug: 'chess',
    category: 'gaming',
    shortDesc: 'Indoor board tournament — timed matches for all skill levels.',
    description:
      'Chess under Indoor Games & Esports at ICON 2026. Timed matches; clocks provided.',
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
    name: 'Gaming',
    slug: 'gaming',
    category: 'gaming',
    shortDesc: 'High chances of spot registrations — titles under Gaming.',
    description:
      'Gaming desk at ICON 2026 (Indoor Games & Esports). High chances of spot registrations. Titles under this category include Clash Royale, Mobile FIFA, and other suitable games if required.',
    date: '2026-02-13',
    time: '10:00 AM onwards',
    venue: 'KJSIM Gaming Zone',
    registrationFee: 150,
    prizePool: 2000,
    teamSize: 'As per title',
    maxParticipants: null,
    posterImage: '/images/events/Icon_BGMI.jpeg',
    includes: ['Clash Royale', 'Mobile FIFA', 'Other suitable games, if required'],
    rules: [
      'Bring your own device unless stated otherwise',
      'Fair play / no cheats or emulators where banned',
      'Spot registrations subject to capacity',
    ],
    poc: { name: 'Mohammad Harnekar', phone: '8433549779', email: 'm.harnekar@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },

  // 4) Mini-Games Zone — 6 games, FREE
  {
    name: 'Murder Mystery',
    slug: 'mini-murder-mystery',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — solve the case for fun.',
    description:
      'Part of the ICON Mini-Games Zone (6 games). Drop in, play for fun. No registration fee.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in / small groups',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Follow stall volunteer instructions', 'Be a good sport'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Game 2 — TBD',
    slug: 'mini-game-2',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — title to be announced.',
    description: 'Mini-Games Zone game 2. Free walk-up fun. Title and rules coming soon.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Details announced before fest week'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Game 3 — TBD',
    slug: 'mini-game-3',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — title to be announced.',
    description: 'Mini-Games Zone game 3. Free walk-up fun. Title and rules coming soon.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Details announced before fest week'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Game 4 — TBD',
    slug: 'mini-game-4',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — title to be announced.',
    description: 'Mini-Games Zone game 4. Free walk-up fun. Title and rules coming soon.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Details announced before fest week'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Game 5 — TBD',
    slug: 'mini-game-5',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — title to be announced.',
    description: 'Mini-Games Zone game 5. Free walk-up fun. Title and rules coming soon.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Details announced before fest week'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
  {
    name: 'Game 6 — TBD',
    slug: 'mini-game-6',
    category: 'mini-games',
    shortDesc: 'Free Mini-Games Zone — title to be announced.',
    description: 'Mini-Games Zone game 6. Free walk-up fun. Title and rules coming soon.',
    date: '2026-02-13',
    time: 'All day (zone hours)',
    venue: 'Mini-Games Zone, KJSIM',
    registrationFee: 0,
    prizePool: 0,
    teamSize: 'Walk-in',
    maxParticipants: null,
    posterImage: '/images/events/icon_techfair.png',
    rules: ['Free to play', 'Details announced before fest week'],
    poc: { name: 'Abin Cheruvathoor', phone: '8355868197', email: 'abin.c@somaiya.edu' },
    isActive: true,
    streamUrl: null,
    isLive: false,
  },
];

// ── Event Category Labels (matches ICON 2026 Event List) ──
export const EVENT_CATEGORIES = [
  { key: 'all', label: 'All', fullLabel: 'All Events' },
  { key: 'technical', label: 'Technical', fullLabel: 'Technical & Creative Events' },
  { key: 'sports', label: 'Sports', fullLabel: 'Sports Events' },
  { key: 'gaming', label: 'Indoor & Esports', fullLabel: 'Indoor Games & Esports' },
  { key: 'mini-games', label: 'Mini-Games', fullLabel: 'Mini-Games Zone — 6 Games' },
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
  { time: '09:00 AM', event: 'Sports (TBD)', status: 'upcoming' },
  { time: '10:00 AM', event: 'Hackathon Begins', status: 'upcoming' },
  { time: '10:00 AM', event: 'Mini-Games Zone Opens', status: 'upcoming' },
  { time: '10:00 AM', event: 'Gaming Desk', status: 'upcoming' },
  { time: '02:00 PM', event: 'Debate Competition', status: 'upcoming' },
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
