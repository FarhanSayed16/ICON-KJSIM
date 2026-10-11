'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function RegistrationBanner() {
  return (
    <section className="py-14 sm:py-20 bg-white overflow-hidden" id="registration-banner">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="banner">
          <div className="relative bg-[#8B1A24] text-white px-6 sm:px-12 py-10 sm:py-14 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Somaiya Edge Notch (Top-Left — Signature Edge Device popping into place) */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ originY: 1 }}
              className="w-2.5 sm:w-3.5 h-12 sm:h-14 bg-[#ED1C24] absolute -top-3.5 sm:-top-4 left-0 pointer-events-none shadow-xs z-20"
            />

            {/* Content Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 relative z-10 pb-2">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#ED1C24] shrink-0 animate-pulse" />
                  <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ED1C24] block">
                    ICON 26 REGISTRATION
                  </span>
                </div>
                <h2 className="font-['Marcellus'] text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.18] tracking-tight">
                  Pick your event. Bring<br className="hidden sm:inline" /> your team.
                </h2>
              </div>

              <div>
                <Link
                  href="/register"
                  className="font-['Fira_Sans'] bg-white hover:bg-[#ED1C24] hover:text-white text-[#B7202E] font-semibold text-sm sm:text-base px-8 py-3.5 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center shrink-0 cursor-pointer no-underline border-2 border-white hover:border-[#ED1C24]"
                >
                  <span>Register now</span>
                </Link>
              </div>
            </div>

            {/* Somaiya Edge Stripe (Bottom — Expands smoothly from left) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="h-2 sm:h-2.5 bg-[#ED1C24] absolute bottom-0 left-0 right-0 pointer-events-none"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
