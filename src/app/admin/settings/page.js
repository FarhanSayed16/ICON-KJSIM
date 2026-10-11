import { getAdminSiteConfig } from '@/app/actions/adminSettings';
import { getEvents } from '@/lib/content';
import AdminSettingsClient from './AdminSettingsClient';
import { toPlain } from '@/lib/plain';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Site Settings | ICON Admin' };

export default async function AdminSettingsPage() {
  let config = null;
  let events = [];
  try {
    const [res, evts] = await Promise.all([getAdminSiteConfig(), getEvents({})]);
    if (res.success) config = toPlain(res.config);
    events = toPlain(
      (evts || []).map((e) => ({
        _id: e._id || null,
        name: e.name,
        slug: e.slug,
        category: e.category,
        registrationFee: Number(e.registrationFee) || 0,
        isActive: e.isActive !== false,
      }))
    );
  } catch (err) {
    console.error('Admin settings page fetch error:', err);
  }
  return <AdminSettingsClient initialConfig={config} events={events} />;
}
