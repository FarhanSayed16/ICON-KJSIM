'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import { HiOutlineUser, HiOutlineMail, HiOutlineChatAlt2, HiOutlineCheck } from 'react-icons/hi';
import { submitContact } from '@/app/actions/submitContact';
import { submitBrochure } from '@/app/actions/submitBrochure';

const BROCHURE_PERKS = [
  'Complete round formats and guidelines for all 13 competitions',
  'Campus lab venues, reporting times, and transit instructions',
  'Cash prize breakdowns, trophy tiers, and participation certificates',
];

export default function ContactForm() {
  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Brochure Form State
  const [brochureEmail, setBrochureEmail] = useState('');
  const [isBrochureSubmitting, setIsBrochureSubmitting] = useState(false);

  // Handle Contact Form Submit
  const handleContactAction = async (formDataObj) => {
    if (!contactData.email || !contactData.message) return;

    setIsContactSubmitting(true);
    try {
      const result = await submitContact(null, formDataObj);
      if (result.success) {
        toast.success(result.message);
        setContactData({ name: '', email: '', message: '' });
      } else {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0];
          toast.error(firstError);
        } else {
          toast.error(result.message);
        }
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Handle Brochure Form Submit
  const handleBrochureSubmit = async (e) => {
    e.preventDefault();
    if (!brochureEmail) return;

    setIsBrochureSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('email', brochureEmail);
      const result = await submitBrochure(null, fd);
      if (result.success) {
        toast.success(result.message || 'Thanks! The brochure will be sent to your inbox.');
        setBrochureEmail('');
      } else {
        toast.error(result.message || 'Could not submit brochure request.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsBrochureSubmitting(false);
    }
  };

  return (
    <section className="relative pt-20 sm:pt-28 pb-32 sm:pb-40 bg-white overflow-hidden" id="contact">
      {/* ── Section Header ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 sm:mb-16">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#ED1C24]">
                CONNECT & EXPLORE
              </span>
            </div>
            <h2 className="font-['Marcellus'] text-4xl sm:text-5xl md:text-6xl text-[#231F20] font-normal tracking-tight mb-3">
              Get In Touch
            </h2>
            <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed max-w-xl mx-auto m-0">
              Download our official event brochure or send a message directly to the organizing committee.
            </p>
            <span className="block w-14 h-1 bg-[#ED1C24] rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Left-Right 2-Column Grid (Brochure & Contact Form) ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* ── Left Column: Brochure Card ── */}
          <ScrollReveal variant="slide-left" delay={0.1} className="h-full">
            <div className="bg-[#FAF8F8] border border-[#E5E7EB]  p-8 sm:p-10 lg:p-12 shadow-sm hover:shadow-md hover:border-[#B7202E]/30 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
              {/* Somaiya Brand Top Accent Bar */}
              <div className="absolute top-0 left-0 w-20 h-1.5 bg-[#B7202E] flex">
                <div className="w-8 h-full bg-[#ED1C24]" />
                <div className="flex-1 h-full bg-[#B7202E]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                  <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#B7202E]">
                    OFFICIAL EVENT KIT
                  </span>
                </div>

                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl lg:text-4xl text-[#231F20] font-normal leading-tight mb-3">
                  Get the ICON 2026 Brochure
                </h3>

                <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed mb-6 font-normal">
                  Enter your email address to receive our comprehensive event brochure, complete rulebooks, cash prize pool details (₹50K+), and the 2-day schedule directly in your inbox.
                </p>

                {/* Key Guide Takeaways */}
                <div className="space-y-3 mb-8">
                  {BROCHURE_PERKS.map((perk) => (
                    <div key={perk} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#B7202E]/10 text-[#B7202E] flex items-center justify-center shrink-0 mt-0.5">
                        <HiOutlineCheck size={12} />
                      </span>
                      <span className="font-['Fira_Sans'] text-xs sm:text-sm text-[#231F20]">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brochure Email Form */}
              <form onSubmit={handleBrochureSubmit} className="flex flex-col gap-3 pt-6 border-t border-[#E5E7EB]">
                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B] pointer-events-none">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={brochureEmail}
                    onChange={(e) => setBrochureEmail(e.target.value)}
                    className="font-['Fira_Sans'] w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/20 transition-all shadow-xs"
                    required
                    disabled={isBrochureSubmitting}
                    aria-label="Email for brochure"
                  />
                </div>
                <button
                  type="submit"
                  className="font-['Fira_Sans'] btn-primary w-full justify-center py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                  disabled={isBrochureSubmitting}
                >
                  <span>{isBrochureSubmitting ? 'Sending Brochure...' : 'Get Official Brochure'}</span>
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* ── Right Column: Contact Form Card ── */}
          <ScrollReveal variant="slide-right" delay={0.2} className="h-full">
            <div className="bg-white border border-[#E5E7EB]  p-8 sm:p-10 lg:p-12 shadow-sm hover:shadow-md hover:border-[#B7202E]/30 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
              {/* Somaiya Brand Top Accent Bar */}
              <div className="absolute top-0 right-0 w-20 h-1.5 bg-[#B7202E] flex">
                <div className="flex-1 h-full bg-[#B7202E]" />
                <div className="w-8 h-full bg-[#ED1C24]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#ED1C24] shrink-0" />
                  <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#B7202E]">
                    LET&apos;S COLLABORATE
                  </span>
                </div>

                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl lg:text-4xl text-[#231F20] font-normal leading-tight mb-3">
                  Got an Idea?
                </h3>

                <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed mb-6 font-normal">
                  Reach out to us for collaborations, campus questions, registration queries, or custom partnership opportunities.
                </p>
              </div>

              {/* Contact Form */}
              <form action={handleContactAction} className="flex flex-col gap-3.5 pt-2">
                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B] pointer-events-none">
                    <HiOutlineUser size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name (Optional)"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="font-['Fira_Sans'] w-full pl-11 pr-4 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/20 transition-all"
                    disabled={isContactSubmitting}
                  />
                </div>

                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B] pointer-events-none">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="font-['Fira_Sans'] w-full pl-11 pr-4 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/20 transition-all"
                    required
                    disabled={isContactSubmitting}
                  />
                </div>

                <div className="relative w-full">
                  <div className="absolute left-3.5 top-3.5 text-[#58595B] pointer-events-none">
                    <HiOutlineChatAlt2 size={20} />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Your Message or Inquiry"
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    className="font-['Fira_Sans'] w-full pl-11 pr-4 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/20 transition-all resize-none"
                    required
                    disabled={isContactSubmitting}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="font-['Fira_Sans'] btn-primary w-full justify-center py-3.5 mt-1 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                  disabled={isContactSubmitting}
                >
                  <span>{isContactSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </ScrollReveal>

        </div>
      </div>

      {/* ── Macro / Big Edge: Bottom-Right framing transition before Registration Banner ── */}
      <SomaiyaEdge
        variant="macro-bottom-right"
        dropHeight={180}
        className="pointer-events-none absolute bottom-0 right-0 z-[5]"
      />
    </section>
  );
}
