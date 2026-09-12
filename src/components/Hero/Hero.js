'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import ParticleBackground from './ParticleBackground';
import Countdown from '@/components/Countdown/Countdown';
import { SITE_CONFIG } from '@/lib/data';
import styles from './Hero.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <ParticleBackground />

      <div className={styles.overlay} />

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >


        {/* Main Title */}
        <motion.h1 variants={itemVariants} className={styles.title}>
          <span className={styles.titleGradient}>ICON</span>
          <span className={styles.titleYear}>2026</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p variants={itemVariants} className={styles.tagline}>
          {SITE_CONFIG.tagline}
        </motion.p>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className={styles.subtitle}>
          {SITE_CONFIG.description} · {SITE_CONFIG.institution}
        </motion.p>

        {/* Countdown */}
        <motion.div variants={itemVariants} className={styles.countdownWrapper}>
          <Countdown targetDate={SITE_CONFIG.countdownTarget} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className={styles.ctas}>
          <Link href="/register" className={`btn-primary ${styles.ctaPrimary}`}>
            <span>Register Now</span>
            <HiArrowRight />
          </Link>
          <Link href="/events" className={`btn-outline ${styles.ctaSecondary}`}>
            <span>Explore Events</span>
          </Link>
        </motion.div>

        {/* Event Date Tag */}
        <motion.p variants={itemVariants} className={styles.dateTag}>
          February 13–14, 2026 · Mumbai
        </motion.p>
      </motion.div>


    </section>
  );
}
