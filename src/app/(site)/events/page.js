import EventsClient from './EventsClient';
import { getEvents } from '@/lib/content';

export const metadata = {
  title: 'Events | ICON',
  description:
    'Explore the full lineup of technical, non-technical, and gaming events at ICON — K J Somaiya Institute of Management.',
};

export default async function EventsPage() {
  const events = await getEvents({ activeOnly: true });
  return <EventsClient events={events} />;
}
