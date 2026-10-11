'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { saveSiteConfig } from '@/app/actions/adminSettings';
import styles from '../AdminDashboard.module.css';

export default function AdminSettingsClient({ initialConfig }) {
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
      if (res.success) toast.success('Settings saved');
      else toast.error(res.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Site Settings</h1>
          <p className={styles.pageSub}>
            Theme, slogan, registration switch, and Somaiya payment QR tiers.
          </p>
        </div>
      </header>

      <form onSubmit={onSubmit} className={styles.tableCard}>
        <div className={styles.formGrid}>
          <label>
            Fest name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Theme
            <input
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
            />
          </label>
          <label>
            Slogan
            <input
              value={form.slogan}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
            />
          </label>
          <label>
            Tagline
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Description
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Edition year
            <input
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
            />
          </label>
          <label>
            Contact email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Event start
            <input
              value={form.eventStart}
              onChange={(e) => setForm({ ...form, eventStart: e.target.value })}
            />
          </label>
          <label>
            Event end
            <input
              value={form.eventEnd}
              onChange={(e) => setForm({ ...form, eventEnd: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Countdown ISO target
            <input
              value={form.countdownTarget}
              onChange={(e) => setForm({ ...form, countdownTarget: e.target.value })}
            />
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.registrationOpen}
              onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })}
            />
            Master registration open
          </label>
        </div>

        <h2 style={{ margin: '28px 0 12px' }}>Payment QR tiers (Somaiya)</h2>
        <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
          Upload one QR image per amount (e.g. 149 / 299 / 499). Event fees should sum to these amounts.
        </p>
        {paymentQrs.map((tier, idx) => (
          <div
            key={tier.amount}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
              alignItems: 'end',
            }}
          >
            <label>
              Amount
              <input
                type="number"
                value={tier.amount}
                onChange={(e) => {
                  const next = [...paymentQrs];
                  next[idx] = { ...tier, amount: Number(e.target.value) || 0 };
                  setPaymentQrs(next);
                }}
              />
            </label>
            <label>
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
            <label>
              Pay URL (optional)
              <input
                value={tier.payUrl || ''}
                onChange={(e) => {
                  const next = [...paymentQrs];
                  next[idx] = { ...tier, payUrl: e.target.value };
                  setPaymentQrs(next);
                }}
              />
            </label>
            <label>
              QR image {tier.qrImageUrl ? '(replace)' : ''}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQrFiles({ ...qrFiles, [tier.amount]: e.target.files?.[0] || null })
                }
              />
            </label>
            {tier.qrImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tier.qrImageUrl}
                alt={`QR ${tier.amount}`}
                style={{ width: 72, height: 72, objectFit: 'contain', gridColumn: '1 / -1' }}
              />
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className={styles.refreshBtn}
          style={{ marginBottom: 16 }}
          onClick={() =>
            setPaymentQrs([
              ...paymentQrs,
              { amount: 0, label: '', qrImageUrl: '', payUrl: '' },
            ])
          }
        >
          Add QR tier
        </button>

        <div>
          <button type="submit" className={styles.refreshBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
