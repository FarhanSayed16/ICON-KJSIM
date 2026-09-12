'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { HiOutlineLogout, HiOutlineRefresh, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { logoutAdmin } from '@/app/actions/adminAuth';
import {
  getDashboardStats,
  getRegistrations,
  exportRegistrationsCsv,
} from '@/app/actions/adminData';
import { EVENTS } from '@/lib/data';
import AdminImageCropper from './AdminImageCropper';
import AdminImageTuner from './AdminImageTuner';
import styles from './AdminDashboard.module.css';

const PIE_COLORS = ['#b71c1c', '#d32f2f', '#f44336', '#e57373', '#ffcdd2'];

export default function AdminDashboardClient({ initialStats, initialRegistrationsData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [range, setRange] = useState('all');
  const [stats, setStats] = useState(initialStats);
  const [tableData, setTableData] = useState(initialRegistrationsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(!initialStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardData = useCallback(
    async (page = currentPage, search = searchTerm, event = eventFilter, showToast = false) => {
      setIsRefreshing(true);
      try {
        const [statsRes, regsRes] = await Promise.all([
          getDashboardStats(range),
          getRegistrations(page, 10, search, event),
        ]);

        if (statsRes.success && regsRes.success) {
          setStats(statsRes.data);
          setTableData(regsRes.data);
          if (showToast) toast.success('Dashboard refreshed');
        } else {
          toast.error('Failed to load fresh data');
        }
      } catch {
        toast.error('Network error');
      } finally {
        setIsRefreshing(false);
        setLoading(false);
      }
    },
    [currentPage, searchTerm, eventFilter, range]
  );

  useEffect(() => {
    fetchDashboardData(1, searchTerm, eventFilter, false);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, eventFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDashboardData(1, searchTerm, eventFilter, false);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => {
      fetchDashboardData(currentPage, searchTerm, eventFilter, false);
    }, 30000);
    return () => clearInterval(id);
  }, [fetchDashboardData, currentPage, searchTerm, eventFilter]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const handleExport = async () => {
    const res = await exportRegistrationsCsv(eventFilter);
    if (!res.success) {
      toast.error('Export failed');
      return;
    }
    const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const checkInRate =
    stats?.totalRegistrations > 0
      ? Math.round((stats.totalCheckedIn / stats.totalRegistrations) * 100)
      : 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ marginBottom: '1rem' }}>
        <h1 className={styles.title}>
          Live Operations{' '}
          {isRefreshing && <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Refreshing…</span>}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/broadcast" className="btn-secondary" style={{ padding: '10px 16px' }}>
            Broadcast
          </Link>
          <button
            onClick={handleExport}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}
          >
            <HiOutlineDownload /> CSV
          </button>
          <button
            onClick={() => fetchDashboardData(currentPage, searchTerm, eventFilter, true)}
            className="btn-secondary"
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}
          >
            <HiOutlineRefresh className={isRefreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <HiOutlineLogout />
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', borderRadius: '8px' }}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('tuner')}
          className={activeTab === 'tuner' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', borderRadius: '8px' }}
        >
          Image Tuner
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={activeTab === 'images' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', borderRadius: '8px' }}
        >
          Image Cropper
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['7d', '30d', 'all'].map((r) => (
              <button
                key={r}
                type="button"
                className={range === r ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', borderRadius: 8 }}
                onClick={() => setRange(r)}
              >
                {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'All time'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.statsGrid}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.statCard} style={{ minHeight: 100, opacity: 0.5 }}>
                  Loading…
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Registrations</span>
                <span className={styles.statValue}>{stats.totalRegistrations}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Checked In</span>
                <span className={styles.statValue}>{stats.totalCheckedIn}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Turnout Rate</span>
                <span className={styles.statValue}>{checkInRate}%</span>
              </div>
            </div>
          )}

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3>Registrations by Event</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={stats.registrationsByEvent || []}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip cursor={{ fill: 'rgba(183, 28, 28, 0.05)' }} />
                    <Bar dataKey="count" fill="var(--crimson)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Top Colleges</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.collegeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {(stats.collegeDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Registrations Over Time</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={stats.registrationsByDate || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="count" stroke="#b71c1c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h3>Recent Registrations</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Filter by event"
                >
                  <option value="">All events</option>
                  {EVENTS.map((ev) => (
                    <option key={ev.slug} value={ev.slug}>
                      {ev.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Registration ID</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Events</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(tableData?.registrations || []).map((reg) => (
                    <tr key={reg._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {reg.qrCode}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{reg.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {reg.email}
                        </div>
                      </td>
                      <td>{reg.college}</td>
                      <td>{reg.events?.length || 0} event(s)</td>
                      <td>
                        {reg.checkedIn ? (
                          <span className={`${styles.badge} ${styles.badgeChecked}`}>Checked In</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(tableData?.registrations || []).length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        No registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {(tableData?.totalPages || 0) > 1 && (
              <div className={styles.pagination}>
                <span>
                  Showing {tableData.registrations.length} of {tableData.totalItems} entries
                </span>
                <div className={styles.pageControls}>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage === 1 || isRefreshing}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      fetchDashboardData(p, searchTerm, eventFilter);
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    Page {currentPage} of {tableData.totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage === tableData.totalPages || isRefreshing}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      fetchDashboardData(p, searchTerm, eventFilter);
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'tuner' ? (
        <AdminImageTuner />
      ) : (
        <AdminImageCropper />
      )}

      <style jsx global>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
