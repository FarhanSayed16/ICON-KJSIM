/**
 * Seed Event + SiteConfig collections from src/lib/data.js
 * Usage: node --env-file=.env scripts/seed-content.js
 */
const path = require('path');
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing');
    process.exit(1);
  }

  // Dynamic import of ESM data via compiled path won't work easily;
  // duplicate seed mapping by reading the built-in require of a CJS bridge.
  // Instead: use mongoose models defined inline for the script.
  await mongoose.connect(uri);
  console.log('Connected');

  const Event =
    mongoose.models.Event ||
    mongoose.model(
      'Event',
      new mongoose.Schema(
        {
          name: String,
          slug: String,
          edition: String,
          category: String,
          shortDesc: String,
          description: String,
          date: String,
          time: String,
          venue: String,
          registrationFee: Number,
          prizePool: Number,
          teamSize: String,
          maxParticipants: Number,
          posterImage: String,
          rules: [String],
          poc: { name: String, phone: String, email: String },
          isActive: Boolean,
          isRegistrationOpen: Boolean,
          sortOrder: Number,
          streamUrl: String,
          isLive: Boolean,
        },
        { timestamps: true }
      )
    );

  const SiteConfig =
    mongoose.models.SiteConfig ||
    mongoose.model(
      'SiteConfig',
      new mongoose.Schema(
        {
          key: String,
          edition: String,
          name: String,
          theme: String,
          slogan: String,
          tagline: String,
          description: String,
          institution: String,
          university: String,
          eventDates: { start: String, end: String },
          countdownTarget: String,
          venue: Object,
          contacts: Array,
          email: String,
          socials: Object,
          stats: Object,
          registrationOpen: Boolean,
          paymentQrs: Array,
        },
        { timestamps: true }
      )
    );

  // Load data via next-compatible export by evaluating the module with a tiny register
  const dataPath = path.join(__dirname, '..', 'src', 'lib', 'data.js');
  let EVENTS;
  let SITE_CONFIG;
  try {
    // Node 22+ can import TS/JS; for .js with export use dynamic import
    const mod = await import('file://' + dataPath.replace(/\\/g, '/'));
    EVENTS = mod.EVENTS;
    SITE_CONFIG = mod.SITE_CONFIG;
  } catch (e) {
    console.error('Failed to import data.js — run from project root with Node 20+.', e.message);
    process.exit(1);
  }

  const edition = process.env.ICON_EDITION || '2026';
  let upserted = 0;
  for (let i = 0; i < EVENTS.length; i++) {
    const e = EVENTS[i];
    await Event.findOneAndUpdate(
      { edition, slug: e.slug },
      {
        name: e.name,
        slug: e.slug,
        edition,
        category: e.category,
        shortDesc: e.shortDesc || '',
        description: e.description || '',
        date: e.date || '',
        time: e.time || '',
        venue: e.venue || '',
        registrationFee: e.registrationFee || 0,
        prizePool: typeof e.prizePool === 'number' ? e.prizePool : 0,
        teamSize: e.teamSize || 'Solo',
        maxParticipants: e.maxParticipants ?? null,
        posterImage: e.posterImage || '',
        rules: e.rules || [],
        poc: e.poc || {},
        isActive: e.isActive !== false,
        isRegistrationOpen: e.isActive !== false,
        sortOrder: i,
        streamUrl: e.streamUrl ?? null,
        isLive: !!e.isLive,
      },
      { upsert: true, new: true }
    );
    upserted++;
  }

  await SiteConfig.findOneAndUpdate(
    { key: 'default' },
    {
      key: 'default',
      edition,
      name: SITE_CONFIG.name,
      theme: SITE_CONFIG.theme,
      slogan: '',
      tagline: SITE_CONFIG.tagline,
      description: SITE_CONFIG.description,
      institution: SITE_CONFIG.institution,
      university: SITE_CONFIG.university,
      eventDates: SITE_CONFIG.eventDates,
      countdownTarget: SITE_CONFIG.countdownTarget,
      venue: SITE_CONFIG.venue,
      contacts: SITE_CONFIG.contacts,
      email: SITE_CONFIG.email,
      socials: SITE_CONFIG.socials,
      stats: SITE_CONFIG.stats,
      registrationOpen: true,
      paymentQrs: [
        { amount: 149, label: '₹149', qrImageUrl: '', payUrl: '' },
        { amount: 299, label: '₹299', qrImageUrl: '', payUrl: '' },
        { amount: 499, label: '₹499', qrImageUrl: '', payUrl: '' },
      ],
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Seeded ${upserted} events + SiteConfig for edition ${edition}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
