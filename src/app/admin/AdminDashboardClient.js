'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Legend,
} from 'recharts';
import { HiOutlineRefresh, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  getDashboardStats,
  getRegistrations,
  exportRegistrationsCsv,
  setPaymentStatus,
} from '@/app/actions/adminData';
import AdminImageCropper from './AdminImageCropper';
import AdminImageTuner from './AdminImageTuner';
import styles from './AdminDashboard.module.css';

const PIE_COLORS = ['#b71c1c', '#d32f2f', '#ef5350', '#e57373', '#ffcdd2', '#9a1818'];
const PAGE_SIZE = 15;

function paymentBadgeClass(status) {
  if (status === 'verified') return styles.badgeVerified;
  if (status === 'rejected') return styles.badgeRejected;
  if (status === 'not_required') return styles.badgeNeutral;
  return styles.badgePending;
}

export default function AdminDashboardClient({
  initialStats,
  initialRegistrationsData,
  events = [],
  eventOps = [],
  paymentStats = null,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toolTab, setToolTab] = useState('tuner');
  const [range, setRange] = useState('all');
  const [stats, setStats] = useState(initialStats);
  const [tableData, setTableData] = useState(initialRegistrationsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(!initialStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const eventNameBySlug = useMemo(() => {
    const map = {};
    for (const ev of events) map[ev.slug] = ev.name;
    return map;
  }, [events]);

  const fetchDashboardData = useCallback(
    async (
      page = currentPage,
      search = searchTerm,
      event = eventFilter,
      pay = paymentFilter,
      showToast = false
    ) => {
      setIsRefreshing(true);
      try {
        const [statsRes, regsRes] = await Promise.all([
          getDashboardStats(range),
          getRegistrations(page, PAGE_SIZE, search, event, pay),
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
    [currentPage, searchTerm, eventFilter, paymentFilter, range]
  );

  useEffect(() => {
    fetchDashboardData(1, searchTerm, eventFilter, paymentFilter, false);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, eventFilter, paymentFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDashboardData(1, searchTerm, eventFilter, paymentFilter, false);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchDashboardData(currentPage, searchTerm, eventFilter, paymentFilter, false);
    }, 30000);
    return () => clearInterval(id);
  }, [fetchDashboardData, currentPage, searchTerm, eventFilter, paymentFilter]);

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

  const openEventRegistrations = (slug) => {
    setEventFilter(slug);
    setActiveTab('registrations');
  };

  const checkInRate =
    stats?.totalRegistrations > 0
      ? Math.round((stats.totalCheckedIn / stats.totalRegistrations) * 100)
      : 0;

  const pendingPay =
    paymentStats?.pending ??
    eventOps.reduce((sum, row) => sum + (row.pending || 0), 0);
  const verifiedPay =
    paymentStats?.verified ??
    eventOps.reduce((sum, row) => sum + (row.verified || 0), 0);

  const selectedEventName = eventFilter
    ? eventNameBySlug[eventFilter] || eventFilter
    : null;

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Live Operations
            {isRefreshing ? (
              <span style={{ fontSize: '0.85rem', opacity: 0.55, fontWeight: 500, marginLeft: 10 }}>
                Refreshing…
              </span>
            ) : null}
          </h1>
          <p className={styles.pageSub}>
            Stats, per-event breakdown, and payment verification — kept in separate views.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionBtn} onClick={handleExport}>
            <HiOutlineDownload size={16} />
            Export CSV
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            disabled={isRefreshing}
            onClick={() =>
              fetchDashboardData(currentPage, searchTerm, eventFilter, paymentFilter, true)
            }
          >
            <HiOutlineRefresh size={16} className={isRefreshing ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Operations sections">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'events', label: 'By Event' },
          { id: 'registrations', label: 'Registrations' },
          { id: 'tools', label: 'Image Tools' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className={styles.rangeRow}>
            {[
              { id: '7d', label: 'Last 7 days' },
              { id: '30d', label: 'Last 30 days' },
              { id: 'all', label: 'All time' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`${styles.chip} ${range === r.id ? styles.chipActive : ''}`}
                onClick={() => setRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.statsGrid}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.statCard} style={{ opacity: 0.5 }}>
                  Loading…
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total registrations</span>
                <span className={styles.statValue}>{stats.totalRegistrations}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Checked in</span>
                <span className={styles.statValue}>{stats.totalCheckedIn}</span>
                <span className={styles.statHint}>{checkInRate}% turnout</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Payment pending</span>
                <span className={styles.statValue}>{pendingPay}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Payment verified</span>
                <span className={styles.statValue}>{verifiedPay}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Active events</span>
                <span className={styles.statValue}>
                  {eventOps.filter((e) => e.isActive !== false).length || events.length}
                </span>
              </div>
            </div>
          )}

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3 className={styles.sectionTitle}>Registrations by event</h3>
              <div className={styles.chartBody}>
                <ResponsiveContainer>
                  <BarChart
                    data={stats.registrationsByEvent || []}
                    margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-28}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip cursor={{ fill: 'rgba(183, 28, 28, 0.05)' }} />
                    <Bar dataKey="count" name="Registrations" fill="#b71c1c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.sectionTitle}>Top colleges</h3>
              <div className={styles.chartBody} style={{ height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.collegeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {(stats.collegeDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.legend}>
                {(stats.collegeDistribution || []).map((item, index) => (
                  <div key={item.name || index} className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className={styles.legendName}>{item.name || 'Unknown'}</span>
                    <span className={styles.legendValue}>{item.value}</span>
                  </div>
                ))}
                {(stats.collegeDistribution || []).length === 0 && (
                  <span className={styles.subCell}>No college data yet.</span>
                )}
              </div>
            </div>

            <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
              <h3 className={styles.sectionTitle}>Registrations over time</h3>
              <div className={styles.chartBody}>
                <ResponsiveContainer>
                  <LineChart data={stats.registrationsByDate || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Registrations"
                      stroke="#b71c1c"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <section>
          <div className={styles.panelHeader} style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 4 }}>
                Event breakdown
              </h2>
              <p className={styles.pageSub}>
                Each card shows totals for that event only. Click a card to open its registrations.
              </p>
            </div>
          </div>

          {eventOps.length === 0 ? (
            <div className={styles.panel}>
              <p className={styles.empty}>No events found. Add events in the Events manager.</p>
            </div>
          ) : (
            <div className={styles.eventGrid}>
              {eventOps.map((row) => (
                <button
                  key={row.slug}
                  type="button"
                  className={`${styles.eventCard} ${
                    eventFilter === row.slug ? styles.eventCardActive : ''
                  }`}
                  onClick={() => openEventRegistrations(row.slug)}
                >
                  <div className={styles.eventCardTop}>
                    <div>
                      <h3 className={styles.eventName}>{row.name}</h3>
                      <div className={styles.eventMeta}>
                        {row.slug}
                        {typeof row.fee === 'number' ? ` · ₹${row.fee}` : ''}
                        {row.isActive === false ? ' · inactive' : ''}
                      </div>
                    </div>
                  </div>
                  <div className={styles.eventMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Total</span>
                      <span className={styles.metricValue}>{row.total}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Pending</span>
                      <span className={`${styles.metricValue} ${styles.metricWarn}`}>
                        {row.pending}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Verified</span>
                      <span className={`${styles.metricValue} ${styles.metricOk}`}>
                        {row.verified}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Checked in</span>
                      <span className={styles.metricValue}>{row.checkedIn}</span>
                    </div>
                  </div>
                  <div className={styles.eventCardFooter}>
                    <span>
                      {row.total > 0
                        ? `${Math.round((row.checkedIn / row.total) * 100)}% check-in`
                        : 'No regs yet'}
                    </span>
                    <span className={styles.viewLink}>View list →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'registrations' && (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 4 }}>
                Registrations desk
              </h2>
              <p className={styles.pageSub}>
                {selectedEventName
                  ? `Filtered to: ${selectedEventName}`
                  : 'All events — use filters to narrow by event or payment status.'}
              </p>
            </div>
            <div className={styles.filters}>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className={styles.searchInput}
                aria-label="Filter by event"
              >
                <option value="">All events</option>
                {events.map((ev) => (
                  <option key={ev.slug} value={ev.slug}>
                    {ev.name}
                  </option>
                ))}
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className={styles.searchInput}
                aria-label="Filter by payment"
              >
                <option value="">All payments</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="not_required">Not required</option>
              </select>
              <input
                type="text"
                placeholder="Search name, email, mobile, UTR, ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                style={{ minWidth: 220 }}
              />
              {(eventFilter || paymentFilter || searchTerm) && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    setEventFilter('');
                    setPaymentFilter('');
                    setSearchTerm('');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>College</th>
                  <th>Events</th>
                  <th>Amount / UTR</th>
                  <th>Payment</th>
                  <th>Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(tableData?.registrations || []).map((reg) => (
                  <tr key={reg._id}>
                    <td className={styles.mono}>{reg.qrCode}</td>
                    <td>
                      <div className={styles.nameCell}>{reg.name}</div>
                      {reg.department ? (
                        <div className={styles.subCell}>{reg.department}</div>
                      ) : null}
                    </td>
                    <td>
                      <div className={styles.subCell}>{reg.email}</div>
                      <div className={styles.subCell}>{reg.mobile || '—'}</div>
                    </td>
                    <td>{reg.college || '—'}</td>
                    <td>
                      <div className={styles.eventTags}>
                        {(reg.eventSlug
                          ? [reg.eventSlug]
                          : reg.events || []
                        ).map((slug) => (
                          <span key={slug} className={styles.eventTag}>
                            {eventNameBySlug[slug] || slug}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div>₹{reg.payableAmount ?? 0}</div>
                      <div className={styles.mono}>{reg.paymentTxnId || '—'}</div>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${paymentBadgeClass(reg.paymentStatus)}`}
                      >
                        {reg.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      {reg.paymentScreenshotUrl ? (
                        <a
                          href={reg.paymentScreenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.proofLink}
                        >
                          View proof
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        {reg.paymentStatus !== 'verified' && (
                          <button
                            type="button"
                            className={`${styles.pageBtn} ${styles.verifyBtn}`}
                            onClick={async () => {
                              const res = await setPaymentStatus(reg._id, 'verified');
                              if (res.success) {
                                toast.success(res.message);
                                fetchDashboardData(
                                  currentPage,
                                  searchTerm,
                                  eventFilter,
                                  paymentFilter
                                );
                              } else toast.error(res.message || 'Failed');
                            }}
                          >
                            Verify
                          </button>
                        )}
                        {reg.paymentStatus !== 'rejected' && (
                          <button
                            type="button"
                            className={`${styles.pageBtn} ${styles.rejectBtn}`}
                            onClick={async () => {
                              const note = prompt('Rejection note (optional)') || '';
                              const res = await setPaymentStatus(reg._id, 'rejected', note);
                              if (res.success) {
                                toast.success(res.message);
                                fetchDashboardData(
                                  currentPage,
                                  searchTerm,
                                  eventFilter,
                                  paymentFilter
                                );
                              } else toast.error(res.message || 'Failed');
                            }}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(tableData?.registrations || []).length === 0 && (
                  <tr>
                    <td colSpan={9} className={styles.empty}>
                      No registrations match these filters.
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
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage === 1 || isRefreshing}
                  onClick={() => {
                    const p = currentPage - 1;
                    setCurrentPage(p);
                    fetchDashboardData(p, searchTerm, eventFilter, paymentFilter);
                  }}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {tableData.totalPages}
                </span>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage === tableData.totalPages || isRefreshing}
                  onClick={() => {
                    const p = currentPage + 1;
                    setCurrentPage(p);
                    fetchDashboardData(p, searchTerm, eventFilter, paymentFilter);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'tools' && (
        <section className={styles.panel}>
          <div className={styles.toolsSplit}>
            <button
              type="button"
              className={`${styles.chip} ${toolTab === 'tuner' ? styles.chipActive : ''}`}
              onClick={() => setToolTab('tuner')}
            >
              Image Tuner
            </button>
            <button
              type="button"
              className={`${styles.chip} ${toolTab === 'cropper' ? styles.chipActive : ''}`}
              onClick={() => setToolTab('cropper')}
            >
              Image Cropper
            </button>
          </div>
          {toolTab === 'tuner' ? <AdminImageTuner /> : <AdminImageCropper />}
        </section>
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
