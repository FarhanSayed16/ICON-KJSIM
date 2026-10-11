import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import SiteConfig from '@/models/SiteConfig';
import { EVENTS, SITE_CONFIG } from '@/lib/data';

const DEFAULT_EDITION = process.env.ICON_EDITION || '2026';

function serializeEvent(doc) {
  if (!doc) return null;
  const e = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    _id: e._id != null ? String(e._id) : undefined,
    name: String(e.name || ''),
    slug: String(e.slug || ''),
    edition: String(e.edition || DEFAULT_EDITION),
    category: String(e.category || 'technical'),
    shortDesc: String(e.shortDesc || ''),
    description: String(e.description || ''),
    date: String(e.date || ''),
    time: String(e.time || ''),
    venue: String(e.venue || ''),
    registrationFee: Number(e.registrationFee) || 0,
    prizePool: Number(e.prizePool) || 0,
    teamSize: String(e.teamSize || 'Solo'),
    maxParticipants:
      e.maxParticipants == null || e.maxParticipants === ''
        ? null
        : Number(e.maxParticipants),
    posterImage: String(e.posterImage || ''),
    rules: Array.isArray(e.rules) ? e.rules.map((r) => String(r ?? '')) : [],
    includes: Array.isArray(e.includes) ? e.includes.map((r) => String(r ?? '')) : [],
    poc: {
      name: String(e.poc?.name || ''),
      phone: String(e.poc?.phone || ''),
      email: String(e.poc?.email || ''),
    },
    isActive: e.isActive !== false,
    isRegistrationOpen: e.isRegistrationOpen !== false,
    sortOrder: Number(e.sortOrder) || 0,
    streamUrl: e.streamUrl ? String(e.streamUrl) : null,
    isLive: !!e.isLive,
  };
}

function fallbackEvents() {
  return EVENTS.map((e, i) =>
    serializeEvent({
      ...e,
      edition: DEFAULT_EDITION,
      isRegistrationOpen: e.isActive !== false,
      sortOrder: i,
    })
  );
}

function fallbackSiteConfig() {
  return {
    key: 'default',
    edition: DEFAULT_EDITION,
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
    paymentQrs: [],
  };
}

export async function getEvents({
  edition = DEFAULT_EDITION,
  activeOnly = false,
  registrationOpenOnly = false,
} = {}) {
  try {
    await connectDB();
    const query = { edition };
    if (activeOnly) query.isActive = true;
    if (registrationOpenOnly) query.isRegistrationOpen = true;

    const rows = await Event.find(query).sort({ sortOrder: 1, name: 1 }).lean();
    if (!rows.length) return fallbackEvents().filter((e) => {
      if (activeOnly && !e.isActive) return false;
      if (registrationOpenOnly && !e.isRegistrationOpen) return false;
      return true;
    });
    return rows.map(serializeEvent);
  } catch (err) {
    console.warn('[content.getEvents] falling back to static data:', err.message);
    return fallbackEvents().filter((e) => {
      if (activeOnly && !e.isActive) return false;
      if (registrationOpenOnly && !e.isRegistrationOpen) return false;
      return true;
    });
  }
}

export async function getEventBySlug(slug, edition = DEFAULT_EDITION) {
  const events = await getEvents({ edition });
  return events.find((e) => e.slug === slug) || null;
}

export async function getSiteConfig(edition = DEFAULT_EDITION) {
  try {
    await connectDB();
    const doc = await SiteConfig.findOne({ key: 'default' }).lean();
    if (!doc) return fallbackSiteConfig();
    const base = fallbackSiteConfig();
    // Never spread raw lean() doc — ObjectIds / Dates break RSC client props
    return {
      ...base,
      _id: doc._id != null ? String(doc._id) : undefined,
      key: 'default',
      edition: String(doc.edition || edition),
      name: String(doc.name ?? base.name),
      theme: String(doc.theme ?? base.theme),
      slogan: String(doc.slogan ?? ''),
      tagline: String(doc.tagline ?? base.tagline),
      description: String(doc.description ?? base.description),
      institution: String(doc.institution ?? base.institution),
      university: String(doc.university ?? base.university),
      eventDates: {
        start: String(doc.eventDates?.start ?? base.eventDates.start),
        end: String(doc.eventDates?.end ?? base.eventDates.end),
      },
      countdownTarget: String(doc.countdownTarget ?? base.countdownTarget),
      venue: {
        name: String(doc.venue?.name ?? base.venue.name),
        address: String(doc.venue?.address ?? base.venue.address),
        mapsQuery: String(doc.venue?.mapsQuery ?? base.venue.mapsQuery),
        mapsEmbed: String(doc.venue?.mapsEmbed ?? base.venue.mapsEmbed),
      },
      contacts: Array.isArray(doc.contacts)
        ? doc.contacts.map((c) => ({
            name: String(c?.name || ''),
            phone: String(c?.phone || ''),
          }))
        : base.contacts,
      email: String(doc.email ?? base.email),
      socials: {
        facebook: String(doc.socials?.facebook ?? base.socials.facebook),
        instagram: String(doc.socials?.instagram ?? base.socials.instagram),
        linkedin: String(doc.socials?.linkedin ?? base.socials.linkedin),
      },
      stats: {
        participants: Number(doc.stats?.participants ?? base.stats.participants) || 0,
        events: Number(doc.stats?.events ?? base.stats.events) || 0,
        prizePool: Number(doc.stats?.prizePool ?? base.stats.prizePool) || 0,
        colleges: Number(doc.stats?.colleges ?? base.stats.colleges) || 0,
      },
      registrationOpen: doc.registrationOpen !== false,
      paymentQrs: Array.isArray(doc.paymentQrs)
        ? doc.paymentQrs.map((q) => ({
            amount: Number(q?.amount) || 0,
            label: String(q?.label || ''),
            qrImageUrl: String(q?.qrImageUrl || ''),
            payUrl: String(q?.payUrl || ''),
          }))
        : [],
    };
  } catch (err) {
    console.warn('[content.getSiteConfig] falling back to static data:', err.message);
    return fallbackSiteConfig();
  }
}

export function getPayableAmount(events, selectedSlugs) {
  const set = new Set(selectedSlugs);
  return events
    .filter((e) => set.has(e.slug))
    .reduce((sum, e) => sum + (Number(e.registrationFee) || 0), 0);
}

export function getPaymentQrForAmount(siteConfig, amount) {
  const list = siteConfig?.paymentQrs || [];
  return list.find((q) => Number(q.amount) === Number(amount)) || null;
}

export { DEFAULT_EDITION, serializeEvent };
