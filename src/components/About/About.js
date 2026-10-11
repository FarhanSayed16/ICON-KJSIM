'use client';

import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import { SITE_CONFIG } from '@/lib/data';

export default function About() {
  const highlightMetrics = [
    { value: '1,000+', label: 'Active Participants' },
    { value: '30+', label: 'Colleges Represented' },
    { value: '₹50K+', label: 'Prize Pools' },
    { value: '02', label: 'Days of Nonstop Action' },
  ];
  return (
    <section className="pt-24 sm:pt-32 pb-16 lg:pb-20 bg-white relative overflow-hidden" id="about">
      {/* ── Macro Somaiya Architectural Device ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={220}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] md:h-[64px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-10 sm:mt-14">
        <div className="max-w-4xl">
          {/* Editorial Headline & Attribution */}
          <ScrollReveal variant="slide-left">
            <div>
              {/* Kicker with Vitality Red Accent */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
                <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                  ABOUT THE FEST
                </span>
              </div>

              {/* Display Headline */}
              <h2 className="font-['Marcellus'] text-3xl sm:text-5xl lg:text-[3.6rem] font-normal text-[#231F20] leading-[1.15] tracking-tight mb-4 sm:mb-6">
                Built by students. Open to every challenger.
              </h2>

              {/* Department Attribution Tagline */}
              <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed max-w-xl m-0">
                {SITE_CONFIG?.institution || 'Department of Data Science & Technology'}<br className="hidden sm:inline" />
                {SITE_CONFIG?.university || 'KJ Somaiya Institute of Management, Mumbai'}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Fest Experience Ribbon ── */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="mt-14 sm:mt-20 bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 shadow-xs text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full text-center">
              {highlightMetrics.map((metric) => (
                <div key={metric.label}>
                  <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#B7202E] font-normal block">
                    {metric.value}
                  </span>
                  <span className="font-['Fira_Sans'] text-xs text-[#58595B] font-medium block mt-1">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
