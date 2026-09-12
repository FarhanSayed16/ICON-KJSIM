'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import ParticleBackground from './ParticleBackground';
import Countdown from '@/components/Countdown/Countdown';
import { SITE_CONFIG, EVENTS, EVENT_CATEGORIES } from '@/lib/data';
import styles from './Hero.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const activeEventCount = EVENTS.filter((e) => e.isActive).length;
const featuredNames = EVENTS.filter((e) => e.isActive)
  .slice(0, 8)
  .map((e) => e.name);

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <ParticleBackground />
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.gridGlow} />
        <span className={styles.brandMark}>ICON</span>
      </div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className={styles.stage}>
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>ICON</span>
            <span className={styles.titleYear}>2026</span>
          </h1>

          <p className={styles.tagline}>{SITE_CONFIG.tagline}</p>

          <p className={styles.subtitle}>
            {SITE_CONFIG.description}
            <span className={styles.subtitleBreak}> · {SITE_CONFIG.institution}</span>
          </p>

          <div className={styles.metaBar} aria-label="Event details">
            <span>13–14 Feb 2026</span>
            <span className={styles.metaDot} aria-hidden />
            <span>Mumbai · KJSIM</span>
            <span className={styles.metaDot} aria-hidden />
            <span>{activeEventCount}+ Events</span>
          </div>

          <div className={styles.trackRow} aria-label="Event tracks">
            {EVENT_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
              <span key={cat.key} className={styles.trackChip}>
                {cat.label}
              </span>
            ))}
          </div>

          <div className={styles.countdownWrapper}>
            <Countdown targetDate={SITE_CONFIG.countdownTarget} />
          </div>

          <div className={styles.ctas}>
            <Link href="/register" className={`btn-primary ${styles.ctaPrimary}`}>
              <span>Register Now</span>
              <HiArrowRight />
            </Link>
            <Link href="/events" className={`btn-outline ${styles.ctaSecondary}`}>
              <span>Explore Events</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...featuredNames, ...featuredNames].map((name, i) => (
            <span key={`${name}-${i}`} className={styles.tickerItem}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
