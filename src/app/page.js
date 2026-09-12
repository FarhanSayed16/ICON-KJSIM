import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import StatsBar from '@/components/About/StatsBar';
import EventSchedule from '@/components/EventSchedule/EventSchedule';
import GalleryPreview from '@/components/GalleryPreview/GalleryPreview';
import Location from '@/components/Location/Location';
import Brochure from '@/components/Brochure/Brochure';
import Sponsors from '@/components/Sponsors/Sponsors';
import ContactForm from '@/components/ContactForm/ContactForm';
import { SITE_CONFIG } from '@/lib/data';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `${SITE_CONFIG.name} — ${SITE_CONFIG.theme}`,
  description: SITE_CONFIG.description,
  startDate: SITE_CONFIG.eventDates.start,
  endDate: SITE_CONFIG.eventDates.end,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: SITE_CONFIG.venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.venue.address,
      addressLocality: 'Mumbai',
      addressRegion: 'MH',
      postalCode: '400077',
      addressCountry: 'IN',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: SITE_CONFIG.institution,
    email: SITE_CONFIG.email,
  },
  image: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://icon-kjsim.com'}/og-icon2026.svg`],
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://icon-kjsim.com',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <EventSchedule />
      <StatsBar />
      <GalleryPreview />
      <Location />
      <Brochure />
      <Sponsors />
      <ContactForm />
    </>
  );
}
