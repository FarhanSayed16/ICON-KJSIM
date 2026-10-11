import { listAdminEvents } from '@/app/actions/adminEvents';
import AdminEventsClient from './AdminEventsClient';

export const metadata = { title: 'Manage Events | ICON Admin' };

export default async function AdminEventsPage() {
  const res = await listAdminEvents();
  return <AdminEventsClient initialEvents={res.success ? res.events : []} />;
}
