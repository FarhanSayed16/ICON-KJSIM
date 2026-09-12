'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { EVENTS } from '@/lib/data';
import { broadcastNotification, sendRemindersNow } from '@/app/actions/broadcast';
import styles from '../AdminDashboard.module.css';

export default function BroadcastClient() {
  const [channel, setChannel] = useState('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetEvent, setTargetEvent] = useState('all');
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setBusy(true);
    setLastResult(null);
    try {
      const result = await broadcastNotification({
        channel,
        subject,
        message,
        targetEvent,
      });
      if (result.success) {
        toast.success(result.message);
        setLastResult(result.data);
      } else {
        toast.error(result.message || 'Broadcast failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setBusy(false);
    }
  };

  const handleReminders = async () => {
    setBusy(true);
    try {
      const result = await sendRemindersNow();
      if (result.success) toast.success(result.message);
      else toast.error(result.message || 'Failed');
    } catch {
      toast.error('Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ marginBottom: '1.5rem' }}>
        <h1 className={styles.title}>Broadcast Notifications</h1>
        <Link href="/admin" className="btn-secondary" style={{ padding: '10px 16px' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSend}
        className={styles.chartCard}
        style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <label>
          Channel
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className={styles.searchInput}
            style={{ display: 'block', width: '100%', marginTop: 6 }}
          >
            <option value="email">Email</option>
            <option value="sms">SMS (Twilio — trial limits apply)</option>
          </select>
        </label>

        <label>
          Target
          <select
            value={targetEvent}
            onChange={(e) => setTargetEvent(e.target.value)}
            className={styles.searchInput}
            style={{ display: 'block', width: '100%', marginTop: 6 }}
          >
            <option value="all">All registrants</option>
            {EVENTS.map((ev) => (
              <option key={ev.slug} value={ev.slug}>
                {ev.name}
              </option>
            ))}
          </select>
        </label>

        {channel === 'email' && (
          <label>
            Subject
            <input
              className={styles.searchInput}
              style={{ display: 'block', width: '100%', marginTop: 6 }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Schedule update — ICON 2026"
            />
          </label>
        )}

        <label>
          Message
          <textarea
            className={styles.searchInput}
            style={{ display: 'block', width: '100%', marginTop: 6, minHeight: 140 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Write your announcement…"
          />
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary" disabled={busy}>
            <span>{busy ? 'Sending…' : 'Send Broadcast'}</span>
          </button>
          <button type="button" className="btn-secondary" disabled={busy} onClick={handleReminders}>
            Send Reminders Now
          </button>
        </div>

        {lastResult && (
          <p style={{ margin: 0, opacity: 0.8 }}>
            Sent: {lastResult.sent} · Failed: {lastResult.failed} · Total: {lastResult.total}
          </p>
        )}
      </form>
    </div>
  );
}
