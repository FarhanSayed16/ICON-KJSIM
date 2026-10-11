'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  HiOutlineLocationMarker,
  HiChevronLeft,
  HiChevronRight,
  HiArrowRight,
} from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import EventModal from './EventModal';
import { EVENTS } from '@/lib/data';

// ── Compulsory 3 Tracks Specification ──
const TRACKS = [
  {
    id: 'technical',
    index: '01',
    label: 'Technical',
    headline: 'Build, solve and present. Events for coders and problem-solvers.',
    microInstruction: 'SWIPE OR SELECT CARDS TO EXPLORE THE TECHNICAL ARENA',
  },
  {
    id: 'non-technical',
    index: '02',
    label: 'Non-technical',
    headline: 'Create, strategize and connect. Events for creative minds and leaders.',
    microInstruction: 'SWIPE OR SELECT CARDS TO EXPLORE THE NON-TECHNICAL ARENA',
  },
  {
    id: 'gaming',
    index: '03',
    label: 'Gaming',
    headline: 'Compete, conquer and dominate. High-octane esports and competitive arenas.',
    microInstruction: 'SWIPE OR SELECT CARDS TO EXPLORE THE GAMING ARENA',
  },
];

// Curated highlights and badges aligned with the design specification
const EVENT_CUSTOM_INFO = {
  'code-icon': {
    tag: 'TEAM • HACKATHON • FLAGSHIP',
    firstPrize: '₹12,000',
    poolText: 'Pool: ₹22,500',
    highlight: '12-HOUR SPRINT',
    venue: 'Tech Lab & Innovation Hall, KJSIM',
  },
  'hackathon': {
    tag: 'TEAM • HACKATHON • FLAGSHIP',
    firstPrize: '₹30,000',
    poolText: 'Pool: ₹50,000',
    highlight: '12-HOUR SPRINT',
    venue: 'Tech Lab & Innovation Hall, KJSIM',
  },
  'prompt-engineering': {
    tag: 'SOLO • AI / LLM • PROMPT CRAFT',
    firstPrize: '₹2,000',
    poolText: 'Pool: ₹3,000',
    highlight: 'AI SPRINT',
    venue: 'KJSIM Lab-301',
  },
  'debate': {
    tag: 'SOLO / DUO • DEBATE • PARLIAMENTARY',
    firstPrize: '₹1,500',
    poolText: 'Pool: ₹2,500',
    highlight: 'LIVE PITCH',
    venue: 'KJSIM Seminar Hall',
  },
  'mini-murder-mystery': {
    tag: 'TEAM • INVESTIGATION • CLUES',
    firstPrize: '₹1,000',
    poolText: 'Pool: ₹1,500',
    highlight: 'CAMPUS MYSTERY',
    venue: 'Central Courtyard',
  },
  'sports': {
    tag: 'TURF • TEAM ATHLETICS',
    firstPrize: '₹3,000',
    poolText: 'Pool: ₹5,000',
    highlight: 'CHAMPION CUP',
    venue: 'KJSIM Turf Ground',
  },
  'gaming': {
    tag: 'ESPORTS • CONSOLE & PC',
    firstPrize: '₹2,000',
    poolText: 'Pool: ₹3,500',
    highlight: 'KNOCKOUT ARENA',
    venue: 'Gaming Lounge',
  },
  'debugging': {
    tag: 'INDIVIDUAL • SPEED CODE • BUG SPRINT',
    firstPrize: '₹1,200',
    poolText: 'Pool: ₹2,000',
    highlight: '90-MIN CHALLENGE',
    venue: 'KJSIM Lab-301',
  },
  'web-dev': {
    tag: 'SOLO / DUO • FRONTEND • SPEED BUILD',
    firstPrize: '₹2,000',
    poolText: 'Pool: ₹3,000',
    highlight: '3-HOUR HACK',
    venue: 'KJSIM Lab-205',
  },
  'tech-quiz': {
    tag: 'SOLO • TRIVIA • MULTI-ROUND',
    firstPrize: '₹1,000',
    poolText: 'Pool: ₹1,500',
    highlight: 'RAPID FIRE ROUNDS',
    venue: 'KJSIM Seminar Hall',
  },
  'treasure-hunt': {
    tag: 'TEAM • ADVENTURE • CLUES',
    firstPrize: '₹1,500',
    poolText: 'Pool: ₹2,000',
    highlight: 'CAMPUS-WIDE RACE',
    venue: 'KJSIM Campus Grounds',
  },
  'photography': {
    tag: 'INDIVIDUAL • SHUTTERBUG • VISUAL',
    firstPrize: '₹1,000',
    poolText: 'Pool: ₹1,500',
    highlight: 'THEME BASED',
    venue: 'KJSIM Campus',
  },
  'creative-writing': {
    tag: 'SOLO • LITERARY • ON-THE-SPOT',
    firstPrize: '₹750',
    poolText: 'Pool: ₹1,000',
    highlight: '90-MIN WRITING',
    venue: 'KJSIM Room 102',
  },
  'tech-fair': {
    tag: 'OPEN • INNOVATION • EXHIBITS',
    firstPrize: 'Open Entry',
    poolText: 'Campus Demos',
    highlight: 'AMPHITHEATRE STALLS',
    venue: 'Amphitheatre, KJSIM',
  },
  'bgmi': {
    tag: 'SQUAD (4) • BATTLE ROYALE • ESPORTS',
    firstPrize: '₹1,500',
    poolText: 'Pool: ₹2,000',
    highlight: 'CUSTOM ROOMS',
    venue: 'Gaming Arena (Lab-102)',
  },
  'fifa': {
    tag: 'SOLO (1V1) • PLAYSTATION • KNOCKOUT',
    firstPrize: '₹1,500',
    poolText: 'Pool: ₹2,000',
    highlight: 'CONSOLE TOURNAMENT',
    venue: 'Console Lounge (Lab-205)',
  },
  'pickleball': {
    tag: 'DOUBLES • TURF PADDLE • FAST-PACED',
    firstPrize: '₹1,500',
    poolText: 'Pool: ₹2,000',
    highlight: 'RALLY TO 11',
    venue: 'Pickleball Court, KJSIM',
  },
  'chess': {
    tag: 'SOLO • STRATEGY • RAPID BLITZ',
    firstPrize: '₹750',
    poolText: 'Pool: ₹1,000',
    highlight: 'TIMED MATCHES',
    venue: 'Seminar Room B',
  },
  'football': {
    tag: '8-A-SIDE • TURF SQUAD • KNOCKOUT',
    firstPrize: '₹3,500',
    poolText: 'Pool: ₹5,000',
    highlight: 'CAMPUS GLORY',
    venue: 'KJSIM Turf Ground',
  },
};

