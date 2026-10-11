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
} from 'recharts';
import { HiOutlineRefresh, HiOutlineDownload, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  getDashboardStats,
  getRegistrations,
  exportRegistrationsCsv,
  setPaymentStatus,
  getEventOpsSummary,
  getPaymentStats,
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

function getPrimaryEventSlug(reg) {
  return reg.eventSlug || reg.events?.[0] || '';
}

function isLegacyMultiEvent(reg) {
  return Array.isArray(reg.events) && reg.events.length > 1;
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
  const [opsRows, setOpsRows] = useState(eventOps);
  const [payStats, setPayStats] = useState(paymentStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(!initialStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [proofReg, setProofReg] = useState(null);
  const [actionBusy, setActionBusy] = useState(null);
  const [regsVisited, setRegsVisited] = useState(false);

  const eventNameBySlug = useMemo(() => {
    const map = {};
    for (const ev of events) map[ev.slug] = ev.name;
    return map;
  }, [events]);

  const pendingPay =
    payStats?.pending ??
    opsRows.reduce((sum, row) => sum + (row.pending || 0), 0);
  const verifiedPay =
    payStats?.verified ??
    opsRows.reduce((sum, row) => sum + (row.verified || 0), 0);

  const sortedEventOps = useMemo(() => {
    return [...opsRows]
      .filter((row) => row.isActive !== false || (row.total || 0) > 0)
      .sort((a, b) => {
        if ((b.pending || 0) !== (a.pending || 0)) return (b.pending || 0) - (a.pending || 0);
        if ((b.total || 0) !== (a.total || 0)) return (b.total || 0) - (a.total || 0);
        return (a.name || '').localeCompare(b.name || '');
      });
  }, [opsRows]);

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
        const [statsRes, regsRes, opsRes, payRes] = await Promise.all([
          getDashboardStats(range),
          getRegistrations(page, PAGE_SIZE, search, event, pay),
          getEventOpsSummary(),
          getPaymentStats(),
        ]);

        if (statsRes.success && regsRes.success) {
          setStats(statsRes.data);
          setTableData(regsRes.data);
          if (opsRes.success) setOpsRows(opsRes.data || []);
          if (payRes.success) setPayStats(payRes.data);
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

  // Proof panel: Escape to close + lock body scroll
  useEffect(() => {
    if (!proofReg) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setProofReg(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [proofReg]);

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

  const openEventRegistrations = (row) => {
    setEventFilter(row.slug);
    setPaymentFilter((row.pending || 0) > 0 ? 'pending' : '');
    setRegsVisited(true);
    setActiveTab('registrations');
  };

  const openReviewPending = () => {
    setEventFilter('');
    setPaymentFilter('pending');
    setRegsVisited(true);
    setActiveTab('registrations');
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'registrations' && !regsVisited) {
      setPaymentFilter('pending');
      setRegsVisited(true);
    }
    setActiveTab(tabId);
  };

  const applyPaymentStatus = async (regId, status) => {
    setActionBusy(`${regId}-${status}`);
    try {
      let note = '';
      if (status === 'rejected') {
        note = prompt('Rejection note (optional)') || '';
      }
      const res = await setPaymentStatus(regId, status, note);
      if (res.success) {
        toast.success(res.message);
        setProofReg(null);
        fetchDashboardData(currentPage, searchTerm, eventFilter, paymentFilter);
      } else {
        toast.error(res.message || 'Failed');
      }
    } finally {
      setActionBusy(null);
    }
  };

  const checkInRate =
    stats?.totalRegistrations > 0
      ? Math.round((stats.totalCheckedIn / stats.totalRegistrations) * 100)
      : 0;

  const selectedEventName = eventFilter
    ? eventNameBySlug[eventFilter] || eventFilter
    : null;

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Live Operations
            {isRefreshing ? <span className={styles.refreshHint}>Refreshing…</span> : null}
          </h1>
          <p className={styles.pageSub}>
            Payment verify desk, per-event counts, and live stats.
          </p>
        </div>
        <div className={styles.headerActions}>
          {pendingPay > 0 && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={openReviewPending}
            >
              Review pending ({pendingPay})
            </button>
          )}
          <button type="button" className={styles.actionBtn} onClick={handleExport}>
            <HiOutlineDownload size={16} />
            CSV
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
          {
            id: 'registrations',
            label: pendingPay > 0 ? `Verify (${pendingPay})` : 'Verify desk',
          },
          { id: 'tools', label: 'Image Tools' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(tab.id)}
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
            {pendingPay > 0 && (
              <button type="button" className={styles.chipWarn} onClick={openReviewPending}>
                Review pending ({pendingPay})
              </button>
            )}
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
                <span className={styles.statLabel}>Registrations</span>
                <span className={styles.statValue}>{stats.totalRegistrations}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Checked in</span>
                <span className={styles.statValue}>{stats.totalCheckedIn}</span>
                <span className={styles.statHint}>{checkInRate}% turnout</span>
              </div>
              <button
                type="button"
                className={`${styles.statCard} ${styles.statCardAction}`}
                onClick={openReviewPending}
              >
                <span className={styles.statLabel}>Pending pay</span>
                <span className={`${styles.statValue} ${styles.statWarn}`}>{pendingPay}</span>
                <span className={styles.statHint}>Tap to review →</span>
              </button>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Verified</span>
                <span className={`${styles.statValue} ${styles.statOk}`}>{verifiedPay}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Events</span>
                <span className={styles.statValue}>
                  {opsRows.filter((e) => e.isActive !== false).length || events.length}
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
              <div className={styles.chartBody} style={{ height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.collegeDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={76}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {(stats.collegeDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
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
              <div className={styles.chartBody} style={{ height: 240 }}>
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
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 4 }}>
                Event breakdown
              </h2>
              <p className={styles.pageSub}>
                Sorted by pending payments. Click a card to open that event’s verify desk.
              </p>
            </div>
          </div>

          {sortedEventOps.length === 0 ? (
            <div className={styles.panel}>
              <p className={styles.empty}>No events found. Add events in the Events manager.</p>
            </div>
          ) : (
            <div className={styles.eventGrid}>
              {sortedEventOps.map((row) => (
                <button
                  key={row.slug}
                  type="button"
                  className={`${styles.eventCard} ${
                    eventFilter === row.slug ? styles.eventCardActive : ''
                  } ${(row.pending || 0) > 0 ? styles.eventCardPending : ''}`}
                  onClick={() => openEventRegistrations(row)}
                >
                  <div className={styles.eventCardTop}>
                    <div>
                      <h3 className={styles.eventName}>{row.name}</h3>
                      <div className={styles.eventMeta}>
                        {typeof row.fee === 'number' ? `₹${row.fee}` : '—'}
                        {row.isActive === false ? ' · inactive' : ''}
                      </div>
                    </div>
                    {(row.pending || 0) > 0 && (
                      <span className={styles.pendingBadge}>{row.pending} pending</span>
                    )}
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
                      <span className={styles.metricLabel}>In</span>
                      <span className={styles.metricValue}>{row.checkedIn}</span>
                    </div>
                  </div>
                  <div className={styles.eventCardFooter}>
                    <span>
                      {row.total > 0
                        ? `${Math.round((row.checkedIn / row.total) * 100)}% check-in`
                        : 'No regs yet'}
                    </span>
                    <span className={styles.viewLink}>
                      {(row.pending || 0) > 0 ? 'Review →' : 'Open →'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'registrations' && (
        <section className={styles.desk}>
          <div className={styles.deskSticky}>
            <div className={styles.deskTitleRow}>
              <div>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 4 }}>
                  Payment verify desk
                </h2>
                <p className={styles.pageSub}>
                  {selectedEventName
                    ? `${selectedEventName}${paymentFilter ? ` · ${paymentFilter}` : ''}`
                    : paymentFilter
                      ? `All events · ${paymentFilter}`
                      : 'All events · all payments'}
                </p>
              </div>
              {pendingPay > 0 && (
                <span className={styles.pendingChip}>{pendingPay} pending overall</span>
              )}
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
                className={`${styles.searchInput} ${styles.searchWide}`}
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
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className={styles.deskList}>
            {(tableData?.registrations || []).length === 0 && (
              <div className={styles.empty}>
                {paymentFilter === 'pending'
                  ? 'No pending payments for this filter. Clear filters to see all.'
                  : 'No registrations match these filters.'}
              </div>
            )}

            {(tableData?.registrations || []).map((reg) => {
              const slug = getPrimaryEventSlug(reg);
              const eventName = eventNameBySlug[slug] || slug || 'Unknown event';
              const legacy = isLegacyMultiEvent(reg);

              return (
                <article key={reg._id} className={styles.deskRow}>
                  <div className={styles.deskPerson}>
                    <div className={styles.nameCell}>{reg.name}</div>
                    <div className={styles.subCell}>{reg.college || '—'}</div>
                    <div className={styles.subCell}>
                      {reg.email}
                      {reg.mobile ? ` · ${reg.mobile}` : ''}
                    </div>
                    <div className={styles.monoTiny}>{reg.qrCode}</div>
                  </div>

                  <div className={styles.deskEvent}>
                    <div className={styles.eventLine}>
                      <span className={styles.eventTag}>{eventName}</span>
                      {legacy && <span className={styles.legacyBadge}>legacy</span>}
                    </div>
                    <div className={styles.feeLine}>
                      <strong>₹{reg.payableAmount ?? 0}</strong>
                      <span className={styles.mono}>{reg.paymentTxnId || 'No UTR'}</span>
                    </div>
                  </div>

                  <div className={styles.deskStatus}>
                    <span className={`${styles.badge} ${paymentBadgeClass(reg.paymentStatus)}`}>
                      {reg.paymentStatus || 'pending'}
                    </span>
                    {reg.paymentScreenshotUrl ? (
                      <button
                        type="button"
                        className={styles.proofThumbBtn}
                        onClick={() => setProofReg(reg)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reg.paymentScreenshotUrl}
                          alt="Payment proof"
                          className={styles.proofThumb}
                        />
                        <span>Proof</span>
                      </button>
                    ) : (
                      <span className={styles.subCell}>No proof</span>
                    )}
                  </div>

                  <div className={styles.deskActions}>
                    {reg.paymentStatus !== 'verified' && (
                      <button
                        type="button"
                        className={styles.verifySolid}
                        disabled={actionBusy === `${reg._id}-verified`}
                        onClick={() => applyPaymentStatus(reg._id, 'verified')}
                      >
                        Verify
                      </button>
                    )}
                    {reg.paymentStatus !== 'rejected' && (
                      <button
                        type="button"
                        className={styles.rejectSolid}
                        disabled={actionBusy === `${reg._id}-rejected`}
                        onClick={() => applyPaymentStatus(reg._id, 'rejected')}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {(tableData?.totalPages || 0) > 1 && (
            <div className={styles.pagination}>
              <span>
                Showing {tableData.registrations.length} of {tableData.totalItems}
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
                  {currentPage} / {tableData.totalPages}
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

      {proofReg && (
        <div className={styles.proofOverlay} onClick={() => setProofReg(null)} role="presentation">
          <div
            className={styles.proofPanel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="proof-title"
          >
            <div className={styles.proofHeader}>
              <div>
                <h3 id="proof-title" className={styles.sectionTitle} style={{ marginBottom: 4 }}>
                  Payment proof
                </h3>
                <p className={styles.pageSub}>{proofReg.name}</p>
              </div>
              <button
                type="button"
                className={styles.iconClose}
                onClick={() => setProofReg(null)}
                aria-label="Close"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className={styles.proofMeta}>
              <div>
                <span className={styles.metaLabel}>Event</span>
                <span>
                  {eventNameBySlug[getPrimaryEventSlug(proofReg)] || getPrimaryEventSlug(proofReg)}
                  {isLegacyMultiEvent(proofReg) && (
                    <span className={styles.legacyBadge}> legacy</span>
                  )}
                </span>
              </div>
              <div>
                <span className={styles.metaLabel}>Amount</span>
                <span>₹{proofReg.payableAmount ?? 0}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>UTR</span>
                <span className={styles.mono}>{proofReg.paymentTxnId || '—'}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>Status</span>
                <span
                  className={`${styles.badge} ${paymentBadgeClass(proofReg.paymentStatus)}`}
                >
                  {proofReg.paymentStatus || 'pending'}
                </span>
              </div>
              <div>
                <span className={styles.metaLabel}>Contact</span>
                <span className={styles.subCell}>
                  {proofReg.email}
                  {proofReg.mobile ? ` · ${proofReg.mobile}` : ''}
                </span>
              </div>
              <div>
                <span className={styles.metaLabel}>Reg ID</span>
                <span className={styles.mono}>{proofReg.qrCode}</span>
              </div>
            </div>

            {proofReg.paymentScreenshotUrl ? (
              <a
                href={proofReg.paymentScreenshotUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.proofImageWrap}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofReg.paymentScreenshotUrl}
                  alt="Payment screenshot"
                  className={styles.proofImage}
                />
              </a>
            ) : (
              <p className={styles.empty}>No screenshot uploaded.</p>
            )}

            <div className={styles.proofActions}>
              {proofReg.paymentStatus !== 'verified' && (
                <button
                  type="button"
                  className={styles.verifySolid}
                  disabled={actionBusy === `${proofReg._id}-verified`}
                  onClick={() => applyPaymentStatus(proofReg._id, 'verified')}
                >
                  Verify payment
                </button>
              )}
              {proofReg.paymentStatus !== 'rejected' && (
                <button
                  type="button"
                  className={styles.rejectSolid}
                  disabled={actionBusy === `${proofReg._id}-rejected`}
                  onClick={() => applyPaymentStatus(proofReg._id, 'rejected')}
                >
                  Reject
                </button>
              )}
              {proofReg.paymentScreenshotUrl && (
                <a
                  href={proofReg.paymentScreenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.actionBtn}
                >
                  Open full size
                </a>
              )}
            </div>
          </div>
        </div>
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
