'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiArrowRight } from 'react-icons/hi';

// Rich two-line navigation items inspired by the Mammut interactive design
export const NAV_ITEMS = [
  {
    category: 'Experience',
    title: 'Home',
    subtitle: 'KJSIM Techfest',
    href: '/',
  },
  {
    category: 'Competitions',
    title: 'Events',
    subtitle: '13+ Challenges',
    href: '/events',
  },
  {
    category: 'Coding',
    title: 'Hackathon',
    subtitle: 'Code ICON 2026',
    href: '/hackathon',
  },
  {
    category: 'Moments',
    title: 'Gallery',
    subtitle: 'Editions & Highlights',
    href: '/gallery',
  },
  {
    category: 'Partners',
    title: 'Sponsors',
    subtitle: 'Our Patrons',
    href: '/sponsors',
  },
  {
    category: 'People',
    title: 'Core Team',
    subtitle: 'Organizing Leads',
    href: '/team',
  },
  {
    category: 'Broadcast',
    title: 'Live Stage',
    subtitle: 'Watch Stream',
    href: '/live',
  },
];

export default function Navbar() {
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);
  const [isDesktopPinned, setIsDesktopPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const pathname = usePathname();

  // Mouse enter / leave handling with smooth grace period
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsDesktopHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDesktopHovered(false);
    }, 240);
  };

  // Load pinned state from cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('icon_navbar_pinned');
      if (cached === 'true') {
        requestAnimationFrame(() => setIsDesktopPinned(true));
      }
    } catch {
      // localStorage may not be accessible in private browsing
    }
  }, []);

  // Toggle desktop pinned state and persist to cache
  const toggleDesktopPin = (e) => {
    e.stopPropagation();
    setIsDesktopPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('icon_navbar_pinned', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  // Close temporary menus on route change (preserve pinned state from cache)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileOpen(false);
      setIsDesktopHovered(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle Escape key to close pinned/open states
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setIsDesktopPinned(false);
        setIsDesktopHovered(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  const isDesktopOpen = isDesktopHovered || isDesktopPinned;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP INTERACTIVE DROP-DOWN HEADER (lg and above)
          - Retracts up by default (stays up).
          - Center hanging tab stays visible at the top edge.
          - Slides down smoothly when hovered or pinned.
          ───────────────────────────────────────────────────────────── */}
      {/* Invisible top edge trigger strip */}
      <div
        className="hidden lg:block fixed top-0 left-0 right-0 h-3 z-[999] pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        aria-hidden="true"
      />

      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-[1000] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDesktopOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_12px_32px_rgba(0,0,0,0.08)] py-3 px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-between gap-4 max-w-7xl mx-auto"
            aria-label="Main desktop navigation"
          >
            {/* Somaiya Brand Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 pr-2 group"
              aria-label="Home — K J Somaiya Institute of Management"
            >
              <Image
                src="/images/kjsim_logo.jpg"
                alt="KJ Somaiya Institute of Management"
                width={160}
                height={46}
                priority
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Menu Items (Two-line Category / Title layout) */}
            <ul className="flex items-center justify-center gap-5 xl:gap-7 list-none m-0 p-0 flex-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className="flex flex-col text-left py-1 px-1 transition-all"
                    >
                      {/* <span
                        className={`font-['Fira_Sans'] text-[0.68rem] font-bold uppercase tracking-wider transition-colors ${
                          active
                            ? 'text-[#ED1C24]'
                            : 'text-[#B7202E] group-hover:text-[#ED1C24]'
                        }`}
                      >
                        {item.category}
                      </span> */}
                      <span
                        className={`font-['Marcellus'] text-[0.92rem] transition-colors leading-snug whitespace-nowrap ${active
                          ? 'text-[#B7202E] font-semibold'
                          : 'text-[#231F20] group-hover:text-[#B7202E]'
                          }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                    {active && (
                      <span className="absolute -bottom-1 left-1 right-1 h-[2px] bg-[#B7202E] rounded-full" />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right: Register CTA & ICON Logo */}
            <div className="flex items-center gap-3.5 shrink-0 pl-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 py-2 px-5 bg-gradient-to-r from-[#B7202E] to-[#ED1C24] hover:from-[#9B1925] hover:to-[#B7202E] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Register</span>
                <HiArrowRight size={14} />
              </Link>
              <Link href="/" aria-label="ICON 2026 Home">
                <Image
                  src="/images/icon_logo.png"
                  alt="ICON 2026"
                  width={50}
                  height={44}
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </Link>
            </div>
          </nav>
        </div>

        {/* ── Center Hanging Handle/Tab with `=` Icon ──
            Resting at top:0 when header is retracted;
            Hanging at bottom edge when header is open. */}
        <button
          type="button"
          onClick={toggleDesktopPin}
          onMouseEnter={handleMouseEnter}
          className="absolute top-full left-1/2 -translate-x-1/2 w-24 h-7 bg-white/95 backdrop-blur-md border-x border-b border-[#E5E7EB] rounded-b-xl shadow-md flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50 hover:h-8 group"
          aria-label={
            isDesktopOpen
              ? 'Retract menu or click to toggle pin'
              : 'Open menu'
          }
          title={isDesktopPinned ? 'Pinned open (Click to release)' : 'Click to pin open'}
        >
          <div className="flex flex-col gap-[3px] items-center justify-center pointer-events-none">
            <span
              className={`w-5 h-[2px] rounded-full transition-all duration-300 ${isDesktopPinned ? 'bg-[#B7202E] w-6' : 'bg-[#231F20] group-hover:bg-[#B7202E]'
                }`}
            />
            <span
              className={`w-5 h-[2px] rounded-full transition-all duration-300 ${isDesktopPinned ? 'bg-[#B7202E] w-6' : 'bg-[#231F20] group-hover:bg-[#B7202E]'
                }`}
            />
          </div>
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE FLOATING ACTION BUBBLE (Bottom-Left)
          - Screen is 100% immersive with zero top obstruction.
          - Floating circular button at bottom-6 left-6 with `=` icon.
          ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-[1000] w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-[#231F20]/15 hover:border-[#B7202E] text-[#231F20] hover:text-[#B7202E] transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
      >
        <div className="flex flex-col gap-1.5 items-center justify-center pointer-events-none">
          <span className="w-5 h-[2px] bg-current rounded-full transition-transform" />
          <span className="w-5 h-[2px] bg-current rounded-full transition-transform" />
        </div>
      </button>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE FULL-SCREEN BOTTOM SHEET / MENU
          - Opens from bottom when bubble is tapped.
          - Top card with featured visual.
          - Center vertically stacked two-line menu items.
          - Fixed X close bubble at bottom-left in matching position.
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1001] bg-white lg:hidden flex flex-col justify-between overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="p-6 sm:p-8 flex flex-col min-h-full max-w-lg mx-auto w-full">
              {/* Top Featured Visual Card */}
              <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-[#231F20] relative aspect-[16/10] shrink-0 mb-6">
                <Image
                  src="/images/gallery/11.webp"
                  alt="ICON 2026 DATATRON"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#ED1C24] font-['Fira_Sans']">
                      Feb 13–14, 2026
                    </span>
                    <h3 className="font-['Marcellus'] text-white text-xl sm:text-2xl font-normal leading-tight">
                      ICON 2026 — DATATRON
                    </h3>
                    <p className="text-white/80 font-['Fira_Sans'] text-xs">
                      Dept. of Data Science &amp; Technology
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#B7202E] text-white text-xs font-bold font-['Fira_Sans'] shadow-md">
                    KJSIM
                  </span>
                </div>
              </div>

              {/* Centered Vertically Stacked Navigation Items */}
              <nav
                className="flex flex-col items-center justify-center gap-4 sm:gap-5 my-auto py-2"
                aria-label="Mobile menu links"
              >
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex flex-col items-center text-center transition-transform active:scale-95 py-0.5"
                    >
                      {/* <span
                        className={`font-['Fira_Sans'] text-[0.72rem] font-bold uppercase tracking-widest transition-colors mb-0.5 ${
                          active
                            ? 'text-[#ED1C24]'
                            : 'text-[#B7202E] group-hover:text-[#ED1C24]'
                        }`}
                      >
                        {item.category}
                      </span> */}
                      <span
                        className={`font-['Marcellus'] text-xl sm:text-2xl transition-colors leading-tight ${active
                          ? 'text-[#B7202E] font-semibold'
                          : 'text-[#231F20] group-hover:text-[#B7202E]'
                          }`}
                      >
                        {item.title}
                      </span>
                      <span className="font-['Fira_Sans'] text-xs text-[#58595B]/75 transition-colors">
                        {item.subtitle}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile CTA: Register for Passes */}
              <div className="w-full mt-6 mb-24 text-center">
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full justify-center py-3.5 text-base font-bold shadow-lg hover:shadow-xl transition-all rounded-full flex items-center gap-2 bg-gradient-to-r from-[#B7202E] to-[#ED1C24] text-white cursor-pointer"
                >
                  <span>Register for Passes</span>
                  <HiArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* ── Bottom-Left Close Bubble (Exact match to opening bubble position) ── */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="fixed bottom-6 left-6 z-[1002] w-14 h-14 rounded-full bg-white shadow-2xl border-2 border-[#ED1C24] text-[#ED1C24] hover:bg-[#ED1C24] hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Close navigation menu"
            >
              <HiX size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
