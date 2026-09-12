'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlineCurrencyRupee, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import styles from './EventSchedule.module.css';

export default function EventModal({ event, onClose }) {
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose} aria-hidden="true">
        <motion.div
          ref={modalRef}
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${event.name}`}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            <HiX size={22} />
          </button>

          {/* Header */}
          <div className={styles.modalHeader}>
            <div className={styles.modalPoster}>
              <div className={styles.modalPosterStage}>
                <Image
                  src={event.posterImage}
                  alt={`${event.name} poster`}
                  fill
                  className={styles.modalPosterImg}
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              </div>
            </div>
            <span className={`${styles.categoryBadge} ${styles[event.category.replace('-', '')]}`}>
              {event.category}
            </span>
            <h2 className={styles.modalTitle}>{event.name}</h2>
            <p className={styles.modalShort}>{event.shortDesc}</p>
          </div>

          {/* Body */}
          <div className={styles.modalBody}>
            <p className={styles.modalDesc}>{event.description}</p>

            {/* Info Grid */}
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <HiOutlineCalendar size={18} />
                <div>
                  <span className={styles.infoLabel}>Date & Time</span>
                  <span className={styles.infoValue}>{event.date} · {event.time}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <HiOutlineLocationMarker size={18} />
                <div>
                  <span className={styles.infoLabel}>Venue</span>
                  <span className={styles.infoValue}>{event.venue}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <HiOutlineUserGroup size={18} />
                <div>
                  <span className={styles.infoLabel}>Team Size</span>
                  <span className={styles.infoValue}>{event.teamSize}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <HiOutlineCurrencyRupee size={18} />
                <div>
                  <span className={styles.infoLabel}>Registration Fee</span>
                  <span className={styles.infoValue}>
                    {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
                  </span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <HiOutlineTrophy size={18} />
                <div>
                  <span className={styles.infoLabel}>Prize Pool</span>
                  <span className={styles.infoValue}>₹{event.prizePool.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <div className={styles.rulesSection}>
                <h4 className={styles.rulesTitle}>Rules</h4>
                <ul className={styles.rulesList}>
                  {event.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* POC */}
            {event.poc && (
              <div className={styles.pocSection}>
                <h4 className={styles.rulesTitle}>Point of Contact</h4>
                <div className={styles.pocInfo}>
                  <span className={styles.pocName}>{event.poc.name}</span>
                  <a href={`tel:${event.poc.phone}`} className={styles.pocLink}>
                    <HiOutlinePhone size={14} /> {event.poc.phone}
                  </a>
                  <a href={`mailto:${event.poc.email}`} className={styles.pocLink}>
                    <HiOutlineMail size={14} /> {event.poc.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className={styles.modalFooter}>
            <Link
              href={`/register?event=${event.slug}`}
              className="btn-primary"
              onClick={onClose}
            >
              <span>Register for {event.name}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
