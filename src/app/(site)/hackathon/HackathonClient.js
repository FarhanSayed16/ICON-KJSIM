'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCode,
  HiOutlineUsers,
  HiOutlineCurrencyRupee,
  HiArrowRight,
  HiOutlineLightBulb,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';

const DOMAIN_TRACKS = [
  {
    id: 'ai-ml',
    title: 'AI & Intelligent Systems',
    tag: 'GEN-AI & ML',
    desc: 'Harness LLMs, computer vision, and autonomous agents to automate workflows, decode complex data, and solve real-world problems.',
    tech: ['PyTorch', 'OpenAI / HuggingFace', 'Vector DBs', 'LangChain'],
    accent: '#B7202E',
  },
  {
    id: 'fullstack',
    title: 'Cloud & Web Platforms',
    tag: 'NEXT-GEN WEB',
    desc: 'Architect blazingly fast, accessible, and scalable platforms with modern frontend frameworks and distributed microservices.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL / Redis'],
    accent: '#ED1C24',
  },
  {
    id: 'fintech',
    title: 'FinTech & Analytics',
    tag: 'FINANCIAL DATA',
    desc: 'Build secure, fraud-resistant transaction systems, algorithmic models, and real-time visualization dashboards for global markets.',
    tech: ['Data Pipelines', 'Security APIs', 'Kafka', 'WebSockets'],
    accent: '#231F20',
  },
  {
    id: 'open-innovation',
    title: 'Open Innovation & Moonshots',
    tag: 'UNCONVENTIONAL',
    desc: 'No boundaries. Combine IoT, AR/VR, accessibility tech, or sustainability frameworks to tackle problems that defy classification.',
    tech: ['Cross-Domain', 'Hardware & IoT', 'Social Impact', 'EdTech'],
    accent: '#B7202E',
  },
];

const TIMELINE_STEPS = [
  {
    day: 'PHASE 01',
    time: 'Feb 5, 2026',
    title: 'Registration & Team Lock',
    desc: 'Final deadline to register your 2-4 member squad and lock your competition track.',
  },
  {
    day: 'DAY 01',
    time: 'Feb 13, 2026 — 10:00 AM',
    title: 'Opening Ceremony & Theme Reveal',
    desc: 'Problem statements revealed in the auditorium. The 24-hour sprint begins!',
  },
  {
    day: 'DAY 01',
    time: 'Feb 13, 2026 — 08:00 PM',
    title: 'Checkpoint 1: Mentorship Review',
    desc: 'Industry mentors review architectures, offer feedback, and help unblock teams.',
  },
  {
    day: 'DAY 02',
    time: 'Feb 14, 2026 — 10:00 AM',
    title: 'Code Freeze & GitHub Submissions',
    desc: 'Git commit freeze! Teams submit repositories, live demos, and pitch decks.',
  },
  {
    day: 'DAY 02',
    time: 'Feb 14, 2026 — 12:00 PM',
    title: 'Final Pitches & Award Ceremony',
    desc: 'Top 8 teams present live on the main auditorium stage before industry judges.',
  },
];

const JUDGING_CRITERIA = [
  {
    title: 'Technical Complexity',
    weight: '30%',
    desc: 'Architecture design, code cleanliness, performance, and effective use of modern tools.',
  },
  {
    title: 'Innovation & Originality',
    weight: '30%',
    desc: 'Uniqueness of the solution and creative problem-solving approach.',
  },
  {
    title: 'Real-World Impact',
    weight: '20%',
    desc: 'Practical feasibility, market relevance, and scalability of the concept.',
  },
  {
    title: 'Design & Presentation',
    weight: '20%',
    desc: 'UI/UX Polish, smooth user flow, and the clarity of the 5-minute live pitch.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Can teams have members from different colleges?',
    a: 'Yes! Cross-college and cross-specialization teams (engineering + data science + management) are completely allowed and encouraged.',
  },
  {
    q: 'What is the team size limit?',
    a: 'Teams must consist of 2 to 4 members. Solo entries are not accepted for the hackathon.',
  },
  {
    q: 'Will high-speed internet and power be provided?',
    a: 'Absolutely. Dedicated campus Wi-Fi, lab workstations, power strips, 24/7 technical assistance, and continuous refreshments will be provided throughout the 24 hours.',
  },
  {
    q: 'Are pre-built templates or existing repos allowed?',
    a: 'No. All project code must be created during the official 24-hour window. Using boilerplate (e.g., create-next-app, vite) and open-source packages is permitted, but existing project clones will be disqualified.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Registration is ₹500 per team, which includes official hackathon badges, meals, midnight refreshments, certificates, and entry to keynote events.',
  },
];

