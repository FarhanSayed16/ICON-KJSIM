'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch,
  HiX,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiArrowRight,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import EventCard from '@/components/EventSchedule/EventCard';
import EventModal from '@/components/EventSchedule/EventModal';
import { EVENTS as DEFAULT_EVENTS } from '@/lib/data';

const EVENT_TRACKS = [
  { key: 'all', label: 'All Competitions', icon: HiOutlineSparkles },
  { key: 'technical', label: 'Technical & Code', icon: HiOutlineSparkles },
  { key: 'non-technical', label: 'Strategy & Non-Tech', icon: HiOutlineUsers },
  { key: 'gaming', label: 'Gaming & Esports', icon: HiOutlineTrophy },
];

export default function EventsClient({ events = [] }) {
  const [eventsList, setEventsList] = useState(() =>
    Array.isArray(events) && events.length > 0
      ? events.filter((e) => !e.isArchived)
      : DEFAULT_EVENTS.filter((e) => !e.isArchived)
  );
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) return;
    async function loadEvents() {
      try {
        const res = await fetch('/api/events?active=true');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setEventsList(json.data.filter((e) => !e.isArchived && e.isActive !== false));
        }
      } catch {
        // Fallback to static
      }
    }
    loadEvents();
  }, [events]);

  // Dynamic Metrics
  const metrics = useMemo(() => {
    const active = eventsList.filter((e) => e.isActive !== false && !e.isArchived);
    const totalPrize = active.reduce((sum, e) => sum + (Number(e.prizePool) || 0), 0);
    const openCount = active.filter((e) => e.registrationStatus !== 'closed').length;
    return {
      totalEvents: active.length,
      totalPrizePool: totalPrize >= 1000 ? `₹${Math.round(totalPrize / 1000)}K+` : `₹${totalPrize}`,
      openCount,
      tracksCount: 3,
    };
  }, [eventsList]);

  // Track counts
  const categoryCounts = useMemo(() => {
    const counts = { all: eventsList.length };
    eventsList.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [eventsList]);

  // Filter & Sort
  const filteredEvents = useMemo(() => {
    let result = [...eventsList];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((e) => e.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.rules?.some((r) => r.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'prize-desc') {
      result.sort((a, b) => (Number(b.prizePool) || 0) - (Number(a.prizePool) || 0));
    } else if (sortBy === 'fee-asc') {
      result.sort((a, b) => (Number(a.registrationFee) || 0) - (Number(b.registrationFee) || 0));
    } else if (sortBy === 'fee-desc') {
      result.sort((a, b) => (Number(b.registrationFee) || 0) - (Number(a.registrationFee) || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [eventsList, activeCategory, searchQuery, sortBy]);

  // Find flagship event for spotlight (CodeICON Hackathon or first featured)
  const spotlightEvent = useMemo(() => {
    return (
      eventsList.find((e) => e.slug === 'hackathon' || e.slug === 'code-icon' || e.isFeatured) ||
      eventsList[0] ||
      null
    );
  }, [eventsList]);

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-32 bg-[#FAF8F8] min-h-screen relative overflow-hidden">
      {/* ── Architectural Somaiya Edge ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Page Header ── */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto pt-4 pb-10 sm:pb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                ARENA OF CHALLENGERS
              </span>
            </div>

            <h1 className="font-['Marcellus'] text-4xl sm:text-6xl lg:text-7xl font-normal text-[#231F20] leading-tight tracking-tight mb-4">
              Events &amp; Competitions
            </h1>

            <p className="font-['Fira_Sans'] text-base sm:text-lg text-[#58595B] max-w-2xl mx-auto leading-relaxed">
              Explore 13+ flagship challenges spanning high-stakes coding, algorithmic strategy, indoor games, and esports tournaments at KJSIM.
            </p>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#B7202E] block">13+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Total Events</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#ED1C24] block">₹50K+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Prize Pools</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] block">1,000+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Participants</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] block">02</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Days of Action</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Flagship Spotlight Banner (If Available) ── */}
        {spotlightEvent && (
          <ScrollReveal delay={0.1}>
            <div className="mb-12 bg-white border-2 border-[#B7202E]/30  p-6 sm:p-8 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-2.5 bg-[#ED1C24]" />
                <div className="absolute top-0 right-0 w-2.5 h-12 bg-[#B7202E]" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B7202E]/10 text-[#B7202E] font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider">
                      <HiOutlineSparkles className="w-3.5 h-3.5" />
                      FLAGSHIP SPOTLIGHT
                    </span>
                    <span className="font-['Fira_Sans'] text-xs text-[#58595B] font-semibold">
                      ₹{spotlightEvent.prizePool || '50,000'} Cash Pool
                    </span>
                  </div>

                  <h3 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] font-normal mb-2">
                    {spotlightEvent.name}
                  </h3>

                  <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed line-clamp-2 m-0">
                    {spotlightEvent.description || 'Our signature 24-hour sprint. Assemble your squad and build the future.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(spotlightEvent)}
                    className="font-['Fira_Sans'] py-3 px-6 rounded-full border border-[#E5E7EB] hover:border-[#B7202E] bg-[#FAF8F8] text-[#231F20] hover:text-[#B7202E] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    View Details
                  </button>

                  <Link
                    href={`/register?event=${spotlightEvent.slug}`}
                    className="font-['Fira_Sans'] btn-primary py-3 px-7 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Register Team</span>
                    <HiArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── Filter & Search Control Center ── */}
        <ScrollReveal delay={0.15}>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 mb-10 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <HiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/70 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                placeholder="Search event, venue, rules..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm font-['Fira_Sans'] text-[#231F20] placeholder-[#58595B]/60 focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#58595B] hover:text-[#B7202E] cursor-pointer"
                  aria-label="Clear search"
                >
                  <HiX size={16} />
                </button>
              )}
            </div>

            {/* Track Tabs */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Event Tracks">
              {EVENT_TRACKS.map((track) => {
                const isActive = activeCategory === track.key;
                const count = categoryCounts[track.key] || 0;

                return (
                  <button
                    key={track.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(track.key)}
                    className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-['Fira_Sans'] font-medium transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 border ${isActive
                      ? 'text-[#B7202E] border-[#B7202E] shadow-xs'
                      : 'text-[#58595B] bg-[#FAF8F8] border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeEventsCatalogTabPill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-[#B7202E] rounded-xl -z-10 "
                      />
                    )}
                    <span className="relative z-10 ">{track.label}</span>
                    <span
                      className={`relative z-10 text-[0.68rem] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-[#B7202E]' : 'bg-black/5 text-[#58595B]'
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <span className="text-xs font-['Fira_Sans'] text-[#58595B] uppercase tracking-wider font-semibold whitespace-nowrap">
                Sort:
              </span>
              <select
                className="py-2 px-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-xs sm:text-sm font-['Fira_Sans'] text-[#231F20] cursor-pointer focus:outline-none focus:bg-white focus:border-[#B7202E]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort events"
              >
                <option value="default">Featured Lineup</option>
                <option value="prize-desc">Prize: High to Low</option>
                <option value="fee-asc">Entry Fee: Low to High</option>
                <option value="fee-desc">Entry Fee: High to Low</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Events Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, i) => (
                <motion.div
                  key={event.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, delay: (i % 4) * 0.04 }}
                  className="h-full"
                >
                  <EventCard event={event} onClick={() => setSelectedEvent(event)} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white border border-[#E5E7EB] rounded-3xl p-8">
                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] mb-2 font-normal">
                  No matching events found
                </h3>
                <p className="font-['Fira_Sans'] text-sm text-[#58595B] max-w-md mx-auto mb-6">
                  We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try another search term or reset your active filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSortBy('default');
                  }}
                  className="font-['Fira_Sans'] btn-primary py-2.5 px-6 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom Arena Call To Action ── */}
        <ScrollReveal>
          <div className="mt-16 sm:mt-24 p-8 sm:p-12 bg-[#231F20] text-white rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-2 bg-[#ED1C24]" />
              <div className="absolute top-0 left-0 w-2 h-12 bg-[#B7202E]" />
            </div>

            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#ED1C24]">
                READY TO JOIN THE ARENA?
              </span>
              <h2 className="font-['Marcellus'] text-3xl sm:text-4xl text-white font-normal m-0">
                Register For Multiple Events
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/70 leading-relaxed m-0">
                Secure your official participant badge, access the competition discord, and get ready for 2 action-packed days at KJSIM.
              </p>
            </div>

            <Link
              href="/register"
              className="font-['Fira_Sans'] btn-primary py-3.5 px-8 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all shrink-0 hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Go to Registration Desk</span>
              <HiArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Detail Modal ── */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