function getCard3DStyle(diff) {
  if (diff === 0) {
    return {
      transform: 'translateX(0) scale(1) translateZ(0)',
      zIndex: 25,
      opacity: 1,
      boxShadow: '0 24px 50px -12px rgba(35, 31, 32, 0.22), 0 0 0 1px rgba(35, 31, 32, 0.04)',
    };
  }
  if (diff === -1) {
    return {
      transform: 'translateX(calc(-56% - 20px)) scale(0.88) perspective(900px) rotateY(5deg)',
      zIndex: 18,
      opacity: 0.82,
      filter: 'brightness(0.94)',
    };
  }
  if (diff === 1) {
    return {
      transform: 'translateX(calc(56% + 20px)) scale(0.88) perspective(900px) rotateY(-5deg)',
      zIndex: 18,
      opacity: 0.82,
      filter: 'brightness(0.94)',
    };
  }
  if (diff === -2) {
    return {
      transform: 'translateX(calc(-92% - 32px)) scale(0.76) perspective(900px) rotateY(9deg)',
      zIndex: 12,
      opacity: 0.58,
      filter: 'brightness(0.85)',
    };
  }
  if (diff === 2) {
    return {
      transform: 'translateX(calc(92% + 32px)) scale(0.76) perspective(900px) rotateY(-9deg)',
      zIndex: 12,
      opacity: 0.58,
      filter: 'brightness(0.85)',
    };
  }
  if (diff < -2) {
    return {
      transform: 'translateX(calc(-118% - 44px)) scale(0.66) perspective(900px) rotateY(12deg)',
      zIndex: 6,
      opacity: 0.38,
      filter: 'brightness(0.75)',
    };
  }
  return {
    transform: 'translateX(calc(118% + 44px)) scale(0.66) perspective(900px) rotateY(-12deg)',
    zIndex: 6,
    opacity: 0.38,
    filter: 'brightness(0.75)',
  };
}

