'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMail,
  HiArrowRight,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineCode,
  HiOutlineUsers,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import { TEAM_MEMBERS } from '@/lib/data';

const CATEGORY_ORDER = [
  'Faculty',
  'Organizing Committee',
  'Core Committee',
  'Development Team',
  'Marketing & PR',
  'Logistics & Operations',
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export default function TeamClient() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Group team members by their 'team' category
  const groupedTeam = useMemo(() => {
    return TEAM_MEMBERS.reduce((acc, member) => {
      const groupName = member.team || 'Core Committee';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(member);
      return acc;
    }, {});
  }, []);

  const existingCategories = Object.keys(groupedTeam);
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((cat) => existingCategories.includes(cat)),
    ...existingCategories.filter((cat) => !CATEGORY_ORDER.includes(cat)),
  ];

  const visibleCategories =
    selectedDepartment === 'all'
      ? orderedCategories
      : orderedCategories.filter((c) => c === selectedDepartment);

  const totalMembers = TEAM_MEMBERS.length;

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
                THE ARCHITECTS OF ICON 2026
              </span>
            </div>

            <h1 className="font-['Marcellus'] text-4xl sm:text-6xl lg:text-7xl font-normal text-[#231F20] leading-tight tracking-tight mb-4">
              Meet the Core Team
            </h1>

            <p className="font-['Fira_Sans'] text-base sm:text-lg text-[#58595B] max-w-2xl mx-auto leading-relaxed font-normal">
              Faculty mentors, student convenors, software engineers, and logistical leads working together to orchestrate Mumbai&apos;s premier data &amp; tech experience.
            </p>

            {/* Quick Metrics Bar (Clean typography with icons, NO emojis) */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#231F20] font-['Fira_Sans'] text-xs font-semibold shadow-2xs">
                <HiOutlineAcademicCap size={15} className="text-[#B7202E]" />
                <span>Faculty Mentors</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#231F20] font-['Fira_Sans'] text-xs font-semibold shadow-2xs">
                <HiOutlineBriefcase size={15} className="text-[#B7202E]" />
                <span>Student Steering Committee</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#231F20] font-['Fira_Sans'] text-xs font-semibold shadow-2xs">
                <HiOutlineCode size={15} className="text-[#B7202E]" />
                <span>Web &amp; Infrastructure Team</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#231F20] font-['Fira_Sans'] text-xs font-semibold shadow-2xs">
                <HiOutlineUsers size={15} className="text-[#B7202E]" />
                <span>100+ Volunteers</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Department Filter Pills ── */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-14 sm:mb-20 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => setSelectedDepartment('all')}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-['Fira_Sans'] font-medium transition-all duration-200 cursor-pointer outline-none flex items-center gap-2 border ${
                selectedDepartment === 'all'
                  ? 'text-white border-[#B7202E] shadow-xs'
                  : 'text-[#58595B] bg-white border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
              }`}
            >
              {selectedDepartment === 'all' && (
                <motion.span
                  layoutId="activeTeamDeptPill"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-[#B7202E] rounded-full -z-10"
                />
              )}
              <span className="relative z-10">All Departments</span>
              <span
                className={`relative z-10 text-[0.68rem] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedDepartment === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#58595B]'
                }`}
              >
                {totalMembers}
              </span>
            </button>

            {orderedCategories.map((category) => {
              const isActive = selectedDepartment === category;
              const count = groupedTeam[category]?.length || 0;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedDepartment(category)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-['Fira_Sans'] font-medium transition-all duration-200 cursor-pointer outline-none flex items-center gap-2 border ${
                    isActive
                      ? 'text-white border-[#B7202E] shadow-xs'
                      : 'text-[#58595B] bg-white border-[#E5E7EB] hover:border-[#B7202E]/30 hover:text-[#231F20]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTeamDeptPill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-[#B7202E] rounded-full -z-10"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
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

        {/* ── Team Groups Display ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDepartment}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-16 sm:space-y-24"
          >
            {visibleCategories.map((category) => {
              const members = groupedTeam[category] || [];
              if (members.length === 0) return null;

              // Check if Faculty section: render distinctive layout
              const isFaculty = category === 'Faculty';

              return (
                <div key={category} className="space-y-8">
                  {/* Category Header with Somaiya red notch */}
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                        <h2 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] font-normal tracking-tight">
                          {category}
                        </h2>
                      </div>
                      <span className="font-['Fira_Sans'] text-xs font-semibold text-[#58595B] uppercase tracking-wider block mt-1">
                        {members.length} {members.length === 1 ? 'Leader' : 'Members'}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-[#E5E7EB] ml-4" />
                  </div>

                  {/* ── Faculty Mentorship Feature Spotlight ── */}
                  {isFaculty ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E5E7EB] rounded-3xl p-7 sm:p-10 shadow-xs relative overflow-hidden">
                      {/* Somaiya Geometric Corner Notch */}
                      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-6 h-6 bg-[#B7202E]/10 border-b-2 border-l-2 border-[#B7202E]" />
                      </div>

                      {members.map((faculty) => (
                        <div key={faculty.name} className="col-span-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                          <div className="lg:col-span-4 relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-neutral-900 border border-[#E5E7EB] shadow-md">
                            {faculty.photo ? (
                              <Image
                                src={faculty.photo}
                                alt={faculty.name}
                                fill
                                className="object-cover"
                                style={{ objectPosition: faculty.objectPosition || 'center top' }}
                                sizes="(max-width: 1024px) 100vw, 380px"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-[#231F20] text-white">
                                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center font-['Marcellus'] text-3xl mb-2">
                                  {getInitials(faculty.name)}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-8 flex flex-col justify-between">
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B7202E]/10 text-[#B7202E] font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider mb-3">
                                <HiOutlineAcademicCap size={15} />
                                <span>{faculty.role}</span>
                              </div>

                              <h3 className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-3">
                                {faculty.name}
                              </h3>

                              <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed mb-6 font-normal">
                                {faculty.bio ||
                                  'Guiding the student organizing committee, academic excellence, and institutional vision for ICON at KJ Somaiya Institute of Management.'}
                              </p>
                            </div>

                            <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center gap-4">
                              {faculty.email && (
                                <a
                                  href={`mailto:${faculty.email}`}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F8] border border-[#E5E7EB] text-[#231F20] hover:border-[#B7202E] hover:text-[#B7202E] text-xs sm:text-sm font-semibold transition-colors"
                                >
                                  <HiOutlineMail size={16} className="text-[#B7202E]" />
                                  <span>{faculty.email}</span>
                                </a>
                              )}
                              {faculty.linkedin && (
                                <a
                                  href={faculty.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F8] border border-[#E5E7EB] text-[#231F20] hover:border-[#B7202E] hover:text-[#B7202E] text-xs sm:text-sm font-semibold transition-colors"
                                >
                                  <FaLinkedinIn size={14} className="text-[#B7202E]" />
                                  <span>LinkedIn Profile</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* ── Creative Somaiya Identity Card Grid ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                      {members.map((member, i) => {
                        const socials = [];
                        if (member.linkedin) {
                          socials.push({
                            href: member.linkedin,
                            label: `${member.name} on LinkedIn`,
                            icon: FaLinkedinIn,
                            isExternal: true,
                          });
                        }
                        if (member.instagram) {
                          socials.push({
                            href: member.instagram,
                            label: `${member.name} on Instagram`,
                            icon: FaInstagram,
                            isExternal: true,
                          });
                        }
                        if (member.email) {
                          socials.push({
                            href: `mailto:${member.email}`,
                            label: `Email ${member.name}`,
                            icon: HiOutlineMail,
                            isExternal: false,
                          });
                        }

                        return (
                          <ScrollReveal key={member.name} delay={i * 0.05}>
                            <div className="group bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-xs hover:shadow-xl hover:border-[#B7202E]/50 transition-all duration-300 flex flex-col justify-between h-full relative">
                              {/* Somaiya Corner Geometric Notch */}
                              <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none overflow-hidden">
                                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#B7202E]/10 border-b border-l border-[#B7202E]/40" />
                              </div>

                              <div>
                                {/* Top Credential Header */}
                                <div className="flex items-center justify-between gap-2 mb-3.5">
                                  <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F8] border border-[#E5E7EB] text-[0.68rem] font-bold uppercase tracking-wider text-[#58595B] font-['Fira_Sans']">
                                    {member.team?.split(' ')[0]}
                                  </span>
                                  <span className="font-mono text-[0.65rem] text-[#58595B]/60 tracking-wider">
                                    ICON · 26
                                  </span>
                                </div>

                                {/* Creative Portrait Frame (No translate-Y jump) */}
                                <div className="relative aspect-[1/1.08] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-[#E5E7EB] mb-4">
                                  {member.photo ? (
                                    <Image
                                      src={member.photo}
                                      alt={member.name}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      style={{
                                        objectPosition: member.objectPosition || 'center top',
                                      }}
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#231F20] to-[#161314] text-white p-6">
                                      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center font-['Marcellus'] text-2xl mb-2 text-white/90">
                                        {getInitials(member.name)}
                                      </div>
                                      <span className="font-['Fira_Sans'] text-[0.65rem] text-white/50 tracking-wider uppercase font-semibold">
                                        {member.team}
                                      </span>
                                    </div>
                                  )}

                                  {/* Subtle bottom shadow vignette */}
                                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                                </div>

                                {/* Name & Role */}
                                <h3 className="font-['Marcellus'] text-xl font-normal text-[#231F20] mb-1 leading-snug group-hover:text-[#B7202E] transition-colors">
                                  {member.name}
                                </h3>

                                <div className="flex items-center gap-1.5 mb-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] shrink-0" />
                                  <span className="font-['Fira_Sans'] text-xs font-semibold text-[#B7202E] uppercase tracking-wider block">
                                    {member.role}
                                  </span>
                                </div>

                                {member.bio && (
                                  <p className="font-['Fira_Sans'] text-xs text-[#58595B] leading-relaxed line-clamp-2 mb-4 font-normal">
                                    {member.bio}
                                  </p>
                                )}
                              </div>

                              {/* Bottom Action Shelf */}
                              <div className="pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between">
                                <span className="font-['Fira_Sans'] text-[0.7rem] text-[#58595B]/70 uppercase tracking-wider font-semibold">
                                  Connect
                                </span>
                                {socials.length > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    {socials.map(({ href, label, icon: Icon, isExternal }) => (
                                      <a
                                        key={href}
                                        href={href}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                        className="w-7 h-7 rounded-full bg-[#FAF8F8] hover:bg-[#B7202E] text-[#58595B] hover:text-white flex items-center justify-center transition-colors border border-[#E5E7EB] hover:border-[#B7202E]"
                                        aria-label={label}
                                      >
                                        <Icon size={12} />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Volunteer Acknowledgment Banner (Framed without plain stripes) ── */}
        <ScrollReveal>
          <div className="mt-16 sm:mt-24 p-8 sm:p-14 bg-white border border-[#E5E7EB] rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden shadow-xs">
            {/* Somaiya Corner Geometric Notch */}
            <div className="absolute top-0 right-0 w-14 h-14 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#B7202E]/10 border-b border-l border-[#B7202E]" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <HiOutlineSparkles size={18} className="text-[#ED1C24]" />
              <span className="font-['Fira_Sans'] text-xs font-bold tracking-widest uppercase text-[#B7202E]">
                HEART OF ICON 2026
              </span>
            </div>
            <h3 className="font-['Marcellus'] text-3xl sm:text-4xl text-[#231F20] font-normal mb-3">
              Powered by 100+ Student Volunteers
            </h3>
            <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
              A heartfelt salute to every student coordinator, ground volunteer, hospitality team member, and technical desk operator who makes ICON possible.
            </p>
            <Link
              href="/#contact"
              className="font-['Fira_Sans'] btn-primary py-3.5 px-8 text-sm sm:text-base font-semibold shadow-md hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Contact Organizing Committee</span>
              <HiArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
