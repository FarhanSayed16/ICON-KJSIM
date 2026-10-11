'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { saveSiteConfig } from '@/app/actions/adminSettings';
import styles from '../AdminCms.module.css';

function uniqueFees(events) {
  const map = new Map();
  for (const ev of events) {
    const fee = Number(ev.registrationFee) || 0;
    if (fee <= 0) continue;
    if (!map.has(fee)) map.set(fee, []);
    map.get(fee).push(ev.name);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([fee, names]) => ({ fee, names }));
}

export default function AdminSettingsClient({ initialConfig, events = [] }) {
  const c = initialConfig || {};
  const [form, setForm] = useState({
    name: c.name || '',
    theme: c.theme || '',
    slogan: c.slogan || '',
    tagline: c.tagline || '',
    description: c.description || '',
    institution: c.institution || '',
    university: c.university || '',
    eventStart: c.eventDates?.start || '',
    eventEnd: c.eventDates?.end || '',
    countdownTarget: c.countdownTarget || '',
    venueName: c.venue?.name || '',
    venueAddress: c.venue?.address || '',
    mapsQuery: c.venue?.mapsQuery || '',
    mapsEmbed: c.venue?.mapsEmbed || '',
    email: c.email || '',
    edition: c.edition || '2026',
    registrationOpen: c.registrationOpen !== false,
  });
  const [paymentQrs, setPaymentQrs] = useState(
    c.paymentQrs?.length
      ? c.paymentQrs
      : [
          { amount: 149, label: '₹149', qrImageUrl: '', payUrl: '' },
          { amount: 299, label: '₹299', qrImageUrl: '', payUrl: '' },
          { amount: 499, label: '₹499', qrImageUrl: '', payUrl: '' },
        ]
  );
  const [qrFiles, setQrFiles] = useState({});
  const [saving, setSaving] = useState(false);

  const feeGroups = useMemo(() => uniqueFees(events), [events]);

  const missingQrFees = useMemo(() => {
    const covered = new Set(
      paymentQrs
        .filter((t) => Number(t.amount) > 0 && (t.qrImageUrl || qrFiles[t.amount]))
        .map((t) => Number(t.amount))
    );
    return feeGroups.filter((g) => !covered.has(g.fee));
  }, [feeGroups, paymentQrs, qrFiles]);

  const addTierForFee = (fee) => {
    if (paymentQrs.some((t) => Number(t.amount) === fee)) {
      toast('Tier for ₹' + fee + ' already exists — upload the QR image.');
      return;
    }
    setPaymentQrs([
      ...paymentQrs,
      { amount: fee, label: `₹${fee}`, qrImageUrl: '', payUrl: '' },
    ]);
    toast.success(`Added QR tier for ₹${fee}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'registrationOpen') fd.set(k, v ? 'true' : 'false');
        else fd.set(k, v ?? '');
      });
      fd.set('paymentQrsJson', JSON.stringify(paymentQrs));
      Object.entries(qrFiles).forEach(([amount, file]) => {
        if (file) fd.set(`qrFile_${amount}`, file);
      });
      const res = await saveSiteConfig(fd);
      if (res.success) {
        toast.success('Settings saved');
        setQrFiles({});
      } else toast.error(res.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Site settings</h1>
          <p className={styles.sub}>
            Fest identity, registration switch, and Somaiya payment QR tiers.
          </p>
        </div>
      </header>

      <form onSubmit={onSubmit}>
        <section className={styles.card} style={{ marginBottom: '1rem' }}>
          <p className={styles.sectionLabel}>Fest identity</p>
          <h2 className={styles.cardTitle}>Branding & copy</h2>
          <p className={styles.cardHint}>Shown on the public site hero and metadata.</p>
          <div className={styles.grid}>
            <label className={styles.field}>
              Fest name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className={styles.field}>
              Theme
              <input
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Slogan
              <input
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Tagline
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </label>
            <label className={`${styles.field} ${styles.gridFull}`}>
              Description
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Edition year
              <input
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Contact email
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className={styles.card} style={{ marginBottom: '1rem' }}>
          <p className={styles.sectionLabel}>Schedule</p>
          <h2 className={styles.cardTitle}>Dates & registration</h2>
          <p className={styles.cardHint}>Master switch closes all event registrations at once.</p>
          <div className={styles.grid}>
            <label className={styles.field}>
              Event start
              <input
                value={form.eventStart}
                onChange={(e) => setForm({ ...form, eventStart: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Event end
              <input
                value={form.eventEnd}
                onChange={(e) => setForm({ ...form, eventEnd: e.target.value })}
              />
            </label>
            <label className={`${styles.field} ${styles.gridFull}`}>
              Countdown ISO target
              <input
                value={form.countdownTarget}
                onChange={(e) => setForm({ ...form, countdownTarget: e.target.value })}
              />
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={form.registrationOpen}
                onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })}
              />
              Master registration open
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.sectionLabel}>Payments</p>
          <h2 className={styles.cardTitle}>Somaiya QR tiers</h2>
          <p className={styles.cardHint}>
            One QR image per fee amount. Paid events need a matching tier before students can
            register.
          </p>

          {missingQrFees.length > 0 && (
            <div className={styles.alert}>
              <strong>Missing QR for {missingQrFees.length} fee amount(s)</strong>
              <ul className={styles.gapList}>
                {missingQrFees.map((g) => (
                  <li key={g.fee}>
                    <button
                      type="button"
                      className={styles.gapChip}
                      onClick={() => addTierForFee(g.fee)}
                      title={g.names.join(', ')}
                    >
                      ₹{g.fee} · {g.names.length}{' '}
                      {g.names.length === 1 ? 'event' : 'events'} · Add tier
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feeGroups.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p className={styles.sectionLabel}>Fees used by events</p>
              <div className={styles.gapList}>
                {feeGroups.map((g) => {
                  const ready = paymentQrs.some(
                    (t) => Number(t.amount) === g.fee && (t.qrImageUrl || qrFiles[t.amount])
                  );
                  return (
                    <span
                      key={g.fee}
                      className={styles.gapChip}
                      style={
                        ready
                          ? { borderColor: 'rgba(46,125,50,0.35)', color: '#2e7d32' }
                          : undefined
                      }
                    >
                      ₹{g.fee} {ready ? '✓' : '· needs QR'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {paymentQrs.map((tier, idx) => (
            <div key={`${tier.amount}-${idx}`} className={styles.tierCard}>
              <label className={styles.field}>
                Amount (₹)
                <input
                  type="number"
                  min="0"
                  value={tier.amount}
                  onChange={(e) => {
                    const next = [...paymentQrs];
                    const newAmount = Number(e.target.value) || 0;
                    next[idx] = { ...tier, amount: newAmount, label: tier.label || `₹${newAmount}` };
                    setPaymentQrs(next);
                  }}
                />
              </label>
              <label className={styles.field}>
                Label
                <input
                  value={tier.label}
                  onChange={(e) => {
                    const next = [...paymentQrs];
                    next[idx] = { ...tier, label: e.target.value };
                    setPaymentQrs(next);
                  }}
                />
              </label>
              <label className={styles.field}>
                Pay URL (optional)
                <input
                  value={tier.payUrl || ''}
                  onChange={(e) => {
                    const next = [...paymentQrs];
                    next[idx] = { ...tier, payUrl: e.target.value };
                    setPaymentQrs(next);
                  }}
                  placeholder="https://…"
                />
              </label>
              <div>
                {tier.qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tier.qrImageUrl} alt={`QR ${tier.amount}`} className={styles.tierPreview} />
                ) : (
                  <div className={styles.tierPreviewEmpty}>No QR</div>
                )}
                <label className={styles.field} style={{ marginTop: 6 }}>
                  {tier.qrImageUrl ? 'Replace QR' : 'Upload QR'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setQrFiles({ ...qrFiles, [tier.amount]: e.target.files?.[0] || null })
                    }
                  />
                </label>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                  style={{ marginTop: 6, width: '100%' }}
                  onClick={() => setPaymentQrs(paymentQrs.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className={styles.btn}
            onClick={() =>
              setPaymentQrs([
                ...paymentQrs,
                { amount: 0, label: '', qrImageUrl: '', payUrl: '' },
              ])
            }
          >
            + Add empty QR tier
          </button>
        </section>

        <div className={styles.stickyBar}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
