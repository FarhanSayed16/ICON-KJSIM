'use client';

import { useMemo, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { saveEvent, deleteEvent, toggleEventFlag, listAdminEvents } from '@/app/actions/adminEvents';
import styles from '../AdminCms.module.css';

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

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'technical', label: 'Technical' },
  { id: 'sports', label: 'Sports' },
  { id: 'gaming', label: 'Indoor & Esports' },
  { id: 'mini-games', label: 'Mini-Games' },
];

export default function AdminEventsClient({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [form, setForm] = useState(emptyForm);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const formRef = useRef(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((e) => e.category === filter);
  }, [events, filter]);

  const refresh = async () => {
    const res = await listAdminEvents();
    if (res.success) setEvents(res.events);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setPosterFile(null);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
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
      rules: Array.isArray(ev.rules)
        ? ev.rules.map(String).join('\n')
        : String(ev.rules || ''),
      pocName: ev.poc?.name || '',
      pocPhone: ev.poc?.phone || '',
      pocEmail: ev.poc?.email || '',
      sortOrder: ev.sortOrder || 0,
      isActive: ev.isActive !== false,
      isRegistrationOpen: ev.isRegistrationOpen !== false,
    });
    setPosterFile(null);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setPosterFile(null);
    setShowForm(false);
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
        setShowForm(false);
        await refresh();
      } else {
        toast.error(res.message || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Events</h1>
          <p className={styles.sub}>
            Manage fest events, fees, and registration availability — no redeploy needed.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={openCreate}>
            + New event
          </button>
        </div>
      </header>

      {showForm && (
        <section className={styles.card} ref={formRef}>
          <h2 className={styles.cardTitle}>{form.id ? 'Edit event' : 'Create event'}</h2>
          <p className={styles.cardHint}>
            Fee must match a QR tier in Settings for paid events to accept registrations.
          </p>
          <form onSubmit={onSubmit} className={styles.grid}>
            <label className={styles.field}>
              Name *
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className={styles.field}>
              Slug
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto from name"
              />
            </label>
            <label className={styles.field}>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="technical">Technical</option>
                <option value="sports">Sports</option>
                <option value="gaming">Indoor & Esports</option>
                <option value="mini-games">Mini-Games (Free)</option>
              </select>
            </label>
            <label className={styles.field}>
              Fee (₹)
              <input
                type="number"
                min="0"
                value={form.registrationFee}
                onChange={(e) => setForm({ ...form, registrationFee: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Date
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className={styles.field}>
              Time
              <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </label>
            <label className={styles.field}>
              Venue
              <input
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Team size
              <input
                value={form.teamSize}
                onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
              />
            </label>
            <label className={`${styles.field} ${styles.gridFull}`}>
              Short description
              <input
                value={form.shortDesc}
                onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              />
            </label>
            <label className={`${styles.field} ${styles.gridFull}`}>
              Full description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className={`${styles.field} ${styles.gridFull}`}>
              Rules (one per line)
              <textarea
                rows={3}
                value={form.rules}
                onChange={(e) => setForm({ ...form, rules: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              POC name
              <input
                value={form.pocName}
                onChange={(e) => setForm({ ...form, pocName: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              POC phone
              <input
                value={form.pocPhone}
                onChange={(e) => setForm({ ...form, pocPhone: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              POC email
              <input
                value={form.pocEmail}
                onChange={(e) => setForm({ ...form, pocEmail: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Sort order
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Poster URL
              <input
                value={form.posterImage}
                onChange={(e) => setForm({ ...form, posterImage: e.target.value })}
              />
            </label>
            <label className={styles.field}>
              Or upload poster
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              />
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active on website
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={form.isRegistrationOpen}
                onChange={(e) => setForm({ ...form, isRegistrationOpen: e.target.checked })}
              />
              Open for registration
            </label>
            <div className={styles.formActions}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
                {saving ? 'Saving…' : form.id ? 'Update event' : 'Create event'}
              </button>
              <button type="button" className={styles.btn} onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.cardTitle} style={{ marginBottom: 2 }}>
              All events ({filtered.length}
              {filter !== 'all' ? ` / ${events.length}` : ''})
            </h2>
            <p className={styles.sub}>Edit details, hide from site, or close registration.</p>
          </div>
          <div className={styles.chips}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.chip} ${filter === c.id ? styles.chipActive : ''}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.card}>
            <p className={styles.empty}>No events in this category.</p>
          </div>
        ) : (
          <div className={styles.eventList}>
            {filtered.map((ev) => (
              <div key={ev._id || ev.slug} className={styles.eventRow}>
                <div>
                  <div className={styles.eventName}>{ev.name}</div>
                  <div className={styles.eventMeta}>
                    {ev.slug}
                    {ev.date ? ` · ${ev.date}` : ''}
                  </div>
                </div>
                <div className={styles.fee}>
                  {Number(ev.registrationFee) === 0 ? 'FREE' : `₹${ev.registrationFee}`}
                </div>
                <span className={styles.catBadge}>{ev.category || '—'}</span>
                <div className={styles.statusPills}>
                  <span className={ev.isActive !== false ? styles.pillOn : styles.pillOff}>
                    {ev.isActive !== false ? 'Live' : 'Hidden'}
                  </span>
                  <span className={ev.isRegistrationOpen !== false ? styles.pillOn : styles.pillOff}>
                    {ev.isRegistrationOpen !== false ? 'Reg open' : 'Reg closed'}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm}`}
                    onClick={() => edit(ev)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm}`}
                    onClick={async () => {
                      await toggleEventFlag(ev._id, 'isActive', !ev.isActive);
                      toast.success(ev.isActive ? 'Hidden from site' : 'Shown on site');
                      await refresh();
                    }}
                  >
                    {ev.isActive !== false ? 'Hide' : 'Show'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm}`}
                    onClick={async () => {
                      await toggleEventFlag(
                        ev._id,
                        'isRegistrationOpen',
                        !ev.isRegistrationOpen
                      );
                      toast.success(
                        ev.isRegistrationOpen ? 'Registration closed' : 'Registration opened'
                      );
                      await refresh();
                    }}
                  >
                    {ev.isRegistrationOpen !== false ? 'Close reg' : 'Open reg'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                    onClick={async () => {
                      if (!confirm(`Delete ${ev.name}?`)) return;
                      await deleteEvent(ev._id);
                      toast.success('Deleted');
                      await refresh();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
