'use client';

import { useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { HiOutlineDownload, HiOutlineCalendar, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { registerUser } from '@/app/actions/registerUser';
import { generateICS, downloadICS } from '@/lib/ics';
import styles from './RegisterPage.module.css';

const CATEGORY_LABEL = {
  technical: 'Technical',
  'non-technical': 'Non-Technical',
  gaming: 'Gaming',
};

function feeLabel(fee) {
  const n = Number(fee) || 0;
  return n === 0 ? 'FREE' : `₹${n}`;
}

export default function RegistrationClient({ events = [], siteConfig }) {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('event');
  const config = siteConfig || {};

  const selectedEvent = useMemo(
    () => (eventParam ? events.find((e) => e.slug === eventParam) || null : null),
    [eventParam, events]
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    department: '',
    paymentTxnId: '',
  });
  const [paymentFile, setPaymentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const qrRef = useRef();

  const payableAmount = Number(selectedEvent?.registrationFee) || 0;

  const paymentQr = useMemo(() => {
    const list = config.paymentQrs || [];
    return list.find((q) => Number(q.amount) === Number(payableAmount)) || null;
  }, [config.paymentQrs, payableAmount]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'paymentTxnId') value = value.toUpperCase();
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast.error('Choose an event first.');
      return;
    }

    if (payableAmount > 0) {
      if (!paymentQr?.qrImageUrl) {
        toast.error(`No payment QR configured for ₹${payableAmount}. Contact organisers.`);
        return;
      }
      if (!paymentFile) {
        toast.error('Please upload your payment screenshot.');
        return;
      }
      if (!formData.paymentTxnId || formData.paymentTxnId.length < 4) {
        toast.error('Enter the transaction / UTR ID from your payment.');
        return;
      }
    }

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.set('eventSlug', selectedEvent.slug);
    formDataObj.set('mobile', formData.mobile);
    formDataObj.set('department', formData.department || '');
    formDataObj.set('paymentTxnId', formData.paymentTxnId || '');
    if (paymentFile) formDataObj.set('paymentScreenshot', paymentFile);

    setIsSubmitting(true);
    setDuplicateModal(false);

    try {
      const result = await registerUser(null, formDataObj);

      if (result.success) {
        toast.success(result.message);

        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b71c1c', '#ffffff', '#1a1a2e'],
          });
        }

        setSuccessData({
          registrationId: result.registrationId,
          qrCode: result.qrCode,
          eventName: result.eventName || selectedEvent.name,
          eventSlug: result.eventSlug || selectedEvent.slug,
          paymentStatus: result.paymentStatus,
          payableAmount: result.payableAmount,
        });
      } else if (result.duplicate) {
        setDuplicateMessage(result.message || 'Already registered for this event.');
        setDuplicateModal(true);
        toast(result.message, { icon: '⚠️' });
      } else if (result.errors) {
        const firstError = Object.values(result.errors)[0];
        toast.error(firstError);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `ICON-QR-${successData.qrCode}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(config.countdownTarget);
    const endDate = new Date((config.eventDates?.end || '') + 'T18:00:00+05:30');
    const venue =
      typeof config.venue === 'string'
        ? config.venue
        : `${config.venue?.name || 'KJSIM'}, Mumbai`;

    const icsContent = generateICS({
      title: `${config.name || 'ICON'} — ${successData.eventName}`,
      description: `Registered for ${successData.eventName}. ID: ${successData.qrCode}`,
      location: venue,
      startDate,
      endDate,
    });

    downloadICS(icsContent, `ICON-${successData.eventSlug || 'event'}.ics`);
  };

  if (config.registrationOpen === false) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.header}>
            <h1 className={styles.title}>Registrations Closed</h1>
            <p className={styles.subtitle}>Please check back later or contact the organisers.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Event picker (no ?event=) ──────────────────────────────────────────
  if (!eventParam) {
    const groups = [
      { key: 'technical', label: 'Technical', list: events.filter((e) => e.category === 'technical') },
      {
        key: 'non-technical',
        label: 'Non-Technical',
        list: events.filter((e) => e.category === 'non-technical'),
      },
      { key: 'gaming', label: 'Gaming', list: events.filter((e) => e.category === 'gaming') },
    ];

    return (
      <div className={styles.page}>
        <div className={`container ${styles.pickerLayout}`}>
          <div className={styles.header}>
            <h1 className={styles.title}>Choose an event</h1>
            <p className={styles.subtitle}>
              Each registration is for <strong>one event</strong> with its own fee and payment QR.
              Pick an event to continue.
            </p>
          </div>

          {events.length === 0 ? (
            <p className={styles.subtitle}>No events are open for registration right now.</p>
          ) : (
            groups.map(
              (g) =>
                g.list.length > 0 && (
                  <section key={g.key} className={styles.pickerGroup}>
                    <h2 className={styles.eventGroupTitle}>{g.label}</h2>
                    <div className={styles.pickerGrid}>
                      {g.list.map((ev) => (
                        <Link
                          key={ev.slug}
                          href={`/register?event=${ev.slug}`}
                          className={styles.pickerCard}
                        >
                          <span className={styles.pickerName}>{ev.name}</span>
                          <span className={styles.pickerMeta}>
                            {ev.date || 'Date TBA'}
                            {ev.time ? ` · ${ev.time}` : ''}
                          </span>
                          <span className={styles.pickerFee}>{feeLabel(ev.registrationFee)}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )
            )
          )}
        </div>
      </div>
    );
  }

  // ── Invalid / closed event slug ────────────────────────────────────────
  if (!selectedEvent) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.header}>
            <h1 className={styles.title}>Event unavailable</h1>
            <p className={styles.subtitle}>
              This event is not open for registration, or the link is invalid.
            </p>
            <Link href="/register" className={`btn-primary ${styles.backLink}`}>
              <HiArrowLeft /> Browse events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Single-event registration form ─────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={`container ${styles.layout}`}>
        <ScrollReveal className={styles.formSection}>
          <Link href="/register" className={styles.changeEvent}>
            <HiArrowLeft size={16} /> Change event
          </Link>

          <div className={styles.header}>
            <h1 className={styles.title}>Register</h1>
            <p className={styles.subtitle}>
              One event · one payment · one QR pass. Complete the form for this event only.
            </p>
          </div>

          <div className={styles.eventFocus}>
            <div>
              <p className={styles.eventFocusLabel}>
                {CATEGORY_LABEL[selectedEvent.category] || selectedEvent.category}
              </p>
              <h2 className={styles.eventFocusName}>{selectedEvent.name}</h2>
              <p className={styles.eventFocusMeta}>
                {[selectedEvent.date, selectedEvent.time, selectedEvent.venue]
                  .filter(Boolean)
                  .join(' · ') || 'Schedule TBA'}
              </p>
            </div>
            <div className={styles.eventFocusFee}>{feeLabel(selectedEvent.registrationFee)}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="eventSlug" value={selectedEvent.slug} />

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Farhan Sayed"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="mobile">
                  Mobile Number *
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="9876543210"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="college">
                  College / Institution *
                </label>
                <input
                  id="college"
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="KJ Somaiya Institute of Management"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="department">
                Department (Optional)
              </label>
              <input
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={styles.input}
                placeholder="Data Science & Technology"
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Payment for {selectedEvent.name}</label>
              <p className={styles.subtitle} style={{ marginBottom: 12 }}>
                Amount due: <strong>₹{payableAmount}</strong>
              </p>

              {payableAmount > 0 && paymentQr?.qrImageUrl ? (
                <div className={styles.paymentBlock}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={paymentQr.qrImageUrl}
                    alt={`Pay ₹${payableAmount} for ${selectedEvent.name}`}
                    className={styles.qrImage}
                  />
                  <p className={styles.paymentHint}>
                    Scan this QR and pay <strong>₹{payableAmount}</strong> for{' '}
                    <strong>{selectedEvent.name}</strong> only. Then upload the screenshot and enter
                    the UTR / Transaction ID.
                  </p>
                  {paymentQr.payUrl ? (
                    <a href={paymentQr.payUrl} target="_blank" rel="noreferrer" className={styles.payLink}>
                      Open payment page
                    </a>
                  ) : null}
                </div>
              ) : payableAmount > 0 ? (
                <p className={styles.paymentWarn}>
                  No QR is configured for ₹{payableAmount} yet. Ask organisers to set the fee/QR tier
                  in Admin → Settings.
                </p>
              ) : (
                <p className={styles.paymentHint}>This event is free — no payment needed.</p>
              )}

              {payableAmount > 0 && (
                <>
                  <label className={styles.label} htmlFor="paymentScreenshot">
                    Payment Screenshot *
                  </label>
                  <input
                    id="paymentScreenshot"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={styles.input}
                    disabled={isSubmitting}
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                  />

                  <label className={styles.label} htmlFor="paymentTxnId" style={{ marginTop: 12 }}>
                    Transaction / UTR ID *
                  </label>
                  <input
                    id="paymentTxnId"
                    type="text"
                    name="paymentTxnId"
                    value={formData.paymentTxnId}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. 123456789012"
                    required={payableAmount > 0}
                    disabled={isSubmitting}
                  />
                </>
              )}
            </div>

            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={isSubmitting || (payableAmount > 0 && !paymentQr?.qrImageUrl)}
            >
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : `Submit — ${selectedEvent.name} (${feeLabel(payableAmount)})`}
              </span>
            </button>
            <p className={styles.terms}>
              Want another event? Finish this registration, then register again from the events list.
              Pass email is sent after payment verification.
            </p>
          </form>
        </ScrollReveal>

        <div className={styles.infoSection}>
          <ScrollReveal delay={0.2}>
            <div className={styles.infoIllustration}>
              <Image
                src="/images/icon_logo.png"
                alt="ICON Logo"
                width={300}
                height={200}
                priority
                style={{ width: '100%', height: 'auto', opacity: 0.5 }}
              />
            </div>
            <div className={styles.infoContent}>
              <h3>How registration works</h3>
              <ul>
                <li>Register for one event at a time</li>
                <li>Pay the fee for that event via Somaiya QR</li>
                <li>Upload screenshot + UTR ID</li>
                <li>After verification, you get the QR pass for that event</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {duplicateModal && (
        <div className={styles.modalOverlay} onClick={() => setDuplicateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Already Registered</h2>
            <p className={styles.modalSubtitle}>
              {duplicateMessage ||
                'You are already registered for this event. Check your email for the QR pass, or contact organisers.'}
            </p>
            <div className={styles.modalActions}>
              <button type="button" className="btn-primary" onClick={() => setDuplicateModal(false)}>
                <span>OK</span>
              </button>
              <Link href="/register" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
                Other events
              </Link>
            </div>
          </div>
        </div>
      )}

      {successData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} role="dialog" aria-labelledby="reg-success-title">
            <div className={styles.successIcon} aria-hidden>
              <HiCheckCircle size={36} />
            </div>
            <h2 id="reg-success-title" className={styles.modalTitle}>
              {successData.paymentStatus === 'pending' ? 'Submitted!' : "You're In!"}
            </h2>
            <p className={styles.modalSubtitle}>
              <strong>{successData.eventName}</strong>
              <br />
              {successData.paymentStatus === 'pending'
                ? 'Payment is under verification. Your confirmation email and venue QR pass will arrive after approval.'
                : 'Registration successful. Present this QR code at the entrance.'}
            </p>

            <div className={styles.qrContainer} ref={qrRef}>
              <QRCodeSVG
                value={successData.qrCode}
                size={168}
                level="M"
                includeMargin={true}
                style={{ width: '100%', height: 'auto', maxWidth: '168px' }}
              />
            </div>

            <p className={styles.regId}>{successData.qrCode}</p>
            {successData.payableAmount > 0 && (
              <p className={styles.modalSubtitle}>
                Amount: ₹{successData.payableAmount} · Status: {successData.paymentStatus}
              </p>
            )}

            <div className={styles.modalActions}>
              <button type="button" onClick={downloadQR} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                <HiOutlineDownload size={20} /> Download QR
              </button>
              <button
                type="button"
                onClick={handleAddToCalendar}
                className={`${styles.actionBtn} ${styles.btnSecondary}`}
              >
                <HiOutlineCalendar size={20} /> Add to Calendar
              </button>
              <Link href="/register" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
                Register for another event
              </Link>
              <Link href="/" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
                Homepage
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
