'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowsExpand,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineLocationMarker,
  HiArrowRight,
} from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { Marcellus, Fira_Sans } from 'next/font/google';

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

// Curated high-impact fest highlights across multiple festival vibes
const HIGHLIGHT_MOMENTS = [
  {
    id: 1,
    src: '/images/gallery/44.webp',
    category: 'hackathon',
    badge: 'FLAGSHIP • AUDITORIUM',
    title: 'Hackathon 24H Grand Finales',
    venue: 'KJSIM Main Auditorium',
    description: 'Finalist teams presenting predictive models and full-stack solutions to industry executives.',
    featured: true,
  },
  {
    id: 2,
    src: '/images/events/Icon_BGMI.jpeg',
    category: 'gaming',
    badge: 'ESPORTS • ARENA',
    title: 'Battle Royale Showdowns',
    venue: 'Esports Gaming Arena (Lab-102)',
    description: 'Knockout matches in custom competitive tournament rooms with live spectator feeds.',
    featured: false,
  },
  {
    id: 3,
    src: '/images/events/Icon_Hackathon.jpeg',
    category: 'hackathon',
    badge: 'CODE • 24 HOURS',
    title: 'Late Night Code Sprints',
    venue: 'Innovation Tech Lab 205',
    description: 'Teams debugging machine learning pipelines and algorithm challenges past midnight.',
    featured: false,
  },
  {
    id: 4,
    src: '/images/events/icon_techfair.png',
    category: 'campus',
    badge: 'EXHIBITS • INNOVATION',
    title: 'Tech Fair Project Demos',
    venue: 'Campus Open Amphitheatre',
    description: 'Live hardware exhibits, robotics, and cutting-edge software displays built by students.',
    featured: false,
  },
  {
    id: 5,
    src: '/images/events/pickleball.jpeg',
    category: 'campus',
    badge: 'TURF • SPORTS',
    title: 'Turf Paddle Championships',
    venue: 'Somaiya Sports Courts',
    description: 'Fast-paced, high-stakes rallies bringing campus athletes and participants together.',
    featured: false,
  },
  {
    id: 6,
    src: '/images/gallery/2.webp',
    category: 'campus',
    badge: 'KEYNOTE • CROWDS',
    title: 'Award Ceremony & Keynote',
    venue: 'Seminar Hall & Main Stage',
    description: 'Over 1,000+ attendees celebrating champion teams and trophy distribution ceremonies.',
    featured: false,
  },
  {
    id: 7,
    src: '/images/events/fifa.jpeg',
    category: 'gaming',
    badge: 'CONSOLE • EA FC',
    title: 'EA FC Console Tournaments',
    venue: 'Student Lounge Gaming Stage',
    description: '1v1 intense matches played on PlayStation 5 with live commentary and spectator cheering.',
    featured: false,
  },
  {
    id: 8,
    src: '/images/gallery/11.webp',
    category: 'hackathon',
    badge: 'MENTORSHIP • JURY',
    title: 'Industry Jury Evaluations',
    venue: 'Conference Hall B',
    description: 'Senior architects evaluating system resilience, API architecture, and prototype viability.',
    featured: false,
  },
  {
    id: 9,
    src: '/images/events/Icon_chess.jpeg',
    category: 'gaming',
    badge: 'MIND SPORTS • CHESS',
    title: 'Rapid Blitz Chess Arena',
    venue: 'Library Quiet Zone Stage',
    description: 'Timed blitz encounters testing strategic foresight and rapid tactical decision-making.',
    featured: false,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Highlights' },
  { id: 'hackathon', label: 'Hackathon & Tech' },
  { id: 'gaming', label: 'Gaming & Esports' },
  { id: 'campus', label: 'Campus & Sports' },
];

export default function GalleryPreview() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredMoments =
    activeCategory === 'all'
      ? HIGHLIGHT_MOMENTS
      : HIGHLIGHT_MOMENTS.filter((item) => item.category === activeCategory);

  const activePhoto = lightboxIndex !== null ? HIGHLIGHT_MOMENTS[lightboxIndex] : null;

  const openLightbox = (id) => {
    const idx = HIGHLIGHT_MOMENTS.findIndex((m) => m.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev === HIGHLIGHT_MOMENTS.length - 1 ? 0 : prev + 1));
  }, []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? HIGHLIGHT_MOMENTS.length - 1 : prev - 1));
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F8] relative overflow-hidden" id="gallery">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
                <span
                  className="font-['Fira_Sans'] font-fira-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]"
                  style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                >
                  FESTIVAL ARCHIVES
                </span>
              </div>
              <h2
                className="font-['Marcellus'] font-marcellus text-4xl sm:text-5xl md:text-6xl text-[#231F20] font-normal tracking-tight m-0"
                style={{ fontFamily: "'Marcellus', Georgia, serif" }}
              >
                ICON Highlights
              </h2>
            </div>

            <p
              className="font-['Fira_Sans'] font-fira-sans text-sm sm:text-base text-[#58595B] max-w-md m-0 leading-relaxed"
              style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
            >
              Glimpses of raw energy, 24-hour code marathons, esports battles, and unforgettable moments at KJSIM.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Filter Vibe Tabs with Fluid Sliding Pill ── */}
        <ScrollReveal variant="fade-up" delay={0.05}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10" role="tablist">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative font-['Fira_Sans'] font-fira-sans text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors duration-200 cursor-pointer outline-none border ${isActive
                    ? 'text-power-red border-[#B7202E]'
                    : 'text-[#58595B] bg-white border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
                    }`}
                  style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeGalleryVibePill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-[#B7202E] rounded-full -z-10 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ── Seamless Instant Bento Gallery Grid Container ── */}
        <div className="relative min-h-[420px] mb-12 sm:mb-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {filteredMoments.map((item) => {
                const isLargeHero = item.featured && activeCategory === 'all';
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#231F20] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${isLargeHero ? 'sm:col-span-2 sm:row-span-2 min-h-[380px] sm:min-h-[460px]' : 'min-h-[260px] sm:min-h-[290px]'
                      }`}
                    onClick={() => openLightbox(item.id)}
                  >
                    {/* Photo Visual */}
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                      sizes={isLargeHero ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                      priority={isLargeHero}
                    />

                    {/* Top-Right Somaiya Edge Notch Hover Accent */}
                    <div className="absolute top-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-1 bg-[#ED1C24]" />
                      <div className="w-1 h-6 bg-[#ED1C24] absolute top-0 right-0" />
                    </div>

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-300" />

                    {/* Top Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="font-['Fira_Sans'] font-fira-sans inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[0.68rem] sm:text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/15"
                        style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
                        {item.badge}
                      </span>
                    </div>

                    {/* Expand Icon on Top-Right */}
                    <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 border border-white/20">
                      <HiOutlineArrowsExpand size={16} />
                    </div>

                    {/* Bottom Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1.5">
                        <HiOutlineLocationMarker size={14} className="text-[#ED1C24] shrink-0" />
                        <span
                          className="font-['Fira_Sans'] font-fira-sans font-medium tracking-wide"
                          style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                        >
                          {item.venue}
                        </span>
                      </div>

                      <h3
                        className="font-['Marcellus'] font-marcellus text-lg sm:text-xl md:text-2xl text-white font-normal leading-snug group-hover:text-white transition-colors mb-1"
                        style={{ fontFamily: "'Marcellus', Georgia, serif" }}
                      >
                        {item.title}
                      </h3>

                      {isLargeHero && (
                        <p
                          className="font-['Fira_Sans'] font-fira-sans text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 max-w-xl m-0 mt-1"
                          style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Built-in Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer border-0 outline-none"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              <HiX size={24} />
            </button>

            {/* Previous Button */}
            <button
              type="button"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-[#B7202E] p-3 rounded-full transition-all cursor-pointer border-0 outline-none shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              aria-label="Previous photo"
            >
              <HiChevronLeft size={26} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-[#B7202E] p-3 rounded-full transition-all cursor-pointer border-0 outline-none shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              aria-label="Next photo"
            >
              <HiChevronRight size={26} />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-white/15 bg-black">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Photo Caption & Metadata */}
              <div className="w-full mt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-white px-2">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
                    <span
                      className={`${firaSans.className} font-fira-sans text-xs font-bold uppercase tracking-wider text-[#ED1C24]`}
                      style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                    >
                      {activePhoto.badge}
                    </span>
                    <span className="text-white/40 text-xs">•</span>
                    <span
                      className={`${firaSans.className} font-fira-sans text-xs text-white/70`}
                      style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                    >
                      {activePhoto.venue}
                    </span>
                  </div>
                  <h4
                    className={`${marcellus.className} font-marcellus text-xl sm:text-2xl text-white font-normal m-0`}
                    style={{ fontFamily: "'Marcellus', Georgia, serif" }}
                  >
                    {activePhoto.title}
                  </h4>
                </div>

                <div
                  className={`${firaSans.className} font-fira-sans text-xs text-white/60 px-3 py-1.5 rounded-full bg-white/10`}
                  style={{ fontFamily: "'Fira Sans', -apple-system, sans-serif" }}
                >
                  {lightboxIndex + 1} of {HIGHLIGHT_MOMENTS.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
