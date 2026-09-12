'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineSparkles } from 'react-icons/hi';
import ParticleBackground from './ParticleBackground';
import Countdown from '@/components/Countdown/Countdown';
import { SITE_CONFIG, EVENTS } from '@/lib/data';
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

const activeEventCount = EVENTS.filter((e) => e.isActive).length;

export default function Hero() {
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
          <span className={styles.titleYear}>2026</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.tagline}>
          {SITE_CONFIG.tagline}
        </motion.p>

        <motion.p variants={itemVariants} className={styles.subtitle}>
          {SITE_CONFIG.description} · {SITE_CONFIG.institution}
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
            <span>{activeEventCount}+ Events</span>
          </li>
        </motion.ul>

        <motion.div variants={itemVariants} className={styles.countdownWrapper}>
          <Countdown targetDate={SITE_CONFIG.countdownTarget} />
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
