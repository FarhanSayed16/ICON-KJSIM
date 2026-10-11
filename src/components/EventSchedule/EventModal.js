'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
  HiOutlinePhone,
  HiOutlineMail,
  HiArrowRight,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';

export default function EventModal({ event, onClose }) {
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-[#231F20]/75 backdrop-blur-sm z-[500] flex items-center justify-center p-3 sm:p-5 md:p-6"
        onClick={onClose}
        aria-hidden="true"
      >
        <motion.div
          ref={modalRef}
          className="bg-white border border-[#E5E7EB] rounded-2xl max-w-[1040px] w-full h-[92vh] sm:h-[90vh] md:h-[620px] max-h-[92vh] overflow-hidden relative outline-none shadow-2xl flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${event.name}`}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 text-[#58595B] border border-[#E5E7EB] hover:bg-[#B7202E] hover:text-white transition-all cursor-pointer z-50 shadow-md"
            onClick={onClose}
            aria-label="Close modal"
          >
            <HiX size={20} />
          </button>

          {/* ── Left Side: Big Full Poster Flyer ── */}
          <div className="w-full md:w-[42%] lg:w-[40%]  relative flex flex-col items-center justify-center overflow-hidden shrink-0 h-[200px] sm:h-[250px] md:h-full border-b md:border-b-0 md:border-r border-[#2d2829]">
            {/* Ambient blurred backdrop for depth */}
            {event.posterImage && (
              <div className="absolute inset-0 opacity-35 blur-2xl  pointer-events-none">
                <Image
                  src={event.posterImage}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Poster graphic displayed in full */}
            <div className="relative z-10 w-full h-full p-3 sm:p-5 flex items-center justify-center">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#231F20]">
                {event.posterImage ? (
                  <Image
                    src={event.posterImage}
                    alt={`${event.name} poster`}
                    fill
                    priority
                    className="object-stretch object-center"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 font-['Marcellus'] text-2xl">
                    {event.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Side: Event Details & Permanent Register Bar ── */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-white relative">
            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-0 space-y-5">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-3 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-[#B7202E] text-white shadow-xs font-['Fira_Sans'] tracking-wide">
                    {event.category}
                  </span>
                  {event.registrationStatus === 'closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-red-100 text-[#B7202E] border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7202E] animate-pulse" />
                      Closed
                    </span>
                  ) : event.registrationStatus === 'paused' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                      Paused
                    </span>
                  ) : event.registrationStatus === 'starting_soon' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      Starting Soon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Open
                    </span>
                  )}
                  {event.prizePool > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-[#231F20] text-white shadow-xs font-['Fira_Sans']">
                      Prize Pool: ₹{event.prizePool.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Short Description */}
              <div>
                <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-normal text-[#231F20] mb-1.5 leading-snug">
                  {event.name}
                </h2>
                <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed">
                  {event.shortDesc}
                </p>
              </div>

              {/* Full Description */}
              <p className="font-['Fira_Sans'] text-sm sm:text-[0.92rem] leading-relaxed text-[#58595B]">
                {event.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-[#FAF8F8] border border-[#E5E7EB]">
                <div className="flex gap-2.5 items-start text-[#58595B]">
                  <HiOutlineCalendar size={18} className="text-[#B7202E] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] mb-0.5">
                      Date &amp; Time
                    </span>
                    <span className="font-['Fira_Sans'] text-sm text-[#231F20] font-semibold">
                      {event.date} · {event.time}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-[#58595B]">
                  <HiOutlineLocationMarker size={18} className="text-[#B7202E] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] mb-0.5">
                      Venue
                    </span>
                    <span className="font-['Fira_Sans'] text-sm text-[#231F20] font-semibold truncate block max-w-[200px]">
                      {event.venue}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-[#58595B]">
                  <HiOutlineUserGroup size={18} className="text-[#B7202E] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] mb-0.5">
                      Team Size
                    </span>
                    <span className="font-['Fira_Sans'] text-sm text-[#231F20] font-semibold">
                      {event.teamSize}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-[#58595B]">
                  <HiOutlineCurrencyRupee size={18} className="text-[#B7202E] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] mb-0.5">
                      Registration Fee
                    </span>
                    <span className="font-['Fira_Sans'] text-sm text-[#231F20] font-semibold">
                      {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-[#58595B] sm:col-span-2">
                  <HiOutlineTrophy size={18} className="text-[#ED1C24] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B] mb-0.5">
                      Prize Pool
                    </span>
                    <span className="font-['Fira_Sans'] text-sm text-[#231F20] font-semibold">
                      ₹{event.prizePool.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition Rules */}
              {event.rules && event.rules.length > 0 && (
                <div>
                  <h4 className="font-['Marcellus'] text-base sm:text-lg font-medium text-[#231F20] mb-2">
                    Competition Rules
                  </h4>
                  <ul className="flex flex-col gap-1.5 pl-4 list-disc font-['Fira_Sans'] text-xs sm:text-sm text-[#58595B] leading-relaxed">
                    {event.rules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Point of Contact */}
              {event.poc && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F8] border border-[#E5E7EB]">
                  <h4 className="font-['Marcellus'] text-sm sm:text-base font-medium text-[#231F20] mb-1.5">
                    Point of Contact
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-['Fira_Sans']">
                    <span className="font-semibold text-[#231F20]">
                      {event.poc.name}
                    </span>
                    <a
                      href={`tel:${event.poc.phone}`}
                      className="inline-flex items-center gap-1 text-[#58595B] hover:text-[#B7202E] transition-colors"
                    >
                      <HiOutlinePhone size={13} /> {event.poc.phone}
                    </a>
                    <a
                      href={`mailto:${event.poc.email}`}
                      className="inline-flex items-center gap-1 text-[#58595B] hover:text-[#B7202E] transition-colors"
                    >
                      <HiOutlineMail size={13} /> {event.poc.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ── Fixed, Permanently Visible Bottom Action Bar with Register Button ── */}
            <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-[#FAF8F8] flex items-center justify-between gap-4 shrink-0 shadow-lg z-30">
              <div>
                <span className="block font-['Fira_Sans'] text-[0.7rem] uppercase tracking-wider text-[#58595B]">
                  Registration Fee
                </span>
                <span className="font-['Fira_Sans'] text-lg sm:text-xl font-bold text-[#B7202E]">
                  {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
                </span>
              </div>

              {event.registrationStatus === 'closed' ? (
                <button
                  type="button"
                  disabled
                  className="py-3 sm:py-3.5 px-6 sm:px-9 text-sm sm:text-base font-bold rounded-full bg-neutral-600 text-white cursor-not-allowed opacity-90"
                >
                  <span>Registration Closed</span>
                </button>
              ) : event.registrationStatus === 'paused' ? (
                <button
                  type="button"
                  disabled
                  className="py-3 sm:py-3.5 px-6 sm:px-9 text-sm sm:text-base font-bold rounded-full bg-orange-600 text-white cursor-not-allowed opacity-90"
                >
                  <span>Registration Paused</span>
                </button>
              ) : event.registrationStatus === 'starting_soon' ? (
                <button
                  type="button"
                  disabled
                  className="py-3 sm:py-3.5 px-6 sm:px-9 text-sm sm:text-base font-bold rounded-full bg-amber-600 text-white cursor-not-allowed opacity-90"
                >
                  <span>Starting Soon</span>
                </button>
              ) : (
                <Link
                  href={`/register?event=${event.slug}`}
                  className="inline-flex items-center gap-2.5 py-3 sm:py-3.5 px-6 sm:px-9 text-sm sm:text-base font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all rounded-full bg-[#B7202E] hover:bg-[#A01B27] text-white cursor-pointer no-underline"
                  onClick={onClose}
                >
                  <span>Register Now</span>
                  <HiArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
