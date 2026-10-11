'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineSparkles } from 'react-icons/hi';
import ParticleBackground from './ParticleBackground';
import Countdown from '@/components/Countdown/Countdown';
import { SITE_CONFIG } from '@/lib/data';
import styles from './Hero.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Hero({ siteConfig, eventCount }) {
  const config = siteConfig || SITE_CONFIG;
  const count = typeof eventCount === 'number' ? eventCount : SITE_CONFIG.stats?.events || 0;
  const year = (config.edition || config.eventDates?.start || '2026').toString().slice(0, 4) || '2026';

  return (
    <section className={styles.hero} id="hero">
      <ParticleBackground />
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.gridGlow} />
      </div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className={styles.title}>
          <span className={styles.titleGradient}>ICON</span>
          <span className={styles.titleYear}>{year}</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.tagline}>
          {config.slogan || config.tagline || SITE_CONFIG.tagline}
        </motion.p>

        <motion.p variants={itemVariants} className={styles.subtitle}>
          {config.description || SITE_CONFIG.description} ·{' '}
          {config.institution || SITE_CONFIG.institution}
        </motion.p>

        <motion.ul variants={itemVariants} className={styles.highlights}>
          <li>
            <HiOutlineCalendar size={16} aria-hidden />
            <span>13–14 Feb 2026</span>
          </li>
          <li>
            <HiOutlineLocationMarker size={16} aria-hidden />
            <span>Mumbai · KJSIM</span>
          </li>
          <li>
            <HiOutlineSparkles size={16} aria-hidden />
            <span>{count}+ Events</span>
          </li>
        </motion.ul>

        <motion.div variants={itemVariants} className={styles.countdownWrapper}>
          <Countdown targetDate={config.countdownTarget || SITE_CONFIG.countdownTarget} />
        </motion.div>

        <motion.div variants={itemVariants} className={styles.ctas}>
          <Link href="/register" className={`btn-primary ${styles.ctaPrimary}`}>
            <span>Register Now</span>
            <HiArrowRight />
          </Link>
          <Link href="/events" className={`btn-outline ${styles.ctaSecondary}`}>
            <span>Explore Events</span>
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className={styles.dateTag}>
          Official Techfest · Department of Data Science &amp; Technology
        </motion.p>
      </motion.div>
    </section>
  );
}
