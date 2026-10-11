'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlassPlus,
  HiXMark,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineSparkles,
  HiOutlineCamera,
  HiOutlineTag,
} from 'react-icons/hi2';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';

const DEFAULT_GALLERY = [
  {
    _id: '1',
    src: '/images/gallery/11.webp',
    alt: 'CodeICON 24-Hour Hackathon Arena',
    title: 'CodeICON 24-Hour Hackathon Arena',
    category: 'hackathon',
    edition: 'ICON 2025',
    aspect: 'aspect-[16/10]',
  },
  {
    _id: '2',
    src: '/images/gallery/2.webp',
    alt: 'Auditorium Keynote Stage & Innovation Summit',
    title: 'Keynote Stage & Innovation Summit',
    category: 'keynote',
    edition: 'ICON 2025',
    aspect: 'aspect-[4/3]',
  },
  {
    _id: '3',
    src: '/images/events/football.jpeg',
    alt: 'Inter-College Turf Football Championship',
    title: 'Inter-College Turf Football Finals',
    category: 'sports',
    edition: 'ICON 2025',
    aspect: 'aspect-[4/5]',
  },
  {
    _id: '4',
    src: '/images/gallery/44.webp',
    alt: 'Robotics, AI & Strategic Mind Sports Arena',
    title: 'Robotics, AI & Strategic Chess Arena',
    category: 'tech',
    edition: 'ICON 2024',
    aspect: 'aspect-[16/10]',
  },
  {
    _id: '5',
    src: '/images/gallery/5.webp',
    alt: 'Grand Finale & Felicitation Ceremony',
    title: 'Grand Finale & Felicitation Ceremony',
    category: 'ceremony',
    edition: 'ICON 2025',
    aspect: 'aspect-[16/10]',
  },
  {
    _id: '6',
    src: '/images/events/Icon_Hackathon.jpeg',
    alt: 'Late Night Code Sprint & Mentorship Review',
    title: 'Midnight Code Sprint & Mentorship',
    category: 'hackathon',
    edition: 'ICON 2025',
    aspect: 'aspect-[4/5]',
  },
  {
    _id: '7',
    src: '/images/events/pickleball.jpeg',
    alt: 'Campus Pickleball Open Championship',
    title: 'Pickleball Open Championship',
    category: 'sports',
    edition: 'ICON 2025',
    aspect: 'aspect-[4/5]',
  },
  {
    _id: '8',
    src: '/images/events/icon_techfair.png',
    alt: 'Innovation Tech Fair & Hardware Projects',
    title: 'Technical Project Expo & Fair',
    category: 'tech',
    edition: 'ICON 2025',
    aspect: 'aspect-[1/1]',
  },
  {
    _id: '9',
    src: '/images/events/Icon_BGMI.jpeg',
    alt: 'Esports Championship: Battle Arena',
    title: 'BGMI Esports Mobile Tournament',
    category: 'sports',
    edition: 'ICON 2024',
    aspect: 'aspect-[4/5]',
  },
  {
    _id: '10',
    src: '/images/gallery/33.webp',
    alt: 'Sports Arena Turf Showdowns & Spirit',
    title: 'Turf Sports Showdown & Spirit',
    category: 'sports',
    edition: 'ICON 2024',
    aspect: 'aspect-[4/3]',
  },
  {
    _id: '11',
    src: '/images/events/Icon_TreasureHunt.jpeg',
    alt: 'Campus Clue Trails & Treasure Hunt',
    title: 'Campus Discovery & Treasure Hunt',
    category: 'ceremony',
    edition: 'ICON 2025',
    aspect: 'aspect-[4/5]',
  },
  {
    _id: '12',
    src: '/images/events/fifa.jpeg',
    alt: 'Console Gaming FIFA Championship',
    title: 'Console Gaming: FIFA Showdown',
    category: 'sports',
    edition: 'ICON 2024',
    aspect: 'aspect-[16/10]',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Highlights' },
  { key: 'hackathon', label: 'CodeICON Hackathon' },
  { key: 'keynote', label: 'Keynote & Summit' },
  { key: 'sports', label: 'Sports Arena' },
  { key: 'tech', label: 'Tech & Robocon Expo' },
  { key: 'ceremony', label: 'Felicitation & Awards' },
];

export default function GalleryClient() {
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const enriched = json.data.map((item, idx) => ({
            ...item,
            category: item.category || DEFAULT_GALLERY[idx % DEFAULT_GALLERY.length]?.category || 'hackathon',
            edition: item.edition || 'ICON Archive',
            aspect: item.aspect || DEFAULT_GALLERY[idx % DEFAULT_GALLERY.length]?.aspect || 'aspect-[4/3]',
          }));
          setGalleryItems(enriched);
        }
      } catch {
        // Fallback to static items
      }
    }
    loadGallery();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: galleryItems.length };
    galleryItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [galleryItems, activeCategory]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  }, [filteredItems.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  }, [filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, showNext, showPrev]);

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-32 bg-[#FAF8F8] min-h-screen relative overflow-hidden">
      {/* ── Signature Somaiya Edge Graphic Device ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Page Header ── */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 pt-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                FESTIVAL ARCHIVES
              </span>
            </div>
            <h1 className="font-['Marcellus'] text-4xl sm:text-6xl lg:text-7xl font-normal text-[#231F20] leading-tight tracking-tight mb-4">
              Memories of ICON
            </h1>
            <p className="font-['Fira_Sans'] text-base sm:text-lg text-[#58595B] max-w-xl mx-auto leading-relaxed">
              From intense 3 AM hackathon debugging to exhilarating turf finals and trophy ceremonies. Relive the defining moments.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Category Filter Pills ── */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10 sm:mb-12 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-['Fira_Sans'] font-medium transition-all duration-200 cursor-pointer outline-none flex items-center gap-2 border ${
                    isActive
                      ? 'text-white border-[#B7202E] shadow-xs'
                      : 'text-[#58595B] bg-white border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeGalleryTabPill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-[#B7202E] rounded-full -z-10"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                  <span
                    className={`relative z-10 text-[0.68rem] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#58595B]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ── Dynamic Uneven Masonry Gallery Grid ── */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-7">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((img, index) => (
              <motion.div
                key={img._id || img.src || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid mb-6 sm:mb-7"
              >
                <div
                  className={`group relative ${img.aspect || 'aspect-[4/3]'} w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5E7EB] bg-white cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:border-[#B7202E]/60 outline-none focus-visible:ring-2 focus-visible:ring-[#B7202E]`}
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.alt || img.title || 'gallery image'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openLightbox(index);
                  }}
                >
                  {/* Background Festival Image */}
                  <Image
                    src={img.src}
                    alt={img.alt || img.title || 'ICON Festival Highlight'}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />

                  {/* Subtle Somaiya Architectural Corner Device on Hover */}
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                    <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                  </div>

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 opacity-70 group-hover:opacity-85 transition-opacity duration-300 z-10" />

                  {/* Top Badge: Edition */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-['Fira_Sans'] text-xs font-semibold uppercase tracking-wider shadow-sm">
                      <HiOutlineCamera size={13} className="text-[#ED1C24]" />
                      <span>{img.edition || 'ICON Moment'}</span>
                    </span>
                  </div>

                  {/* Bottom Overlay Info & Action */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3 z-20">
                    <div className="min-w-0 pr-2">
                      <span className="inline-flex items-center gap-1 text-[0.7rem] uppercase font-bold tracking-widest text-[#ED1C24] mb-1 font-['Fira_Sans']">
                        <HiOutlineTag size={12} className="shrink-0" />
                        <span className="capitalize truncate">{img.category || 'Highlight'}</span>
                      </span>
                      <h3 className="font-['Marcellus'] text-lg sm:text-xl text-white font-normal drop-shadow-sm leading-snug line-clamp-2">
                        {img.title || img.alt}
                      </h3>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:border-[#ED1C24] transition-all shadow-sm">
                      <HiOutlineMagnifyingGlassPlus size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Archive Experience Ribbon ── */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 sm:mt-24 bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 shadow-xs text-center max-w-4xl mx-auto relative overflow-hidden">
            {/* Somaiya Corner Device */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-2.5 bg-[#ED1C24]" />
              <div className="absolute top-0 right-0 w-2.5 h-12 bg-[#B7202E]" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <HiOutlineSparkles size={18} className="text-[#ED1C24]" />
              <span className="font-['Fira_Sans'] text-xs font-bold tracking-widest uppercase text-[#B7202E]">
                LEGACY OF EXCELLENCE
              </span>
            </div>
            <h3 className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-3">
              Celebrating Innovation Year After Year
            </h3>
            <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed max-w-2xl mx-auto">
              Every photograph marks a breakthrough project, a high-stakes match, or an unforgettable celebration of student ambition. Be part of the next chapter at ICON 2026.
            </p>
          </div>
        </ScrollReveal>

      </div>

      {/* ── Cinematic Lightbox ── */}
      {lightboxOpen && filteredItems[currentIndex] && (
        <div
          className="fixed inset-0 z-[1200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div
            className="w-full flex items-center justify-between z-50 text-white/90 pt-2 px-2 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-['Fira_Sans'] text-xs uppercase tracking-widest text-[#ED1C24] font-bold block">
                {filteredItems[currentIndex].edition || 'ICON ARCHIVE'}
              </span>
              <h4 className="font-['Marcellus'] text-lg sm:text-xl text-white font-normal">
                {filteredItems[currentIndex].title || filteredItems[currentIndex].alt}
              </h4>
            </div>

            <button
              className="text-white/80 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
              autoFocus
            >
              <HiXMark size={26} />
            </button>
          </div>

          {/* Main Visual Display */}
          <div
            className="relative max-w-6xl max-h-[72vh] w-full h-[72vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredItems[currentIndex].src}
              alt={filteredItems[currentIndex].alt || filteredItems[currentIndex].title || 'Gallery image'}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />

            {/* Prev Button */}
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3.5 rounded-full hover:bg-white/20 transition-all cursor-pointer bg-black/40 backdrop-blur-md border border-white/10 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
            >
              <HiChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3.5 rounded-full hover:bg-white/20 transition-all cursor-pointer bg-black/40 backdrop-blur-md border border-white/10 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
            >
              <HiChevronRight size={28} />
            </button>
          </div>

          {/* Filmstrip Thumbnail Bar */}
          <div
            className="w-full max-w-3xl flex items-center justify-center gap-3 overflow-x-auto py-2 px-4 z-50 scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems.map((item, idx) => (
              <button
                key={item._id || item.src || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#ED1C24] scale-110 shadow-md ring-2 ring-[#ED1C24]/50'
                    : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={item.src} alt={item.title || 'Thumbnail'} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
