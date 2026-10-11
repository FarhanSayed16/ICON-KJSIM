import EventsClient from './EventsClient';
import { getEvents } from '@/lib/content';

export const metadata = {
  title: 'Events | ICON',
  description:
    'Explore technical events, sports, indoor games & esports, and the free Mini-Games Zone at ICON — K J Somaiya Institute of Management.',
};

export default async function EventsPage() {
  const events = await getEvents({ activeOnly: true });
  return <EventsClient events={events} />;
}
