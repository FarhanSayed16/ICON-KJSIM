'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { HiOutlineMail } from 'react-icons/hi';
import { submitBrochure } from '@/app/actions/submitBrochure';
import styles from './Brochure.module.css';

export default function Brochure() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('email', email);
      const result = await submitBrochure(null, fd);
      if (result.success) {
        toast.success(result.message);
        setEmail('');
      } else {
        toast.error(result.message || 'Could not submit');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.section} id="brochure">
      <div className="container">
        <ScrollReveal>
          <div className={styles.card}>
            <div className={styles.content}>
              <h2 className={styles.title}>Get the ICON 2026 Brochure</h2>
              <p className={styles.desc}>
                Enter your email to receive our detailed event brochure, rulebooks, and schedule
                directly in your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <div className={styles.iconWrap}>
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
                  aria-label="Email for brochure"
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                <span>{isSubmitting ? 'Sending...' : 'Get Brochure'}</span>
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
