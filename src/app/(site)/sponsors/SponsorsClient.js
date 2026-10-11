'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineExternalLink,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiArrowRight,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
} from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import { SPONSORS } from '@/lib/data';

const SPONSOR_CATEGORIES = [
  { id: 'all', label: 'All Partners' },
  { id: 'tech', label: 'Technology & Cloud' },
  { id: 'sports', label: 'Sports & Active Life' },
  { id: 'beverage', label: 'Hydration & Beverage' },
  { id: 'gaming', label: 'Gaming & Esports' },
  { id: 'institutional', label: 'Institutional' },
];

const WHY_SPONSOR_POINTS = [
  {
    icon: HiOutlineUsers,
    metric: '1,000+',
    title: 'Top-Tier Student Reach',
    desc: 'Direct engagement with elite engineering, data science, and tech management scholars from 30+ premier institutions across Mumbai.',
  },
  {
    icon: HiOutlineGlobeAlt,
    metric: '100K+',
    title: 'Multi-Channel Branding',
    desc: 'Prominent placement across keynote stages, livestream broadcasts, hackathon suites, campus banners, and targeted digital campaigns.',
  },
  {
    icon: HiOutlineAcademicCap,
    metric: '35+ Teams',
    title: 'Talent Scout & Mentorship',
    desc: 'Evaluate top finalists, host problem statement tracks, and build meaningful relationships with high-caliber technical candidates.',
  },
];

