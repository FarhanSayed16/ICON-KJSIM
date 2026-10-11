import AdminDashboardClient from './AdminDashboardClient';
import {
  getDashboardStats,
  getRegistrations,
  getEventOpsSummary,
  getPaymentStats,
} from '@/app/actions/adminData';
import { getEvents } from '@/lib/content';

export const metadata = { title: 'Admin Dashboard | ICON' };

/** Ensure props are plain JSON (no Date/ObjectId) for RSC client boundary. */
function toPlain(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

export default async function AdminPage() {
  const [statsRes, regsRes, events, opsRes, payRes] = await Promise.all([
    getDashboardStats(),
    getRegistrations(1, 15, '', '', ''),
    getEvents({}),
    getEventOpsSummary(),
    getPaymentStats(),
  ]);

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
