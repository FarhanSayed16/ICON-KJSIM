import AdminDashboardClient from './AdminDashboardClient';
import { getDashboardStats, getRegistrations } from '@/app/actions/adminData';

export const metadata = { title: 'Admin Dashboard | ICON 2026' };

export default async function AdminPage() {
  const [statsRes, regsRes] = await Promise.all([
    getDashboardStats(),
    getRegistrations(1, 10, '')
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
    />
  );
}