export default function SponsorsClient() {
  const [sponsorsList, setSponsorsList] = useState(SPONSORS);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetch('/api/sponsors');
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSponsorsList(json.data);
        }
      } catch {
        // Fallback to static
      }
    }
    loadSponsors();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: sponsorsList.length };
    sponsorsList.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [sponsorsList]);

  const filteredSponsors = useMemo(() => {
    if (activeCategory === 'all') return sponsorsList;
    return sponsorsList.filter((s) => s.category === activeCategory);
  }, [sponsorsList, activeCategory]);

  return (
    <div className="pt-24 sm:pt-32 pb-28 sm:pb-36 bg-[#FAF8F8] min-h-screen relative overflow-hidden">
      {/* ── Macro Somaiya Architectural Device ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Editorial Header ── */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto pt-6 pb-12 sm:pb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                STRATEGIC ALLIANCES &amp; PARTNERS
              </span>
            </div>

            <h1 className="font-['Marcellus'] text-4xl sm:text-6xl lg:text-7xl font-normal text-[#231F20] leading-tight tracking-tight mb-4">
              Our Sponsors &amp; Patrons
            </h1>

            <p className="font-['Fira_Sans'] text-base sm:text-lg text-[#58595B] max-w-2xl mx-auto leading-relaxed font-normal">
              Empowered by forward-thinking organizations supporting student innovation, competitive technology, and transformative youth initiatives at Somaiya.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto text-center">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#B7202E] block">6+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Confirmed Partners</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] block">30+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Colleges Reached</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#ED1C24] block">1,000+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Active Attendees</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#B7202E] block">₹50K+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Prize Backing</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Category Filter Pills ── */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10 sm:mb-12 max-w-4xl mx-auto">
            {SPONSOR_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-['Fira_Sans'] font-medium transition-all duration-200 cursor-pointer outline-none flex items-center gap-2 border ${isActive
                      ? 'text-white border-[#B7202E] shadow-xs'
                      : 'text-[#58595B] bg-white border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeSponsorsFilterPill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-[#B7202E] rounded-full -z-10"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                  <span
                    className={`relative z-10 text-[0.68rem] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#58595B]'
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ── Unified Common Sponsors Grid (All Partners Together with Better Card Design) ── */}
        <section className="relative min-h-[360px] mb-16 sm:mb-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredSponsors.map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="group bg-white border border-[#E5E7EB] hover:border-[#B7202E]/60  p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Somaiya Corner Geometric Device */}
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden z-10">
                    <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                    <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                  </div>

                  <div>
                    {/* Premium Logo Plate */}
                    <div className="flex items-center justify-center w-full h-36 p-6 bg-[#FAF8F8] rounded-2xl border border-[#E5E7EB] mb-6 group-hover:bg-white group-hover:border-[#B7202E]/25 transition-all relative overflow-hidden">
                      <Image
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        width={240}
                        height={90}
                        className="max-h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Tier & Role Badge Shelf */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7202E]/10 text-[#B7202E] font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider">
                        <HiOutlineSparkles size={13} className="text-[#ED1C24]" />
                        <span>{sponsor.tier}</span>
                      </span>
                      <span className="font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] font-semibold">
                        {sponsor.badge}
                      </span>
                    </div>

                    {/* Sponsor Name */}
                    <h3 className="font-['Marcellus'] text-2xl sm:text-[1.65rem] text-[#231F20] font-normal mb-2.5 group-hover:text-[#B7202E] transition-colors leading-snug">
                      {sponsor.name}
                    </h3>

                    {/* Description */}
                    <p className="font-['Fira_Sans'] text-sm text-[#58595B] leading-relaxed mb-5 font-normal">
                      {sponsor.description}
                    </p>

                    {/* Key Contributions Checklist */}
                    {sponsor.highlights && sponsor.highlights.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-[#E5E7EB] space-y-2">
                        {sponsor.highlights.slice(0, 3).map((hl) => (
                          <div key={hl} className="flex items-center gap-2 text-xs font-['Fira_Sans'] text-[#231F20]/80">
                            <HiOutlineCheckCircle className="text-[#ED1C24] shrink-0" size={15} />
                            <span className="truncate">{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visit Partner Action Shelf */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    {sponsor.url && sponsor.url !== '#' ? (
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#B7202E] bg-[#FAF8F8] hover:bg-[#B7202E] text-[#231F20] hover:text-white text-xs sm:text-sm font-semibold font-['Fira_Sans'] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                      >
                        <span>Visit Official Partner</span>
                        <HiOutlineExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F8] border border-[#E5E7EB] text-center text-xs font-semibold text-[#58595B] font-['Fira_Sans']">
                        Official Event Patron
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Why Partner Bento Section ── */}
        <section className="mb-16 sm:mb-24">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-12">
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-widest uppercase text-[#B7202E] mb-2 block">
                COLLABORATION VALUE
              </span>
              <h2 className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal">
                Why Partner With ICON 2026?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {WHY_SPONSOR_POINTS.map(({ icon: Icon, metric, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-[#E5E7EB] rounded-none p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-[#B7202E]/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Somaiya Corner Geometric Device */}
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                    <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#B7202E]/10 text-[#B7202E] flex items-center justify-center text-xl">
                        <Icon size={24} />
                      </div>
                      <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#B7202E]">
                        {metric}
                      </span>
                    </div>
                    <h3 className="font-['Marcellus'] text-xl text-[#231F20] font-normal mb-2">
                      {title}
                    </h3>
                    <p className="font-['Fira_Sans'] text-sm text-[#58595B] leading-relaxed m-0 font-normal">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── Bottom Partnership CTA (Framed with Somaiya Edge elements) ── */}
        <ScrollReveal>
          <div className="text-center bg-[#231F20] text-white rounded-none p-8 sm:p-14 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Somaiya Corner Geometric Device */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-2 bg-[#ED1C24]" />
              <div className="absolute top-0 left-0 w-2 h-12 bg-[#B7202E]" />
            </div>

            <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#ED1C24] mb-2 block">
              JOIN THE REVOLUTION
            </span>
            <h3 className="font-['Marcellus'] text-3xl sm:text-4xl text-white font-normal mb-3">
              Become a Sponsor for ICON 2026
            </h3>
            <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/70 mb-8 max-w-xl mx-auto leading-relaxed font-normal">
              Tailored sponsorship tiers, branding avenues, keynote privileges, and campus engagement packages available. Let&apos;s build an extraordinary festival together.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="font-['Fira_Sans'] btn-primary py-3.5 px-8 text-sm sm:text-base font-semibold shadow-md hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-105"
              >
                <span>Connect With Organizing Committee</span>
                <HiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
