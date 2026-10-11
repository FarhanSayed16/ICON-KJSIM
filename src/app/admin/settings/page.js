import { getAdminSiteConfig } from '@/app/actions/adminSettings';
import { getEvents } from '@/lib/content';
import AdminSettingsClient from './AdminSettingsClient';

export const metadata = { title: 'Site Settings | ICON Admin' };

export default async function AdminSettingsPage() {
  const [res, events] = await Promise.all([getAdminSiteConfig(), getEvents({})]);
  return (
    <AdminSettingsClient
      initialConfig={res.success ? res.config : null}
      events={events}
    />
  );
}
