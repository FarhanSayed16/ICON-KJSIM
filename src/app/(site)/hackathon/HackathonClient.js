'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowRight,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import BorderlandHero from '@/components/BorderlandHero/BorderlandHero';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';

const DOMAIN_TRACKS = [
  {
    id: 'ai-ml',
    suit: '♠',
    level: 'KING ♠',
    suitName: 'SPADES // PHYSICAL & HARDCORE CODE',
    title: 'AI & Intelligent Systems',
    tag: 'GEN-AI & ML',
    desc: 'Harness LLMs, computer vision, and autonomous agents to automate workflows, decode complex data, and solve real-world problems.',
    tech: ['PyTorch', 'OpenAI / HuggingFace', 'Vector DBs', 'LangChain'],
    accent: '#B7202E',
  },
  {
    id: 'fullstack',
    suit: '♣',
    level: 'ACE ♣',
    suitName: 'CLUBS // SQUAD & DISTRIBUTED SCALE',
    title: 'Cloud & Web Platforms',
    tag: 'NEXT-GEN WEB',
    desc: 'Architect blazingly fast, accessible, and scalable platforms with modern frontend frameworks and distributed microservices.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL / Redis'],
    accent: '#ED1C24',
  },
  {
    id: 'fintech',
    suit: '♦',
    level: 'QUEEN ♦',
    suitName: 'DIAMONDS // LOGIC & QUANTITATIVE',
    title: 'FinTech & Analytics',
    tag: 'FINANCIAL DATA',
    desc: 'Build secure, fraud-resistant transaction systems, algorithmic models, and real-time visualization dashboards for global markets.',
    tech: ['Data Pipelines', 'Security APIs', 'Kafka', 'WebSockets'],
    accent: '#231F20',
  },
  {
    id: 'open-innovation',
    suit: '♥',
    level: 'JACK ♥',
    suitName: 'HEARTS // PSYCHOLOGY & UNCONVENTIONAL',
    title: 'Open Innovation & Moonshots',
    tag: 'MOONSHOTS',
    desc: 'No boundaries. Combine IoT, AR/VR, accessibility tech, or sustainability frameworks to tackle problems that defy classification.',
    tech: ['Cross-Domain', 'Hardware & IoT', 'Social Impact', 'EdTech'],
    accent: '#B7202E',
  },
];

const TIMELINE_STEPS = [
  {
    day: 'PHASE 01',
    suit: '♠',
    time: 'Feb 5, 2026',
    title: 'Squad Registration & Arena Lock',
    desc: 'Final deadline to register your 2-4 member squad and lock your competition arena.',
  },
  {
    day: 'DAY 01',
    suit: '♣',
    time: 'Feb 13, 2026 — 10:00 AM',
    title: 'Opening Bell & Problem Statement Reveal',
    desc: 'Auditorium briefing at Somaiya Vidyavihar. 12-hour sprint clock initiates & VISA countdown is live!',
  },
  {
    day: 'DAY 01',
    suit: '♦',
    time: 'Feb 13, 2026 — 04:00 PM',
    title: 'Checkpoint 1: Mentorship Review',
    desc: 'Industry mentors review architectures, test API pipelines, and help unblock teams.',
  },
  {
    day: 'DAY 01',
    suit: '♥',
    time: 'Feb 13, 2026 — 10:00 PM',
    title: 'Git Freeze & Submissions (VISA Deadline)',
    desc: '12-hour sprint concludes! Teams submit repositories, live prototype links, and pitch slide decks.',
  },
  {
    day: 'DAY 01',
    suit: '♠',
    time: 'Feb 13, 2026 — 10:45 PM',
    title: 'Final Pitches & Podium Ceremony',
    desc: 'Top finalist squads present live on the main auditorium stage before industry judges.',
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
    desc: 'Uniqueness of the solution, unconventional thinking, and creative problem-solving approach.',
  },
  {
    title: 'Execution & Feasibility',
    weight: '20%',
    desc: 'Practical feasibility, market relevance, and scalability of the concept.',
  },
  {
    title: 'Design & Presentation',
    weight: '20%',
    desc: 'UI/UX Polish, smooth user flow, and the clarity of the live pitch.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What is CodeICON?',
    a: 'CodeICON is the flagship 12-hour hackathon arena of ICON 2026, hosted at K J Somaiya Institute of Management, Somaiya Vidyavihar campus. Teams sprint to build working tech solutions across four competitive tracks.',
  },
  {
    q: 'Can teams have members from different colleges?',
    a: 'Yes! Cross-college and cross-specialization teams (engineering + data science + management) are completely allowed and encouraged.',
  },
  {
    q: 'What is the squad size limit?',
    a: 'Squads must consist of 2 to 4 members. Solo entries are not accepted for CodeICON.',
  },
  {
    q: 'Will high-speed internet and power be provided?',
    a: 'Absolutely. Dedicated campus Wi-Fi, lab workstations, power strips, 24/7 technical assistance, and continuous refreshments will be provided throughout the 12 hours.',
  },
  {
    q: 'Are pre-built templates or existing repos allowed?',
    a: 'No. All project code must be created during the official 12-hour window. Using boilerplate (e.g., create-next-app, vite) and open-source packages is permitted, but existing project clones will be disqualified.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Registration is ₹500 per squad, which includes official CodeICON participant badges, meals, refreshments, certificates, and entry to keynote events.',
  },
];

