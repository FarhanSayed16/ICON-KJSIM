'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Marcellus, Fira_Sans } from 'next/font/google';
import InteractiveGridBackground from './InteractiveGridBackground';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemSlideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemTitle = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemBadge = {
  hidden: { opacity: 0, scale: 0.88, x: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ siteConfig, eventCount } = {}) {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] bg-white overflow-hidden flex items-center"
    >
      {/* ── Interactive Grid Canvas (Squares turn brand red on hover, fade after 1s) ── */}
      <InteractiveGridBackground />

      {/* ── Top-Right Somaiya Edge Corner Accent (with #ED1C24 Vitality Notch) ── */}
      <motion.div
        className="absolute top-0 right-0 z-10 pointer-events-none"
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="w-24 sm:w-36 h-3 bg-[#B7202E] flex">
          <div className="flex-1 h-full bg-[#B7202E]" />
          <div className="w-8 sm:w-12 h-full bg-[#ED1C24]" />
        </div>
        <div className="w-3 h-16 sm:h-24 bg-[#B7202E] absolute top-0 right-0 flex flex-col justify-end">
          <div className="w-full h-6 sm:h-8 bg-[#ED1C24]" />
        </div>
      </motion.div>

      {/* ── Left-Aligned Editorial Hero Content (from Mockup) ── */}
      <div className="container max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-28 sm:py-32 relative z-10">
        <motion.div
          className="max-w-2xl sm:max-w-3xl lg:max-w-4xl text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Institutional Kicker */}
          <motion.div variants={itemSlideLeft} className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0 animate-pulse" />
            <span
              className={`${firaSans.className} font-fira-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#58595B]`}
              style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
            >
              {siteConfig?.university
                ? `${siteConfig.university.toUpperCase()} PRESENTS`
                : 'SOMAIYA VIDYAVIHAR UNIVERSITY PRESENTS'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemTitle}
            className={`${marcellus.className} font-marcellus text-[clamp(3.5rem,10.5vw,9.5rem)] text-[#231F20] font-normal leading-[0.84] tracking-tight mb-4 sm:mb-5 select-none`}
            style={{ fontFamily: "'Marcellus', Georgia, serif" }}
          >
            {siteConfig?.name || 'ICON'}
          </motion.h1>

          {/* Red "26" Badge Box */}
          <motion.div
            variants={itemBadge}
            className="inline-block bg-[#B7202E] border-l-4 border-[#ED1C24] px-6 sm:px-8 md:px-11 py-1.5 sm:py-2 md:py-2.5 mb-5 sm:mb-7 shadow-sm hover:scale-[1.02] transition-transform duration-200"
          >
            <span
              className={`${marcellus.className} font-marcellus text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal leading-none block`}
              style={{ fontFamily: "'Marcellus', Georgia, serif" }}
            >
              {siteConfig?.edition ? String(siteConfig.edition).slice(-2) : '26'}
            </span>
          </motion.div>

          {/* Theme Row with Animated Accent Line */}
          <motion.div variants={itemSlideLeft} className="flex items-center gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ originX: 0 }}
              className="w-10 sm:w-12 md:w-16 h-1 sm:h-1.5 bg-[#ED1C24] shrink-0"
            />
            <span
              className={`${marcellus.className} font-marcellus text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#B7202E] font-normal`}
              style={{ fontFamily: "'Marcellus', Georgia, serif" }}
            >
              Theme: {siteConfig?.theme || 'Pixel'}
            </span>
          </motion.div>

          {/* Tagline Description */}
          <motion.p
            variants={itemFadeUp}
            className={`${firaSans.className} font-fira-sans text-sm sm:text-base md:text-lg lg:text-xl text-[#58595B] max-w-xl lg:max-w-2xl leading-relaxed mb-7 sm:mb-9 font-normal`}
            style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
          >
            {siteConfig?.tagline || siteConfig?.slogan || 'Every Pixel. A Possibility.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemFadeUp} className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
            <Link
              href="/events"
              className={`bg-[#B7202E] hover:bg-[#ED1C24] text-white ${firaSans.className} font-fira-sans font-semibold text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer no-underline inline-block`}
              style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
            >
              Explore events
            </Link>
            <Link
              href="/register"
              className={`bg-white hover:bg-[#ED1C24] hover:text-white hover:border-[#ED1C24] text-[#231F20] border-2 border-[#231F20] ${firaSans.className} font-fira-sans font-semibold text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer no-underline inline-block`}
              style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
            >
              Register now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
