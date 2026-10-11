import AdminDashboardClient from './AdminDashboardClient';
import {
  getDashboardStats,
  getRegistrations,
  getEventOpsSummary,
  getPaymentStats,
} from '@/app/actions/adminData';
import { getEvents } from '@/lib/content';

export const metadata = { title: 'Admin Dashboard | ICON' };

export default async function AdminPage() {
  const [statsRes, regsRes, events, opsRes, payRes] = await Promise.all([
    getDashboardStats(),
    getRegistrations(1, 15, '', '', ''),
    getEvents({}),
    getEventOpsSummary(),
    getPaymentStats(),
  ]);

  const stats = statsRes.success
    ? statsRes.data
    : {
        totalRegistrations: 0,
        totalCheckedIn: 0,
        registrationsByEvent: [],
        collegeDistribution: [],
        registrationsByDate: [],
        checkinTimeline: [],
      };
  const regs = regsRes.success
    ? regsRes.data
    : { registrations: [], totalPages: 0, currentPage: 1, totalItems: 0 };

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialRegistrationsData={regs}
      events={events}
      eventOps={opsRes.success ? opsRes.data : []}
      paymentStats={payRes.success ? payRes.data : null}
    />
  );
}
