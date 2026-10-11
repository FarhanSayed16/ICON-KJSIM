'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { saveEvent, deleteEvent, toggleEventFlag, listAdminEvents } from '@/app/actions/adminEvents';
import styles from '../AdminDashboard.module.css';

const emptyForm = {
  id: '',
  name: '',
  slug: '',
  category: 'technical',
  shortDesc: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  registrationFee: 0,
  prizePool: 0,
  teamSize: 'Solo',
  posterImage: '',
  rules: '',
  pocName: '',
  pocPhone: '',
  pocEmail: '',
  sortOrder: 0,
  isActive: true,
  isRegistrationOpen: true,
};

export default function AdminEventsClient({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [form, setForm] = useState(emptyForm);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const res = await listAdminEvents();
    if (res.success) setEvents(res.events);
  };

  const edit = (ev) => {
    setForm({
      id: ev._id || '',
      name: ev.name || '',
      slug: ev.slug || '',
      category: ev.category || 'technical',
      shortDesc: ev.shortDesc || '',
      description: ev.description || '',
      date: ev.date || '',
      time: ev.time || '',
      venue: ev.venue || '',
      registrationFee: ev.registrationFee || 0,
      prizePool: ev.prizePool || 0,
      teamSize: ev.teamSize || 'Solo',
      posterImage: ev.posterImage || '',
      rules: (ev.rules || []).join('\n'),
      pocName: ev.poc?.name || '',
      pocPhone: ev.poc?.phone || '',
      pocEmail: ev.poc?.email || '',
      sortOrder: ev.sortOrder || 0,
      isActive: ev.isActive !== false,
      isRegistrationOpen: ev.isRegistrationOpen !== false,
    });
    setPosterFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'isActive' || k === 'isRegistrationOpen') {
          fd.set(k, v ? 'true' : 'false');
        } else {
          fd.set(k, v ?? '');
        }
      });
      if (posterFile) fd.set('posterFile', posterFile);
      const res = await saveEvent(fd);
      if (res.success) {
        toast.success(form.id ? 'Event updated' : 'Event created');
        setForm(emptyForm);
        setPosterFile(null);
        await refresh();
      } else {
        toast.error(res.message || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Events Manager</h1>
          <p className={styles.pageSub}>
            Add / edit events anytime — no redeploy needed after college hosting.
          </p>
        </div>
      </header>

      <section className={styles.tableCard} style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>{form.id ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          <label>
            Name *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto from name"
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
              <option value="gaming">Gaming</option>
            </select>
          </label>
          <label>
            Fee (₹)
            <input
              type="number"
              min="0"
              value={form.registrationFee}
              onChange={(e) => setForm({ ...form, registrationFee: e.target.value })}
            />
          </label>
          <label>
            Date
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            Time
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </label>
          <label>
            Venue
            <input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
          </label>
          <label>
            Team size
            <input
              value={form.teamSize}
              onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Short description
            <input
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Full description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Rules (one per line)
            <textarea
              rows={4}
              value={form.rules}
              onChange={(e) => setForm({ ...form, rules: e.target.value })}
            />
          </label>
          <label>
            POC name
            <input
              value={form.pocName}
              onChange={(e) => setForm({ ...form, pocName: e.target.value })}
            />
          </label>
          <label>
            POC phone
            <input
              value={form.pocPhone}
              onChange={(e) => setForm({ ...form, pocPhone: e.target.value })}
            />
          </label>
          <label>
            POC email
            <input
              value={form.pocEmail}
              onChange={(e) => setForm({ ...form, pocEmail: e.target.value })}
            />
          </label>
          <label>
            Sort order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </label>
          <label>
            Poster URL
            <input
              value={form.posterImage}
              onChange={(e) => setForm({ ...form, posterImage: e.target.value })}
            />
          </label>
          <label>
            Or upload poster
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            />
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active on website
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.isRegistrationOpen}
              onChange={(e) => setForm({ ...form, isRegistrationOpen: e.target.checked })}
            />
            Open for registration
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
            <button type="submit" className={styles.refreshBtn} disabled={saving}>
              {saving ? 'Saving…' : form.id ? 'Update Event' : 'Create Event'}
            </button>
            {form.id ? (
              <button
                type="button"
                className={styles.refreshBtn}
                onClick={() => {
                  setForm(emptyForm);
                  setPosterFile(null);
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>All Events ({events.length})</h2>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Fee</th>
                <th>Active</th>
                <th>Reg open</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id || ev.slug}>
                  <td>
                    <strong>{ev.name}</strong>
                    <div style={{ fontSize: 12, color: '#888' }}>{ev.slug}</div>
                  </td>
                  <td>₹{ev.registrationFee}</td>
                  <td>{ev.isActive ? 'Yes' : 'No'}</td>
                  <td>{ev.isRegistrationOpen ? 'Yes' : 'No'}</td>
                  <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button type="button" className={styles.refreshBtn} onClick={() => edit(ev)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.refreshBtn}
                      onClick={async () => {
                        await toggleEventFlag(ev._id, 'isActive', !ev.isActive);
                        await refresh();
                      }}
                    >
                      {ev.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      className={styles.refreshBtn}
                      onClick={async () => {
                        if (!confirm(`Delete ${ev.name}?`)) return;
                        await deleteEvent(ev._id);
                        toast.success('Deleted');
                        await refresh();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
