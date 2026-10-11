'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineExternalLink, HiOutlineSparkles, HiArrowRight } from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { SPONSORS as DEFAULT_SPONSORS } from '@/lib/data';

export default function Sponsors() {
  const [sponsorsList, setSponsorsList] = useState(DEFAULT_SPONSORS);

  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetch('/api/sponsors');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSponsorsList(json.data);
        }
      } catch {
        // Fallback to static data
      }
    }
    loadSponsors();
  }, []);

  return (
    <section className="relative overflow-hidden py-18 sm:py-24 bg-[#FAF8F8]" id="sponsors">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#B7202E]/[0.03] blur-3xl pointer-events-none rounded-full" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Minimalist Section Header ── */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                PARTNERS &amp; PATRONS
              </span>
            </div>
            <h2 className="font-['Marcellus'] text-3xl sm:text-4xl md:text-5xl text-[#231F20] font-normal tracking-tight m-0">
              Our Sponsors
            </h2>
            <p className="font-['Fira_Sans'] text-xs sm:text-sm text-[#58595B] m-0 mt-2 leading-relaxed">
              Proudly supported by industry pioneers and institutions empowering innovation at KJSIM.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Clean Somaiya-Themed Logo Tiles Grid (Reference Style) ── */}
        <ScrollReveal variant="pop" delay={0.06}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {sponsorsList.map((sponsor) => (
              <a
                key={sponsor._id || sponsor.name}
                href={sponsor.url && sponsor.url !== '#' ? sponsor.url : undefined}
                target={sponsor.url && sponsor.url !== '#' ? '_blank' : undefined}
                rel={sponsor.url && sponsor.url !== '#' ? 'noopener noreferrer' : undefined}
                className={`group relative flex flex-col items-center justify-center min-h-[140px] sm:min-h-[170px] p-6 sm:p-8 bg-white border shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden no-underline ${sponsor.featured
                  ? 'border-[#B7202E]/40 hover:border-[#B7202E]'
                  : 'border-[#E5E7EB] hover:border-[#B7202E]/40'
                  }`}
                aria-label={`${sponsor.name} — ${sponsor.tier}`}
              >
                {/* Somaiya Top Accent Border on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B7202E] to-[#ED1C24] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Somaiya Signature Corner Notch for Featured Sponsor */}
                {sponsor.featured && (
                  <div className="absolute top-0 right-0 pointer-events-none">
                    <div className="w-8 h-1 bg-[#B7202E]" />
                    <div className="w-1 h-8 bg-[#ED1C24] absolute top-0 right-0" />
                  </div>
                )}

                {/* Centered Brand Logo */}
                <div className="w-full flex items-center justify-center h-16 sm:h-20 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={220}
                    height={70}
                    className="max-h-12 sm:max-h-16 max-w-[85%] w-auto object-contain"
                  />
                </div>

                {/* Minimalist Tier Pill */}
                <div className="mt-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {sponsor.featured && <HiOutlineSparkles size={12} className="text-[#ED1C24]" />}
                  <span className="font-['Fira_Sans'] text-[0.7rem] sm:text-xs font-semibold uppercase tracking-wider text-[#58595B] group-hover:text-[#B7202E] transition-colors text-center truncate">
                    {sponsor.tier || sponsor.name}
                  </span>
                  {sponsor.url && sponsor.url !== '#' && (
                    <HiOutlineExternalLink
                      size={12}
                      className="text-[#58595B] group-hover:text-[#ED1C24] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  )}
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Minimalist Bottom CTA ── */}
        <ScrollReveal variant="fade-up" delay={0.12}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
            <Link
              href="/#contact"
              className="font-['Fira_Sans'] inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B7202E] hover:bg-[#ED1C24] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md no-underline"
            >
              <span>Become a Sponsor</span>
              <HiArrowRight size={14} />
            </Link>

            <Link
              href="/sponsors"
              className="font-['Fira_Sans'] inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#FAF8F8] border border-[#E5E7EB] hover:border-[#B7202E]/30 text-[#231F20] text-xs sm:text-sm font-semibold rounded-xl transition-colors no-underline"
            >
              <span>View Partnership Hub &amp; Deck</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
