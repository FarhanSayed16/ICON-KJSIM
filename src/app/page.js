import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import StatsBar from '@/components/About/StatsBar';
import EventSchedule from '@/components/EventSchedule/EventSchedule';
import GalleryPreview from '@/components/GalleryPreview/GalleryPreview';
import Location from '@/components/Location/Location';
import Brochure from '@/components/Brochure/Brochure';
import Sponsors from '@/components/Sponsors/Sponsors';
import ContactForm from '@/components/ContactForm/ContactForm';
import { getEvents, getSiteConfig } from '@/lib/content';

export default async function Home() {
  const [siteConfig, events] = await Promise.all([
    getSiteConfig(),
    getEvents({ activeOnly: true }),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${siteConfig.name} — ${siteConfig.theme}`,
    description: siteConfig.description,
    startDate: siteConfig.eventDates?.start,
    endDate: siteConfig.eventDates?.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: siteConfig.venue?.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.venue?.address,
        addressLocality: 'Mumbai',
        addressRegion: 'MH',
        postalCode: '400077',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: siteConfig.institution,
      email: siteConfig.email,
    },
    image: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://icon.somaiya.edu'}/og-icon2026.svg`],
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://icon.somaiya.edu',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero siteConfig={siteConfig} eventCount={events.length} />
      <About />
      <EventSchedule events={events} />
      <StatsBar />
      <GalleryPreview />
      <Location />
      <Brochure />
      <Sponsors />
      <ContactForm />
    </>
  );
}
