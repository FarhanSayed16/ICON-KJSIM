'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { HiOutlineDownload, HiOutlineCalendar, HiCheckCircle } from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { EVENTS, SITE_CONFIG } from '@/lib/data';
import { registerUser } from '@/app/actions/registerUser';
import { generateICS, downloadICS } from '@/lib/ics';
import styles from './RegisterPage.module.css';

export default function RegistrationClient() {
  const searchParams = useSearchParams();
  const initialEvent = searchParams.get('event');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    department: '',
    events: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const qrRef = useRef();

  useEffect(() => {
    if (initialEvent) {
      const eventExists = EVENTS.find((e) => e.slug === initialEvent);
      if (eventExists) {
        setFormData((prev) => ({ ...prev, events: [eventExists.slug] }));
      }
    }
  }, [initialEvent]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleEventToggle = (eventSlug) => {
    setFormData((prev) => {
      const currentEvents = prev.events;
      if (currentEvents.includes(eventSlug)) {
        return { ...prev, events: currentEvents.filter((slug) => slug !== eventSlug) };
      }
      return { ...prev, events: [...currentEvents, eventSlug] };
    });
  };

  const handleAction = async (formDataObj) => {
    if (formData.events.length === 0) {
      toast.error('Please select at least one event.');
      return;
    }

    setIsSubmitting(true);
    setDuplicateModal(false);

    try {
      formData.events.forEach((event) => formDataObj.append('events', event));
      formDataObj.set('mobile', formData.mobile);
      formDataObj.set('department', formData.department || '');

      const result = await registerUser(null, formDataObj);

      if (result.success) {
        if (result.emailStatus === 'sent') {
          toast.success(result.message);
        } else if (result.emailStatus === 'not_configured') {
          toast(result.message, { icon: '⚠️', duration: 6000 });
        } else {
          toast(result.message, { icon: '⚠️', duration: 6000 });
        }

        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b71c1c', '#ffffff', '#1a1a2e'],
          });
        }

        setSuccessData({
          registrationId: result.registrationId,
          qrCode: result.qrCode,
          selectedEvents: formData.events,
        });
      } else if (result.duplicate) {
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
    const startDate = new Date(SITE_CONFIG.countdownTarget);
    const endDate = new Date(SITE_CONFIG.eventDates.end + 'T18:00:00+05:30');
    const venue =
      typeof SITE_CONFIG.venue === 'string'
        ? SITE_CONFIG.venue
        : `${SITE_CONFIG.venue.name}, Mumbai`;

    const icsContent = generateICS({
      title: `${SITE_CONFIG.name} — ${SITE_CONFIG.theme}`,
      description: `Registered events: ${successData.selectedEvents.join(', ')}. ID: ${successData.qrCode}`,
      location: venue,
      startDate,
      endDate,
    });

    downloadICS(icsContent, 'ICON2026.ics');
  };

  const technical = EVENTS.filter((e) => e.category === 'technical' && e.isActive);
  const nonTechnical = EVENTS.filter((e) => e.category === 'non-technical' && e.isActive);
  const gaming = EVENTS.filter((e) => e.category === 'gaming' && e.isActive);

  const renderEventGroup = (label, list) => (
    <div className={styles.eventGroup} key={label}>
      <h4 className={styles.eventGroupTitle}>{label}</h4>
      <div className={styles.eventGrid}>
        {list.map((event) => (
          <div
            key={event.slug}
            className={`${styles.eventCard} ${formData.events.includes(event.slug) ? styles.selected : ''}`}
            onClick={() => !isSubmitting && handleEventToggle(event.slug)}
            role="checkbox"
            aria-checked={formData.events.includes(event.slug)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEventToggle(event.slug);
              }
            }}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.events.includes(event.slug)}
              readOnly
              tabIndex={-1}
            />
            <span className={styles.eventName}>{event.name}</span>
            <span className={styles.eventCategory}>
              {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={`container ${styles.layout}`}>
        <ScrollReveal className={styles.formSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>Secure Your Spot</h1>
            <p className={styles.subtitle}>Fill in your details to register for ICON 2026.</p>
          </div>

          <form action={handleAction}>
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
              <label className={styles.label}>
                Select Events *
                {formData.events.length > 0 && (
                  <span className={styles.selectedCount}>{formData.events.length} Selected</span>
                )}
              </label>
              {renderEventGroup('Technical', technical)}
              {renderEventGroup('Non-Technical', nonTechnical)}
              {renderEventGroup('Gaming', gaming)}
            </div>

            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Processing...' : 'Complete Registration'}</span>
            </button>
            <p className={styles.terms}>By registering, you agree to ICON 2026 event guidelines.</p>
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
                style={{ width: '100%', height: 'auto', opacity: 0.5 }}
              />
            </div>
            <div className={styles.infoContent}>
              <h3>Why Register?</h3>
              <ul>
                <li>Access to flagship technical & gaming events</li>
                <li>QR-based venue check-in</li>
                <li>Confirmation email with calendar invite</li>
                <li>Prizes, networking, and DATATRON experiences</li>
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
              This email is already registered for ICON 2026. Check your inbox for the QR pass, or
              contact the organizers if you need help.
            </p>
            <button className="btn-primary" onClick={() => setDuplicateModal(false)}>
              <span>OK</span>
            </button>
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
              You&apos;re In!
            </h2>
            <p className={styles.modalSubtitle}>
              Registration successful. Present this QR code at the entrance.
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

            <div className={styles.modalActions}>
              <button type="button" onClick={downloadQR} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                <HiOutlineDownload size={20} /> Download QR Pass
              </button>

              <button
                type="button"
                onClick={handleAddToCalendar}
                className={`${styles.actionBtn} ${styles.btnSecondary}`}
              >
                <HiOutlineCalendar size={20} /> Add to Calendar
              </button>

              <Link href="/" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