export default function HackathonClient() {
  const [hackathonStatus, setHackathonStatus] = useState('open');
  const [eventSlug, setEventSlug] = useState('code-icon');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const match = json.data.find(
            (e) => e.slug === 'code-icon' || e.slug === 'hackathon'
          );
          if (match) {
            setEventSlug(match.slug);
            if (match.registrationStatus) {
              setHackathonStatus(match.registrationStatus);
            }
          }
        }
      } catch { }
    }
    loadStatus();
  }, []);

  const isClosed = hackathonStatus === 'closed';
  const isPaused = hackathonStatus === 'paused';
  const isSoon = hackathonStatus === 'starting_soon';
  const isDisabled = isClosed || isPaused || isSoon;

  return (
    <div className="bg-[#FAF8F8] text-[#231F20] min-h-screen relative overflow-hidden">
      {/* ── Immersive Alice in Borderland Hero Arena (Dark) ── */}
      <BorderlandHero status={hackathonStatus} eventSlug={eventSlug} />



      {/* ── Borderland Themed Competition Tracks (Dark Arena Feel, Sharp Somaiya Notch) ── */}
      <section id="tracks" className="relative z-10 bg-[#1D191A] text-white py-16 sm:py-24 border-y border-white/10 scroll-mt-24">
        {/* Subtle Background Watermark Suits */}
        <div className="absolute top-6 left-6 text-white/[0.03] text-8xl font-bold select-none pointer-events-none">
          ♠
        </div>
        <div className="absolute bottom-6 right-6 text-[#ED1C24]/[0.03] text-8xl font-bold select-none pointer-events-none">
          ♦
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-ping shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ED1C24]">
                  CODEICON ARENA TRACKS
                </span>
              </div>
              <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-white font-normal tracking-tight">
                Choose Your Game
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/70 max-w-xl mx-auto mt-2">
                Pick your domain suit. Detailed problem statements will be revealed at the opening bell.
              </p>
            </div>
          </ScrollReveal>

          {/* Cards with Sharp Corners (rounded-none) for flush Somaiya Edge Notch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {DOMAIN_TRACKS.map((track, i) => (
              <ScrollReveal key={track.id} delay={i * 0.1}>
                <div className="group bg-[#231F20] border border-white/10 rounded-none p-7 sm:p-9 shadow-lg hover:border-[#ED1C24]/60 hover:shadow-[0_0_35px_rgba(237,28,36,0.22)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
                  {/* Somaiya Corner Geometric Notch (Fits flush with sharp rounded-none edges) */}
                  <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                    <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                  </div>

                  <div>
                    {/* Suit & Track Category Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl leading-none font-bold text-[#ED1C24]">
                          {track.suit}
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-white font-['Fira_Sans'] text-[11px] font-bold tracking-wider uppercase">
                          {track.tag}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-[#ED1C24]/10 border border-[#ED1C24]/30 text-[#ED1C24] text-[11px] font-['Fira_Sans'] font-bold tracking-widest uppercase">
                        {track.level}
                      </span>
                    </div>

                    <h3 className="font-['Marcellus'] text-2xl sm:text-3xl text-white font-normal mb-3 group-hover:text-[#ED1C24] transition-colors">
                      {track.title}
                    </h3>

                    <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/70 leading-relaxed mb-6 font-normal">
                      {track.desc}
                    </p>
                  </div>

                  <div>
                    <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <span className="font-['Fira_Sans'] text-xs font-semibold text-white/60 uppercase tracking-wider mr-1">
                        Stack Focus:
                      </span>
                      {track.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 bg-black/40 border border-white/10 text-white/80 text-xs font-['Fira_Sans'] font-medium"
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
        </div>
      </section>

      {/* ── Somaiya White Sections (Clean Contrast & Prestige) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* ── Prize Podium ── */}
        <section className="pb-16 sm:pb-24">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ED1C24] shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B7202E]">
                  SURVIVAL REWARDS &amp; PODIUM
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
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 sm:p-8 text-center shadow-xs hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold font-['Marcellus']">
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
                    <span>Direct Incubation Mentorship</span>
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
              <div className="bg-white border-2 border-[#B7202E] rounded-2xl p-8 sm:p-10 text-center shadow-xl hover:shadow-2xl transition-all relative -translate-y-2 sm:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B7202E] text-white px-5 py-1 rounded-full text-xs font-bold font-['Fira_Sans'] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <HiOutlineTrophy size={14} className="text-[#FBBF24]" />
                  <span>GRAND CHAMPION</span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#B7202E]/10 text-[#B7202E] flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-['Marcellus']">
                  1st
                </div>
                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#B7202E] mb-2 block">
                  CodeICON Winner
                </span>
                <div className="font-['Marcellus'] text-4xl sm:text-5xl text-[#231F20] font-normal mb-1">
                  ₹25,000
                </div>
                <p className="font-['Fira_Sans'] text-xs text-[#58595B] mb-6">Cash Prize + Championship Trophy</p>
                <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-xs font-['Fira_Sans'] text-[#231F20] text-left">
                  <div className="flex items-center gap-2 font-medium">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Winner Trophy &amp; Medals</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Priority Startup Incubation Access</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Keynote Feature on Main Stage</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Exclusive Somaiya Champion Merch</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* 3rd Place */}
            <ScrollReveal delay={0.2} className="order-3">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 sm:p-8 text-center shadow-xs hover:shadow-md transition-all relative">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold font-['Marcellus']">
                  3rd
                </div>
                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#58595B] mb-2 block">
                  Second Runner Up
                </span>
                <div className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-1">
                  ₹10,000
                </div>
                <p className="font-['Fira_Sans'] text-xs text-[#58595B] mb-6">Cash Prize + Bronze Trophy</p>
                <div className="pt-4 border-t border-[#E5E7EB] space-y-2 text-xs font-['Fira_Sans'] text-[#58595B] text-left">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Official Runner Up Memento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineCheckCircle className="text-[#B7202E] shrink-0" size={16} />
                    <span>Industry Mentorship Voucher</span>
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

        {/* ── 12-Hour Survival Timeline (Borderland Arena Themed) ── */}
        <section className="py-14 sm:py-20 border-t border-[#E5E7EB]" id="timeline">
          <ScrollReveal>
            <div className="bg-[#1D191A] text-white border border-white/10 rounded-none p-8 sm:p-14 shadow-2xl relative overflow-hidden">
              {/* Somaiya Red Gradient Top Stripe */}
              <div className="w-full h-1.5 bg-[#ED1C24] flex absolute top-0 left-0">
                <div className="w-20 h-full bg-[#B7202E]" />
                <div className="flex-1 h-full bg-[#ED1C24]" />
              </div>

              {/* Ambient Suits Watermark */}
              <div className="absolute right-4 bottom-2 text-8xl text-white/[0.03] select-none pointer-events-none font-mono">
                ♠ ♥ ♦ ♣
              </div>

              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-pulse shrink-0" />
                  <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-widest text-[#ED1C24]">
                    ARENA CLOCK // 12-HOUR PROTOCOL
                  </span>
                </div>
                <h2 className="font-['Marcellus'] text-3xl sm:text-5xl text-white font-normal tracking-tight">
                  12-Hour Timeline
                </h2>
                <p className="font-['Fira_Sans'] text-sm sm:text-base text-stone-300 max-w-md mx-auto mt-2">
                  From orientation to code freeze, follow the exact milestone roadmap.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/15">
                {TIMELINE_STEPS.map((step) => (
                  <div key={step.title} className="relative flex items-start gap-6 pl-10">
                    {/* Glowing Suit Node */}
                    <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-[#141213] border-2 border-[#ED1C24] flex items-center justify-center text-[10px] text-[#ED1C24] shadow-[0_0_12px_rgba(237,28,36,0.6)]">
                      {step.suit}
                    </div>

                    <div className="flex-1 bg-[#141213] border border-white/10 rounded-none p-5 sm:p-6 hover:border-[#ED1C24]/60 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-none bg-white/5 border border-white/10 text-stone-300 font-mono text-[0.7rem] font-bold tracking-wider uppercase">
                          {step.day} {step.suit}
                        </span>
                        <span className="font-['Fira_Sans'] text-xs font-semibold text-[#ED1C24] flex items-center gap-1">
                          <HiOutlineClock size={14} />
                          {step.time}
                        </span>
                      </div>
                      <h4 className="font-['Marcellus'] text-xl sm:text-2xl text-white font-normal mb-1">
                        {step.title}
                      </h4>
                      <p className="font-['Fira_Sans'] text-sm text-stone-300 leading-relaxed m-0">
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
        <section className="py-14 sm:py-20 border-t border-[#E5E7EB]">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ED1C24] shrink-0" />
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
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs text-center flex flex-col justify-between hover:border-[#B7202E]/40 transition-all"
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
        <section className="py-14 sm:py-20 border-t border-[#E5E7EB]">
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
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer outline-none hover:bg-[#FAF8F8] transition-colors"
                      >
                        <span className="font-['Marcellus'] text-lg sm:text-xl text-[#231F20] font-normal">
                          {item.q}
                        </span>
                        <HiOutlineChevronDown
                          size={20}
                          className={`text-[#B7202E] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
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

        {/* ── Bottom Registration Banner (Sharp rounded-none corners for flush Somaiya Edge Notch) ── */}
        <ScrollReveal>
          <div className="mt-8 p-8 sm:p-14 bg-[#231F20] text-white rounded-none relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            {/* Somaiya Corner Geometric Device (Flush in sharp corner) */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-2 bg-[#ED1C24]" />
              <div className="absolute top-0 left-0 w-2 h-12 bg-[#B7202E]" />
            </div>

            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#ED1C24]">
                READY TO ENTER THE ARENA?
              </span>
              <h2 className="font-['Marcellus'] text-3xl sm:text-4xl text-white font-normal m-0">
                Register Your Squad for CodeICON
              </h2>
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-white/75 leading-relaxed m-0">
                Spots are limited to 35 verified squads. Secure your slot today and start ideating.
              </p>
            </div>

            <div>
              {isDisabled ? (
                <button
                  type="button"
                  disabled
                  className="py-3.5 px-8 rounded-full bg-neutral-700 text-white font-['Fira_Sans'] font-semibold cursor-not-allowed opacity-80"
                >
                  Arena Closed
                </button>
              ) : (
                <Link
                  href={`/register?event=${eventSlug}`}
                  className="font-['Fira_Sans'] bg-[#B7202E] hover:bg-[#ED1C24] py-3.5 px-8 text-sm sm:text-base font-semibold text-white rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(237,28,36,0.5)] transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 hover:scale-105"
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
