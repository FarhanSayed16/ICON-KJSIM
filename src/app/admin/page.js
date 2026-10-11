import AdminDashboardClient from './AdminDashboardClient';
import {
  getDashboardStats,
  getRegistrations,
  getEventOpsSummary,
  getPaymentStats,
} from '@/app/actions/adminData';
import { getEvents } from '@/lib/content';
import { toPlain } from '@/lib/plain';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Dashboard | ICON' };

export default async function AdminPage() {
  let statsRes, regsRes, events, opsRes, payRes;
  try {
    [statsRes, regsRes, events, opsRes, payRes] = await Promise.all([
      getDashboardStats(),
      getRegistrations(1, 15, '', '', ''),
      getEvents({}),
      getEventOpsSummary(),
      getPaymentStats(),
    ]);
  } catch (err) {
    console.error('Admin page data fetch error:', err);
    statsRes = { success: false };
    regsRes = { success: false };
    events = [];
    opsRes = { success: false };
    payRes = { success: false };
  }

  const stats = toPlain(
    statsRes.success
      ? statsRes.data
      : {
          totalRegistrations: 0,
          totalCheckedIn: 0,
          registrationsByEvent: [],
          collegeDistribution: [],
          registrationsByDate: [],
          checkinTimeline: [],
        }
  );

  const regs = toPlain(
    regsRes.success
      ? regsRes.data
      : { registrations: [], totalPages: 0, currentPage: 1, totalItems: 0 }
  );

  const safeEvents = toPlain(
    (events || []).map((e) => ({
      _id: e._id || null,
      name: e.name,
      slug: e.slug,
      category: e.category,
      registrationFee: Number(e.registrationFee) || 0,
      isActive: e.isActive !== false,
      isRegistrationOpen: e.isRegistrationOpen !== false,
    }))
  );

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialRegistrationsData={regs}
      events={safeEvents}
      eventOps={toPlain(opsRes.success ? opsRes.data : [])}
      paymentStats={toPlain(payRes.success ? payRes.data : null)}
    />
  );
}
