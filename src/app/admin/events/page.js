import { listAdminEvents } from '@/app/actions/adminEvents';
import AdminEventsClient from './AdminEventsClient';
import { toPlain } from '@/lib/plain';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Manage Events | ICON Admin' };

export default async function AdminEventsPage() {
  let events = [];
  try {
    const res = await listAdminEvents();
    if (res.success) events = toPlain(res.events || []);
  } catch (err) {
    console.error('Admin events page fetch error:', err);
  }
  return <AdminEventsClient initialEvents={events} />;
}
