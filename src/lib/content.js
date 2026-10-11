import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import SiteConfig from '@/models/SiteConfig';
import { EVENTS, SITE_CONFIG } from '@/lib/data';

const DEFAULT_EDITION = process.env.ICON_EDITION || '2026';

function serializeEvent(doc) {
  if (!doc) return null;
  const e = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    _id: e._id?.toString?.() || e._id || undefined,
    name: e.name,
    slug: e.slug,
    edition: e.edition || DEFAULT_EDITION,
    category: e.category,
    shortDesc: e.shortDesc || '',
    description: e.description || '',
    date: e.date || '',
    time: e.time || '',
    venue: e.venue || '',
    registrationFee: Number(e.registrationFee) || 0,
    prizePool: Number(e.prizePool) || 0,
    teamSize: e.teamSize || 'Solo',
    maxParticipants: e.maxParticipants ?? null,
    posterImage: e.posterImage || '',
    rules: Array.isArray(e.rules) ? e.rules : [],
    poc: e.poc || { name: '', phone: '', email: '' },
    isActive: e.isActive !== false,
    isRegistrationOpen: e.isRegistrationOpen !== false,
    sortOrder: e.sortOrder ?? 0,
    streamUrl: e.streamUrl ?? null,
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
    return {
      ...fallbackSiteConfig(),
      ...doc,
      _id: doc._id?.toString?.(),
      edition: doc.edition || edition,
      eventDates: doc.eventDates || fallbackSiteConfig().eventDates,
      venue: doc.venue || fallbackSiteConfig().venue,
      socials: doc.socials || fallbackSiteConfig().socials,
      stats: doc.stats || fallbackSiteConfig().stats,
      paymentQrs: Array.isArray(doc.paymentQrs) ? doc.paymentQrs : [],
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