export default function HackathonClient() {
  const [hackathonStatus, setHackathonStatus] = useState('open');
  const [eventSlug, setEventSlug] = useState('hackathon');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const match = json.data.find((e) => e.slug === 'hackathon' || e.slug === 'code-icon');
          if (match) {
            setEventSlug(match.slug);
            if (match.registrationStatus) {
              setHackathonStatus(match.registrationStatus);
            }
          }
        }
      } catch {}
    }
    loadStatus();
  }, []);

  const isClosed = hackathonStatus === 'closed';
  const isPaused = hackathonStatus === 'paused';
  const isSoon = hackathonStatus === 'starting_soon';
  const isDisabled = isClosed || isPaused || isSoon;

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-32 bg-[#FAF8F8] min-h-screen relative overflow-hidden">
      {/* ── Architectural Edge Top Bar ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Hero Section ── */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto pt-6 pb-12 sm:pb-16">
            {/* Live Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B7202E]/10 border border-[#B7202E]/20 text-[#B7202E] font-['Fira_Sans'] text-xs font-bold tracking-widest uppercase mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-ping" />
              <span>FLAGSHIP 24-HOUR ARENA // CODEICON 2026</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-['Marcellus'] text-4xl sm:text-6xl lg:text-7xl font-normal text-[#231F20] leading-[1.08] tracking-tight mb-6">
              24 Hours. One Stage.<br />
              <span className="text-[#B7202E]">Infinite Innovation.</span>
            </h1>

            <p className="font-['Fira_Sans'] text-base sm:text-lg text-[#58595B] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Assemble your crew, select your problem statement, and code through the night at Somaiya Vidyavihar campus. Compete for ₹50,000+ in cash prizes, direct mentorship, and glory.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {isDisabled ? (
                <button
                  type="button"
                  disabled
                  className="py-3.5 px-9 text-base font-bold rounded-full bg-neutral-600 text-white cursor-not-allowed opacity-90 font-['Fira_Sans']"
                >
                  {isClosed
                    ? 'Registration Closed'
                    : isPaused
                    ? 'Registration Paused'
                    : 'Starting Soon'}
                </button>
              ) : (
                <Link
                  href={`/register?event=${eventSlug}`}
                  className="font-['Fira_Sans'] btn-primary text-base font-semibold py-3.5 px-9 shadow-md hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 group"
                >
                  <span>Register Your Squad</span>
                  <HiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              <a
                href="#domains"
                className="font-['Fira_Sans'] inline-flex items-center gap-2 py-3.5 px-8 rounded-full border-2 border-[#E5E7EB] hover:border-[#B7202E] bg-white text-[#231F20] hover:text-[#B7202E] text-base font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <span>Explore Tracks</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-3xl sm:text-4xl text-[#B7202E] block">₹50K+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Prize Pool</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] block">24h</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Continuous Sprint</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-3xl sm:text-4xl text-[#B7202E] block">30+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Colleges Competing</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs text-center">
                <span className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] block">1,000+</span>
                <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">Fest Attendees</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Problem Statement Domains ── */}
        <section id="domains" className="py-14 sm:py-20">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E]">
                  COMPETITION TRACKS
                </span>
              </div>
              <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-[#231F20] font-normal tracking-tight">
                Choose Your Domain
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] max-w-xl mx-auto mt-2">
                Teams can build prototypes in any of the four designated tracks. Detailed problem statements are announced at the opening bell.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {DOMAIN_TRACKS.map((track, i) => (
              <ScrollReveal key={track.id} delay={i * 0.1}>
                <div className="group bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-9 shadow-xs hover:shadow-xl hover:border-[#B7202E]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
                  {/* Somaiya Corner Geometric Notch */}
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                    <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#B7202E]/10 text-[#B7202E] font-['Fira_Sans'] text-xs font-bold tracking-wider uppercase">
                        {track.tag}
                      </span>
                      <HiOutlineLightBulb size={22} className="text-[#B7202E]/60 group-hover:text-[#B7202E] transition-colors" />
                    </div>

                    <h3 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] font-normal mb-3 group-hover:text-[#B7202E] transition-colors">
                      {track.title}
                    </h3>

                    <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed mb-6 font-normal">
                      {track.desc}
                    </p>
                  </div>

                  <div>
                    <div className="pt-5 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2">
                      <span className="font-['Fira_Sans'] text-xs font-semibold text-[#231F20]/70 uppercase tracking-wider mr-1">
                        Tech Stack:
                      </span>
                      {track.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF8F8] border border-[#E5E7EB] text-[#58595B] text-xs font-['Fira_Sans'] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── Prize Podium ── */}
        <section className="py-14 sm:py-20">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E]">
                  PRIZE POOL
                </span>
              </div>
              <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-[#231F20] font-normal tracking-tight">
                Win Big at CodeICON
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] max-w-md mx-auto mt-2">
                Cash rewards, engraved trophies, incubation referrals, and verified Somaiya achievement badges.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end max-w-5xl mx-auto">
            {/* 2nd Place */}
            <ScrollReveal delay={0.1} className="order-2 md:order-1">
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-8 text-center shadow-sm hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold font-['Marcellus']">
                  2nd
                </div>
                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#58595B] mb-2 block">
                  First Runner Up
                </span>
                <div className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-1">
                  ₹15,000
                </div>
                <p className="font-['Fira_Sans'] text-xs text-[#58595B] mb-6">Cash Prize + Silver Trophy</p>
                <div className="pt-4 border-t border-[#E5E7EB] space-y-2 text-xs font-['Fira_Sans'] text-[#58595B] text-left">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Official Runner Up Memento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Direct Fast-Track to Interview Prep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Certificate of Merit for all members</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* 1st Place Champion */}
            <ScrollReveal delay={0.0} className="order-1 md:order-2">
              <div className="bg-white border-2 border-[#B7202E] rounded-3xl p-8 sm:p-10 text-center shadow-xl hover:shadow-2xl transition-all relative -translate-y-2 sm:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B7202E] text-white px-5 py-1 rounded-full text-xs font-bold font-['Fira_Sans'] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <HiOutlineTrophy size={14} className="text-[#FAF8F8]" />
                  <span>Grand Champion</span>
                </div>

                <div className="w-16 h-16 rounded-3xl bg-[#B7202E]/10 text-[#B7202E] flex items-center justify-center mx-auto mb-4 text-3xl mt-2">
                  <HiOutlineTrophy size={32} />
                </div>

                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#ED1C24] mb-1 block">
                  1st Place Winner
                </span>
                <div className="font-['Marcellus'] text-4xl sm:text-5xl text-[#B7202E] font-normal mb-1">
                  ₹30,000
                </div>
                <p className="font-['Fira_Sans'] text-xs text-[#58595B] mb-6">Cash Prize + Rolling Champion Cup</p>

                <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-xs font-['Fira_Sans'] text-[#231F20] text-left">
                  <div className="flex items-center gap-2 font-medium">
                    <HiOutlineCheckCircle className="text-[#ED1C24] shrink-0" size={16} />
                    <span>CodeICON 2026 Champion Rolling Trophy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#ED1C24] shrink-0" size={16} />
                    <span>Exclusive Somaiya Incubation Pitch Opportunity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#ED1C24] shrink-0" size={16} />
                    <span>Industry Networking &amp; VC Introductions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#ED1C24] shrink-0" size={16} />
                    <span>Distinguished Certificate of Excellence</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* 3rd Place */}
            <ScrollReveal delay={0.2} className="order-3">
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-8 text-center shadow-sm hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold font-['Marcellus']">
                  3rd
                </div>
                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#58595B] mb-2 block">
                  Second Runner Up
                </span>
                <div className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-1">
                  ₹5,000
                </div>
                <p className="font-['Fira_Sans'] text-xs text-[#58595B] mb-6">Cash Prize + Bronze Trophy</p>
                <div className="pt-4 border-t border-[#E5E7EB] space-y-2 text-xs font-['Fira_Sans'] text-[#58595B] text-left">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Official 2nd Runner Up Memento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Mentorship session with jury leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Certificate of Merit for all members</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 24-Hour Timeline ── */}
        <section className="py-14 sm:py-20">
          <ScrollReveal>
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-14 shadow-sm">
              <div className="text-center mb-12 sm:mb-16">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                  <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E]">
                    EVENT SCHEDULE
                  </span>
                </div>
                <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-[#231F20] font-normal tracking-tight">
                  24-Hour Timeline
                </h2>
                <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] max-w-md mx-auto mt-2">
                  From orientation to code freeze, follow the exact milestone roadmap.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                {TIMELINE_STEPS.map((step, idx) => (
                  <div key={step.title} className="relative flex items-start gap-6 pl-10">
                    {/* Glowing Node */}
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#B7202E] border-2 border-white shadow-xs" />
                    
                    <div className="flex-1 bg-[#FAF8F8] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 hover:border-[#B7202E]/30 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#B7202E]/10 text-[#B7202E] font-['Fira_Sans'] text-[0.7rem] font-bold tracking-wider uppercase">
                          {step.day}
                        </span>
                        <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] flex items-center gap-1">
                          <HiOutlineClock size={14} className="text-[#B7202E]" />
                          {step.time}
                        </span>
                      </div>
                      <h4 className="font-['Marcellus'] text-xl sm:text-2xl text-[#231F20] font-normal mb-1">
                        {step.title}
                      </h4>
                      <p className="font-['Fira_Sans'] text-sm text-[#58595B] leading-relaxed m-0">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Judging Criteria Grid ── */}
        <section className="py-14 sm:py-20">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E]">
                  EVALUATION MATRIX
                </span>
              </div>
              <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-[#231F20] font-normal tracking-tight">
                How You&apos;ll Be Judged
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {JUDGING_CRITERIA.map((crit) => (
                <div
                  key={crit.title}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs text-center flex flex-col justify-between"
                >
                  <div>
                    <span className="font-['Marcellus'] text-3xl sm:text-4xl text-[#B7202E] block mb-2">
                      {crit.weight}
                    </span>
                    <h3 className="font-['Marcellus'] text-xl text-[#231F20] font-normal mb-2">
                      {crit.title}
                    </h3>
                  </div>
                  <p className="font-['Fira_Sans'] text-xs sm:text-sm text-[#58595B] leading-relaxed m-0">
                    {crit.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── FAQs Accordion ── */}
        <section className="py-14 sm:py-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E] mb-2 block">
                  CLEAR ANSWERS
                </span>
                <h2 className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={item.q}
                      className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer outline-none hover:bg-[#FAF8F8]"
                      >
                        <span className="font-['Marcellus'] text-lg sm:text-xl text-[#231F20] font-normal">
                          {item.q}
                        </span>
                        <HiOutlineChevronDown
                          size={20}
                          className={`text-[#B7202E] shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-5 sm:px-6 pb-6 text-sm sm:text-base font-['Fira_Sans'] text-[#58595B] leading-relaxed border-t border-[#E5E7EB]/50 pt-4"
                          >
                            {item.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Bottom Registration Banner ── */}
        <ScrollReveal>
          <div className="mt-12 p-8 sm:p-14 bg-[#231F20] text-white rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            {/* Somaiya Corner Geometric Device */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-2 bg-[#ED1C24]" />
              <div className="absolute top-0 left-0 w-2 h-12 bg-[#B7202E]" />
            </div>

            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#ED1C24]">
                READY TO ENTER THE ARENA?
              </span>
              <h2 className="font-['Marcellus'] text-3xl sm:text-4xl text-white font-normal m-0">
                Register Your Team for CodeICON
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/70 leading-relaxed m-0">
                Spots are limited to 35 verified squads. Secure your team slot today and start ideating.
              </p>
            </div>

            <div>
              {isDisabled ? (
                <button
                  type="button"
                  disabled
                  className="py-3.5 px-8 rounded-full bg-neutral-600 text-white font-['Fira_Sans'] font-semibold cursor-not-allowed opacity-80"
                >
                  Registration Closed
                </button>
              ) : (
                <Link
                  href={`/register?event=${eventSlug}`}
                  className="font-['Fira_Sans'] btn-primary py-3.5 px-8 text-sm sm:text-base font-semibold shadow-lg hover:shadow-2xl transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 hover:scale-105"
                >
                  <span>Go to Registration Desk</span>
                  <HiArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