export default function EventSchedule({ events } = {}) {
  const [eventsList, setEventsList] = useState(() =>
    Array.isArray(events) && events.length > 0
      ? events.filter((e) => !e.isArchived)
      : EVENTS.filter((e) => !e.isArchived)
  );
  const [activeCategory, setActiveCategory] = useState('technical');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  useEffect(() => {
    async function loadLiveEvents() {
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
    loadLiveEvents();
  }, []);

  // Active track configuration
  const currentTrack = TRACKS.find((t) => t.id === activeCategory) || TRACKS[0];

  // Filter events belonging to active track (exclude archived)
  const currentEvents = eventsList.filter(
    (e) => e.category === activeCategory && e.isActive !== false && !e.isArchived
  );
  const count = currentEvents.length;

  // Safe index within bounds
  const safeIndex = count > 0 ? (currentIndex % count + count) % count : 0;

  // Circular looped navigation handlers
  const goToNext = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goToPrev = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Tab change handler with card fan-out transition trigger
  const handleTabChange = (trackId) => {
    if (trackId === activeCategory) return;
    setActiveCategory(trackId);
    setCurrentIndex(0);
    setIsTabTransitioning(true);
  };

  useEffect(() => {
    if (isTabTransitioning) {
      const timer = setTimeout(() => {
        setIsTabTransitioning(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isTabTransitioning]);

  // Keyboard navigation when user is interacting with carousel
  useEffect(() => {
    const handleKeyNav = (e) => {
      // Only handle if no modal is open
      if (selectedEvent) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [goToPrev, goToNext, selectedEvent]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current < -40) {
      goToNext();
    } else if (touchDeltaX.current > 40) {
      goToPrev();
    }
  };

  return (
    <section className="pt-20 sm:pt-28 pb-20 sm:pb-32 bg-white relative overflow-hidden" id="events">
      <div className="container max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header Aligned With Brand Mockup */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-2 gap-3 md:gap-0">
            <div className="flex flex-col gap-1.5">
              <span className="font-['Fira_Sans'] text-[0.82rem] font-bold tracking-[0.14em] uppercase text-[#ED1C24]">
                CHOOSE YOUR FIELD
              </span>
              <h2 className="font-['Marcellus'] text-4xl sm:text-5xl md:text-6xl font-normal text-[#231F20] m-0 leading-[1.05]">
                Events
              </h2>
            </div>
            <div className="max-w-full md:max-w-[580px] text-left md:text-right">
              <p className="font-['Fira_Sans'] text-sm md:text-[0.95rem] text-[#58595B] leading-relaxed m-0">
                13 events across three tracks. Pick a track to see its line-up.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Tracks Architectural Tab Bar */}
        <ScrollReveal delay={0.06}>
          <div className="relative w-full mb-8">
            <div className="grid grid-cols-3 w-full bg-white border border-[#E5E7EB] border-b-0 rounded-t-md overflow-hidden" role="tablist" aria-label="Event Tracks">
              {TRACKS.map((track) => {
                const isActive = activeCategory === track.id;
                return (
                  <button
                    key={track.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    className={`group relative flex flex-col items-start text-left px-3 py-3 sm:px-5 sm:py-4 md:px-8 md:py-5 border-0 border-r border-[#E5E7EB] last:border-r-0 cursor-pointer transition-all duration-200 outline-none ${isActive
                      ? 'bg-[#B7202E] text-white hover:bg-[#ED1C24]'
                      : 'bg-white hover:bg-[#FAF7F7]'
                      }`}
                    onClick={() => handleTabChange(track.id)}
                  >
                    <span className={`font-['Fira_Sans'] text-[0.68rem] sm:text-xs md:text-sm font-bold tracking-wider mb-1 sm:mb-1.5 transition-colors ${isActive ? 'text-white/90' : 'text-[#ED1C24]'
                      }`}>
                      {track.index}
                    </span>
                    <span className={`font-['Marcellus'] text-sm sm:text-lg md:text-2xl font-normal leading-tight transition-colors ${isActive ? 'text-white' : 'text-[#231F20] group-hover:text-[#ED1C24]'
                      }`}>
                      {track.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="w-full h-[3px] bg-[#ED1C24]" />
          </div>
        </ScrollReveal>

        {/* Showcase Area */}
        <div className="relative w-full pt-2">
          {/* Track Subheader */}
          <ScrollReveal variant="slide-left" delay={0.12}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 mb-8 px-1">
              <div className="flex flex-col gap-1">
                <h3 className="font-['Fira_Sans'] text-base sm:text-lg font-semibold text-[#231F20] m-0 leading-snug">
                  {currentTrack.headline}
                </h3>
                <p className="font-['Fira_Sans'] text-[0.7rem] sm:text-xs font-bold tracking-[0.12em] uppercase text-[#58595B] m-0">
                  {currentTrack.microInstruction}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Looped Coverflow Carousel */}
          <ScrollReveal variant="scale-up" delay={0.16}>
            <div
              className="relative w-full max-w-[1240px] mx-auto py-4 pb-8 select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Circular Navigation Arrow Buttons */}
            <button
              type="button"
              className="absolute top-[45%] -translate-y-1/2 left-2 sm:left-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#231F20] text-white border-0 flex items-center justify-center cursor-pointer z-40 shadow-[0_6px_18px_rgba(35,31,32,0.25)] hover:bg-[#B7202E] hover:scale-105 hover:shadow-[0_8px_24px_rgba(183,32,46,0.35)] transition-all duration-200"
              onClick={goToPrev}
              aria-label="Previous event in looped list"
            >
              <HiChevronLeft size={24} />
            </button>

            <button
              type="button"
              className="absolute top-[45%] -translate-y-1/2 right-2 sm:right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#231F20] text-white border-0 flex items-center justify-center cursor-pointer z-40 shadow-[0_6px_18px_rgba(35,31,32,0.25)] hover:bg-[#B7202E] hover:scale-105 hover:shadow-[0_8px_24px_rgba(183,32,46,0.35)] transition-all duration-200"
              onClick={goToNext}
              aria-label="Next event in looped list"
            >
              <HiChevronRight size={24} />
            </button>

            {/* Cards Stage: All cards rendered with layered background depth */}
            <div className="relative w-full h-[560px] flex items-center justify-center [perspective:1200px]">
              {currentEvents.map((event, idx) => {
                // Calculate signed circular distance from active index
                let diff = (idx - safeIndex) % count;
                if (diff > count / 2) diff -= count;
                if (diff < -count / 2) diff += count;

                const isCenter = diff === 0;

                const fallbackCustom = {
                  tag: `${event.teamSize?.toUpperCase() || 'OPEN'} • ${(event.category || activeCategory).toUpperCase()}`,
                  firstPrize: event.prizePool > 0 ? `₹${event.prizePool.toLocaleString()}` : (event.registrationFee === 0 || event.fee === 'Free' ? 'Free Entry' : 'Open Entry'),
                  poolText: event.prizePool > 0 ? `Pool: ₹${event.prizePool.toLocaleString()}` : (event.registrationFee === 0 ? 'Free Entry' : 'Open'),
                  highlight: event.time || event.date || 'ICON 2026',
                  venue: event.venue || 'KJSIM Campus',
                };
                const custom = {
                  ...fallbackCustom,
                  ...(EVENT_CUSTOM_INFO[event.slug] || {}),
                };
                return (
                  <div
                    key={`${activeCategory}-${event.slug}`}
                    style={getCard3DStyle(diff)}
                    className="absolute w-[380px] max-w-[90vw] h-[520px] bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-500 origin-center will-change-transform group cursor-pointer"
                    onClick={() => {
                      if (isCenter) {
                        setSelectedEvent(event);
                      } else {
                        setCurrentIndex(idx);
                      }
                    }}
                    role={isCenter ? 'button' : undefined}
                    tabIndex={isCenter ? 0 : -1}
                    aria-label={`${event.name} details`}
                  >
                    {/* Full Poster Image covering 100% of the card */}
                    <div className="absolute inset-0 w-full h-full bg-[#231F20] overflow-hidden">
                      {event.posterImage ? (
                        <Image
                          src={event.posterImage}
                          alt={`${event.name} poster`}
                          fill
                          sizes="420px"
                          priority={isCenter}
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#231F20] text-white/50 font-['Fira_Sans'] text-sm">
                          {event.name}
                        </div>
                      )}

                      {/* Smooth Cinematic Gradient at bottom for text contrast */}
                      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Floating Top Category & Prize Badges */}
                    {/* Floating Top Category & Prize Badges */}
                    <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-['Fira_Sans'] text-[0.68rem] font-bold tracking-wider uppercase shadow-xs">
                          {custom.tag?.split('•')[0]?.trim() || activeCategory.toUpperCase()}
                        </span>
                        {event.registrationStatus === 'closed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-[#B7202E] text-white shadow-xs font-['Fira_Sans'] tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Closed
                          </span>
                        ) : event.registrationStatus === 'paused' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-orange-600 text-white shadow-xs font-['Fira_Sans'] tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Paused
                          </span>
                        ) : event.registrationStatus === 'starting_soon' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-amber-500 text-black shadow-xs font-['Fira_Sans'] tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
                            Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-emerald-600/90 text-white shadow-xs font-['Fira_Sans'] tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                            Open
                          </span>
                        )}
                      </div>
                      {custom.firstPrize && custom.firstPrize !== 'Free' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#ED1C24] text-white font-['Fira_Sans'] text-[0.7rem] font-bold tracking-wider uppercase shadow-xs">
                          1st: {custom.firstPrize}
                        </span>
                      )}
                    </div>

                    {/* Small Bottom Smart CTA */}
                    <div className="relative z-10 mt-auto p-4 sm:p-5 flex items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-['Marcellus'] text-lg sm:text-xl font-normal text-white m-0 truncate drop-shadow-md group-hover:text-[#ED1C24] transition-colors">
                          {event.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-white/80 font-['Fira_Sans'] text-xs">
                          <HiOutlineLocationMarker size={13} className="text-[#ED1C24] shrink-0" />
                          <span className="truncate max-w-[170px] sm:max-w-[200px]">{custom.venue}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white font-['Fira_Sans'] text-xs font-semibold shadow-md shrink-0 transition-all duration-200 group-hover:scale-105 cursor-pointer border-0 ${
                          event.registrationStatus === 'closed'
                            ? 'bg-neutral-700 hover:bg-neutral-800'
                            : event.registrationStatus === 'paused'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : event.registrationStatus === 'starting_soon'
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-[#ED1C24] hover:bg-[#B7202E]'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                      >
                        <span>
                          {event.registrationStatus === 'closed'
                            ? 'Closed'
                            : event.registrationStatus === 'paused'
                            ? 'Paused'
                            : event.registrationStatus === 'starting_soon'
                            ? 'Soon'
                            : 'View Details'}
                        </span>
                        <HiArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Pagination Indicators */}
            <div className="flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Looped pagination">
              {currentEvents.map((ev, i) => (
                <button
                  key={ev.slug}
                  type="button"
                  className={`border-0 outline-none cursor-pointer p-0 rounded-full transition-all duration-300 ${i === safeIndex
                    ? 'w-6 h-2 bg-[#ED1C24]'
                    : 'w-2 h-2 bg-[#58595B]/30 hover:bg-[#58595B]/50'
                    }`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to event ${i + 1}: ${ev.name}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
