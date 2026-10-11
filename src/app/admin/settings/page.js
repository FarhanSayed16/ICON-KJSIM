import { getAdminSiteConfig } from '@/app/actions/adminSettings';
import AdminSettingsClient from './AdminSettingsClient';

export const metadata = { title: 'Site Settings | ICON Admin' };

export default async function AdminSettingsPage() {
  const res = await getAdminSiteConfig();
  return <AdminSettingsClient initialConfig={res.success ? res.config : null} />;
}
