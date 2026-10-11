'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineDownload,
  HiOutlineCalendar,
  HiCheckCircle,
  HiArrowLeft,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineUpload,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineSearch,
  HiOutlineTicket,
  HiOutlineClipboardCopy,
  HiOutlineShieldCheck,
  HiArrowRight,
} from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';
import { registerUser } from '@/app/actions/registerUser';
import { generateICS, downloadICS } from '@/lib/ics';

const CATEGORY_LABEL = {
  technical: 'Technical',
  sports: 'Sports',
  gaming: 'Indoor Games & Esports',
  'mini-games': 'Mini-Games Zone (Free)',
  'non-technical': 'Non-Technical',
};

function feeLabel(fee) {
  const n = Number(fee) || 0;
  return n === 0 ? 'FREE' : `₹${n}`;
}

export default function RegistrationClient({ events = [], siteConfig }) {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('event');
  const config = siteConfig || {};

  const selectedEvent = useMemo(
    () => (eventParam ? events.find((e) => e.slug === eventParam) || null : null),
    [eventParam, events]
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    department: '',
    paymentTxnId: '',
  });

  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [copiedRegId, setCopiedRegId] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [pickerFilter, setPickerFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const qrRef = useRef(null);

  // Clean up payment preview object URL
  useEffect(() => {
    return () => {
      if (paymentPreview) URL.revokeObjectURL(paymentPreview);
    };
  }, [paymentPreview]);

  const payableAmount = Number(selectedEvent?.registrationFee) || 0;

  const paymentQr = useMemo(() => {
    const list = config.paymentQrs || [];
    return list.find((q) => Number(q.amount) === Number(payableAmount)) || null;
  }, [config.paymentQrs, payableAmount]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'paymentTxnId') value = value.toUpperCase();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPaymentFile(file);
    if (paymentPreview) URL.revokeObjectURL(paymentPreview);
    if (file) {
      setPaymentPreview(URL.createObjectURL(file));
    } else {
      setPaymentPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast.error('Choose an event first.');
      return;
    }

    if (payableAmount > 0) {
      if (!paymentQr?.qrImageUrl) {
        toast.error(`No payment QR configured for ₹${payableAmount}. Contact organisers.`);
        return;
      }
      if (!paymentFile) {
        toast.error('Please upload your payment screenshot.');
        return;
      }
      if (!formData.paymentTxnId || formData.paymentTxnId.trim().length < 4) {
        toast.error('Enter the valid transaction / UTR ID from your payment.');
        return;
      }
    }

    const formDataObj = new FormData(e.currentTarget);
    formDataObj.set('eventSlug', selectedEvent.slug);
    formDataObj.set('mobile', formData.mobile);
    formDataObj.set('department', formData.department || '');
    formDataObj.set('paymentTxnId', formData.paymentTxnId || '');
    if (paymentFile) formDataObj.set('paymentScreenshot', paymentFile);

    setIsSubmitting(true);
    setDuplicateModal(false);

    try {
      const result = await registerUser(null, formDataObj);

      if (result.success) {
        toast.success(result.message);

        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#B7202E', '#ED1C24', '#231F20', '#F9FAFB'],
          });
        }

        setSuccessData({
          registrationId: result.registrationId,
          qrCode: result.qrCode,
          eventName: result.eventName || selectedEvent.name,
          eventSlug: result.eventSlug || selectedEvent.slug,
          paymentStatus: result.paymentStatus,
          payableAmount: result.payableAmount,
        });
      } else if (result.duplicate) {
        setDuplicateMessage(result.message || 'Already registered for this event.');
        setDuplicateModal(true);
        toast(result.message);
      } else if (result.errors) {
        const firstError = Object.values(result.errors)[0];
        toast.error(firstError);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width || 300;
      canvas.height = img.height || 300;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `ICON-PASS-${successData?.qrCode || 'EVENT'}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleAddToCalendar = () => {
    if (!successData) return;
    const startDate = new Date(config.countdownTarget || Date.now());
    const endDate = new Date((config.eventDates?.end || '') + 'T18:00:00+05:30');
    const venue =
      typeof config.venue === 'string'
        ? config.venue
        : `${config.venue?.name || 'KJSIM'}, Mumbai`;

    const icsContent = generateICS({
      title: `${config.name || 'ICON 2026'} — ${successData.eventName}`,
      description: `Registered entry pass for ${successData.eventName}. Registration ID: ${successData.qrCode}`,
      location: venue,
      startDate,
      endDate,
    });

    downloadICS(icsContent, `ICON-${successData.eventSlug || 'event'}.ics`);
  };

  const copyRegId = () => {
    if (!successData?.qrCode) return;
    navigator.clipboard.writeText(successData.qrCode);
    setCopiedRegId(true);
    toast.success('Registration ID copied!');
    setTimeout(() => setCopiedRegId(false), 2500);
  };

  const copyUpiId = (upiId) => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // ── Closed state ────────────────────────────────────────────────────────
  if (config.registrationOpen === false) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] pt-28 pb-20 px-4 flex items-center justify-center font-['Fira_Sans']">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden">
          <div className="w-full h-1.5 bg-[#B7202E] flex absolute top-0 left-0">
            <div className="w-12 h-full bg-[#ED1C24]" />
            <div className="flex-1 h-full bg-[#B7202E]" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#B7202E]/10 text-[#B7202E] flex items-center justify-center mx-auto mb-4">
            <HiOutlineTicket className="text-3xl" />
          </div>
          <h1 className="font-['Marcellus'] text-3xl text-[#231F20] mb-2 font-normal">
            Registrations Closed
          </h1>
          <p className="text-[#58595B] text-sm leading-relaxed mb-6 font-normal">
            Registrations for ICON 2026 are currently paused. Please check back later or contact the student organizing committee.
          </p>
          <Link
            href="/"
            className="font-['Fira_Sans'] btn-primary py-3 px-8 text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Event picker view (when no ?event= query param) ─────────────────────
  if (!eventParam) {
    const categories = [
      { id: 'all', label: 'All Competitions' },
      { id: 'technical', label: 'Technical' },
      { id: 'sports', label: 'Sports' },
      { id: 'gaming', label: 'Esports & Indoor' },
      { id: 'mini-games', label: 'Free Mini-Games' },
    ];

    const filteredEvents = events.filter((ev) => {
      const matchesCategory = pickerFilter === 'all' || ev.category === pickerFilter;
      const matchesSearch =
        !searchQuery ||
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="min-h-screen bg-[#FAF8F8] pt-24 sm:pt-32 pb-24 font-['Fira_Sans'] relative overflow-hidden">
        {/* Somaiya Edge Device */}
        <SomaiyaEdge
          variant="macro-top-right-down"
          dropHeight={160}
          className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Somaiya Edge Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-[#B7202E]/10 text-[#B7202E] border border-[#B7202E]/20 mb-4 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
              OFFICIAL REGISTRATION DESK // ICON 2026
            </div>
            <h1 className="font-['Marcellus'] text-4xl sm:text-5xl lg:text-6xl text-[#231F20] tracking-tight mb-4 font-normal">
              Choose Your Competition
            </h1>
            <p className="text-[#58595B] text-base sm:text-lg leading-relaxed font-normal">
              Select an event to register. Paid competitions verify via official Somaiya QR payment; Mini-Games Zone entries are complimentary.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPickerFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    pickerFilter === cat.id
                      ? 'bg-[#B7202E] text-white border-[#B7202E] shadow-xs'
                      : 'text-[#58595B] bg-[#FAF8F8] border-[#E5E7EB] hover:text-[#231F20] hover:border-[#B7202E]/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/60 text-lg pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event name..."
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-1 focus:ring-[#B7202E] text-[#231F20]"
              />
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
              <HiOutlineExclamation className="text-4xl text-[#B7202E] mx-auto mb-3" />
              <h3 className="font-['Marcellus'] text-2xl text-[#231F20] mb-2 font-normal">No matching events found</h3>
              <p className="text-sm text-[#58595B] mb-6">
                Try resetting your search query or picking another category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPickerFilter('all');
                }}
                className="font-['Fira_Sans'] btn-primary py-2 px-6 text-xs font-semibold rounded-full shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredEvents.map((ev) => {
                const fee = Number(ev.registrationFee) || 0;
                return (
                  <Link
                    key={ev.slug}
                    href={`/register?event=${ev.slug}`}
                    className="group relative bg-white border border-[#E5E7EB] hover:border-[#B7202E]/60 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Somaiya Corner Geometric Notch */}
                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 right-0 w-3 h-3 bg-[#B7202E]/10 border-b border-l border-[#B7202E]/30" />
                    </div>

                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF8F8] border border-[#E5E7EB] text-[#58595B]">
                          {CATEGORY_LABEL[ev.category] || ev.category}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                            fee === 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#B7202E]/10 text-[#B7202E] border border-[#B7202E]/20'
                          }`}
                        >
                          {feeLabel(fee)}
                        </span>
                      </div>

                      {/* Event Name */}
                      <h2 className="font-['Marcellus'] text-2xl text-[#231F20] group-hover:text-[#B7202E] transition-colors mb-2 font-normal leading-snug">
                        {ev.name}
                      </h2>

                      {/* Short Description */}
                      <p className="text-[#58595B] text-xs sm:text-sm line-clamp-2 leading-relaxed mb-6 font-normal">
                        {ev.tagline || ev.description || 'Compete with the finest minds in ICON 2026.'}
                      </p>
                    </div>

                    {/* Schedule Strip & Action */}
                    <div className="pt-4 border-t border-[#E5E7EB]">
                      <div className="flex items-center gap-3 text-xs text-[#58595B] mb-3">
                        <span className="flex items-center gap-1">
                          <HiOutlineCalendar className="text-[#B7202E]" />
                          {ev.date || 'TBA'}
                        </span>
                        {ev.time && (
                          <span className="flex items-center gap-1">
                            <HiOutlineClock className="text-[#B7202E]" />
                            {ev.time}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-[#B7202E] group-hover:translate-x-1 transition-transform">
                        <span>Register for this event</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Invalid event slug state ────────────────────────────────────────────
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-[#FAF8F8] pt-28 pb-20 px-4 flex items-center justify-center font-['Fira_Sans']">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 text-center shadow-lg">
          <HiOutlineExclamation className="text-4xl text-[#B7202E] mx-auto mb-3" />
          <h1 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] mb-2 font-normal">Event Unavailable</h1>
          <p className="text-[#58595B] text-sm mb-6 leading-relaxed font-normal">
            This competition is either not open for registration or the URL link is invalid.
          </p>
          <Link
            href="/register"
            className="font-['Fira_Sans'] btn-primary py-3 px-8 text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <HiArrowLeft /> <span>Browse Open Events</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Single-event registration view ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F8] pt-24 sm:pt-32 pb-24 font-['Fira_Sans'] relative overflow-hidden">
      {/* Somaiya Edge Device */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#58595B] hover:text-[#B7202E] transition-colors"
          >
            <HiArrowLeft className="text-base" /> <span>Change Event / View All Arenas</span>
          </Link>
        </div>

        {/* 3-Step Flow Indicator Ribbon */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <HiOutlineCheck className="w-3.5 h-3.5" />
              </span>
              <span className="hidden sm:inline">1. Select Event</span>
              <span className="sm:hidden">1. Event</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#B7202E]">
              <span className="w-5 h-5 rounded-full bg-[#B7202E] text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="hidden sm:inline">2. Participant &amp; Verification</span>
              <span className="sm:hidden">2. Form</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#58595B]/50">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F8] border border-[#E5E7EB] flex items-center justify-center text-[10px]">3</span>
              <span className="hidden sm:inline">3. Official Pass</span>
              <span className="sm:hidden">3. Pass</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Event Focus & Payment Summary (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Event Summary Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="w-full h-1.5 bg-[#FAF8F8] flex absolute top-0 left-0">
                <div className="w-16 h-full bg-[#ED1C24]" />
                <div className="flex-1 h-full bg-[#B7202E]" />
              </div>

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#B7202E]/10 text-[#B7202E] border border-[#B7202E]/20">
                  {CATEGORY_LABEL[selectedEvent.category] || selectedEvent.category}
                </span>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    payableAmount === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#B7202E]/10 text-[#B7202E] border border-[#B7202E]/20'
                  }`}
                >
                  {feeLabel(payableAmount)}
                </span>
              </div>

              <h1 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] mb-2 font-normal leading-snug">
                {selectedEvent.name}
              </h1>
              <p className="text-[#58595B] text-sm leading-relaxed mb-5 font-normal">
                {selectedEvent.tagline || selectedEvent.description || 'ICON 2026 flagship event.'}
              </p>

              {/* Schedule Strip */}
              <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB] text-xs text-[#231F20]">
                <div className="flex items-center gap-2.5">
                  <HiOutlineCalendar className="text-[#B7202E] text-base shrink-0" />
                  <span>
                    <strong>Date:</strong> {selectedEvent.date || 'TBA'}
                  </span>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center gap-2.5">
                    <HiOutlineClock className="text-[#B7202E] text-base shrink-0" />
                    <span>
                      <strong>Timing:</strong> {selectedEvent.time}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <HiOutlineLocationMarker className="text-[#B7202E] text-base shrink-0" />
                  <span>
                    <strong>Venue:</strong>{' '}
                    {selectedEvent.venue || 'KJ Somaiya Institute of Management, Vidyavihar'}
                  </span>
                </div>
                {selectedEvent.teamSize && (
                  <div className="flex items-center gap-2.5">
                    <HiOutlineUser className="text-[#B7202E] text-base shrink-0" />
                    <span>
                      <strong>Format:</strong> {selectedEvent.teamSize}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Payment QR Box (If Paid Event) */}
            {payableAmount > 0 && (
              <div className="bg-white border-2 border-[#B7202E]/30 rounded-3xl p-6 sm:p-7 shadow-sm text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 text-[#B7202E] font-bold text-xs tracking-wider uppercase mb-4">
                  <HiOutlineCreditCard className="text-base" />
                  <span>Somaiya Official UPI Gateway</span>
                </div>

                {paymentQr?.qrImageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative p-3 bg-white border-2 border-[#E5E7EB] rounded-2xl shadow-inner mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={paymentQr.qrImageUrl}
                        alt={`Somaiya Payment QR for ₹${payableAmount}`}
                        className="w-48 h-48 object-contain rounded-xl"
                      />
                      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#B7202E]" />
                      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#B7202E]" />
                      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#B7202E]" />
                      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#B7202E]" />
                    </div>

                    <p className="font-['Marcellus'] text-3xl text-[#B7202E] font-normal mb-1">
                      ₹{payableAmount}
                    </p>
                    <p className="text-xs text-[#58595B] leading-relaxed max-w-xs mb-3 font-normal">
                      Scan using Google Pay, PhonePe, Paytm, or any UPI app. Pay exactly{' '}
                      <strong>₹{payableAmount}</strong> for <strong>{selectedEvent.name}</strong>.
                    </p>

                    {paymentQr.payUrl && (
                      <a
                        href={paymentQr.payUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B7202E] hover:underline"
                      >
                        Open UPI Direct Pay Link →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 text-left">
                    <p className="font-semibold mb-1">Payment QR Notice</p>
                    <p>
                      A fee tier of ₹{payableAmount} is required. If the QR code does not load, please contact the organizers.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* How Registration Works Strip */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-xs text-[#58595B]">
              <h3 className="font-['Marcellus'] text-base text-[#231F20] mb-3 font-normal">How It Works</h3>
              <ol className="space-y-2 list-decimal list-inside leading-relaxed font-normal">
                <li>Submit your participant and institution credentials.</li>
                {payableAmount > 0 ? (
                  <>
                    <li>Scan the Somaiya UPI QR and pay the designated ₹{payableAmount} fee.</li>
                    <li>Upload your receipt screenshot and enter the 12-digit UTR ID.</li>
                    <li>Receive your verified digital QR entry pass on submission.</li>
                  </>
                ) : (
                  <>
                    <li>Free entry: Instant confirmation pass generated upon submission.</li>
                    <li>Show your QR pass on mobile during desk check-in at KJSIM.</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Registration Form (7 cols) ── */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-9 shadow-xs">
              <div className="mb-6 pb-4 border-t-0 border-b border-[#E5E7EB]">
                <h2 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] mb-1 font-normal">
                  Participant Information
                </h2>
                <p className="text-[#58595B] text-xs sm:text-sm font-normal">
                  Please provide valid details. Your venue pass and notifications will be sent to this email and contact number.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="eventSlug" value={selectedEvent.slug} />

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                    >
                      Full Name <span className="text-[#ED1C24]">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/60 text-base pointer-events-none" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Karan Sharma"
                        className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                    >
                      Email Address <span className="text-[#ED1C24]">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/60 text-base pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="karan@somaiya.edu"
                        className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile & College */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                    >
                      10-Digit Mobile <span className="text-[#ED1C24]">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/60 text-base pointer-events-none" />
                      <input
                        id="mobile"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        disabled={isSubmitting}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="college"
                      className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                    >
                      College / Institution <span className="text-[#ED1C24]">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlineAcademicCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58595B]/60 text-base pointer-events-none" />
                      <input
                        id="college"
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="KJ Somaiya Institute of Management"
                        className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                  >
                    Department / Stream <span className="text-[#58595B] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. Master of Computer Applications (MCA) / Data Science"
                    className="w-full px-4 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                  />
                </div>

                {/* ── Paid Event Verification Inputs ── */}
                {payableAmount > 0 && (
                  <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
                    <div className="bg-[#B7202E]/5 border border-[#B7202E]/20 rounded-2xl p-4">
                      <p className="text-xs font-bold text-[#B7202E] uppercase tracking-wider mb-1">
                        Fee Payment Verification: ₹{payableAmount}
                      </p>
                      <p className="text-xs text-[#58595B] leading-relaxed">
                        Scan the QR code displayed in the left column. Upload the transaction receipt and enter the 12-digit UTR number below.
                      </p>
                    </div>

                    {/* Screenshot File Upload */}
                    <div>
                      <label
                        htmlFor="paymentScreenshot"
                        className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                      >
                        Payment Screenshot / Slip <span className="text-[#ED1C24]">*</span>
                      </label>
                      <div className="relative border-2 border-dashed border-[#E5E7EB] hover:border-[#B7202E]/60 rounded-2xl p-4 text-center bg-[#FAF8F8] transition-colors">
                        <input
                          id="paymentScreenshot"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          required
                          disabled={isSubmitting}
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {paymentPreview ? (
                          <div className="flex items-center justify-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={paymentPreview}
                              alt="Payment Preview"
                              className="w-12 h-12 object-cover rounded-xl border border-[#E5E7EB]"
                            />
                            <div className="text-left text-xs">
                              <p className="font-semibold text-[#231F20] truncate max-w-[200px]">
                                {paymentFile?.name}
                              </p>
                              <p className="text-emerald-600 flex items-center gap-1 font-medium">
                                <HiOutlineCheck /> Screenshot attached (Click to change)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-2">
                            <HiOutlineUpload className="text-2xl text-[#58595B]/60 mb-1" />
                            <p className="text-xs font-bold text-[#231F20]">
                              Upload Payment Screenshot
                            </p>
                            <p className="text-[11px] text-[#58595B] mt-0.5">
                              PNG, JPG, or WEBP up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* UTR / Transaction ID */}
                    <div>
                      <label
                        htmlFor="paymentTxnId"
                        className="block text-xs font-bold uppercase tracking-wider text-[#231F20] mb-1.5"
                      >
                        UTR / Transaction Reference ID <span className="text-[#ED1C24]">*</span>
                      </label>
                      <input
                        id="paymentTxnId"
                        type="text"
                        name="paymentTxnId"
                        value={formData.paymentTxnId}
                        onChange={handleChange}
                        required={payableAmount > 0}
                        disabled={isSubmitting}
                        placeholder="e.g. 423409182390"
                        className="w-full px-4 py-3 bg-[#FAF8F8] border border-[#E5E7EB] rounded-xl text-sm font-mono uppercase tracking-wider text-[#231F20] focus:outline-none focus:bg-white focus:border-[#B7202E] focus:ring-2 focus:ring-[#B7202E]/15 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || (payableAmount > 0 && !paymentQr?.qrImageUrl)}
                    className="font-['Fira_Sans'] btn-primary w-full justify-center py-4 text-sm sm:text-base font-semibold shadow-md hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineTicket className="text-lg" />
                        <span>
                          Submit Entry — {selectedEvent.name} ({feeLabel(payableAmount)})
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#58595B] mt-3 leading-relaxed">
                    By submitting, you agree to comply with Somaiya Vidyavihar University event guidelines. Want to compete in multiple events? Simply register for each event individually.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: Duplicate Registration ── */}
      <AnimatePresence>
        {duplicateModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setDuplicateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-full h-1.5 bg-amber-500 absolute top-0 left-0" />
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                <HiOutlineExclamation />
              </div>
              <h2 className="font-['Marcellus'] text-2xl sm:text-3xl text-[#231F20] mb-2 font-normal">Already Registered</h2>
              <p className="text-[#58595B] text-sm leading-relaxed mb-6 font-normal">
                {duplicateMessage ||
                  'You have already registered for this event with this email address. Please check your inbox for the existing QR pass or pick another competition.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setDuplicateModal(false)}
                  className="font-['Fira_Sans'] flex-1 py-3 px-4 rounded-full bg-[#FAF8F8] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#231F20] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <Link
                  href="/register"
                  className="font-['Fira_Sans'] btn-primary flex-1 py-3 px-4 text-sm font-semibold rounded-full shadow-xs justify-center"
                >
                  Browse Other Events
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: Registration Success & Entry Pass ── */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              role="dialog"
              aria-labelledby="reg-success-title"
              className="bg-white border border-[#E5E7EB] rounded-3xl max-w-lg w-full p-6 sm:p-9 text-center shadow-2xl relative my-8 overflow-hidden"
            >
              {/* Somaiya Red Gradient Top Stripe */}
              <div className="w-full h-2 bg-[#B7202E] flex absolute top-0 left-0">
                <div className="w-16 h-full bg-[#ED1C24]" />
                <div className="flex-1 h-full bg-[#B7202E]" />
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-3xl">
                <HiCheckCircle />
              </div>

              <h2 id="reg-success-title" className="font-['Marcellus'] text-3xl text-[#231F20] mb-1 font-normal">
                {successData.paymentStatus === 'pending' ? 'Application Received!' : 'Access Pass Confirmed!'}
              </h2>

              <p className="text-xs font-bold uppercase tracking-wider text-[#B7202E] mb-2 font-['Fira_Sans']">
                {successData.eventName}
              </p>

              <p className="text-[#58595B] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-5 font-normal">
                {successData.paymentStatus === 'pending'
                  ? 'Your payment screenshot is under review. Your official venue pass and entry confirmation will be verified shortly.'
                  : 'Your registration is complete! Present this QR pass at the registration desk on the event day.'}
              </p>

              {/* QR Container */}
              <div
                ref={qrRef}
                className="bg-[#FAF8F8] border-2 border-dashed border-[#E5E7EB] rounded-2xl p-4 inline-block mb-3 shadow-inner"
              >
                <QRCodeSVG
                  value={successData.qrCode}
                  size={160}
                  level="M"
                  includeMargin={true}
                  className="rounded-xl bg-white p-1"
                />
              </div>

              {/* Pass ID Pill */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#B7202E] bg-[#B7202E]/10 px-3.5 py-1 rounded-full border border-[#B7202E]/20">
                  {successData.qrCode}
                </span>
                <button
                  type="button"
                  onClick={copyRegId}
                  title="Copy Registration ID"
                  className="p-1.5 rounded-lg bg-[#FAF8F8] hover:bg-[#E5E7EB] text-[#58595B] transition-colors cursor-pointer border border-[#E5E7EB]"
                >
                  {copiedRegId ? <HiCheckCircle className="text-emerald-600" /> : <HiOutlineClipboardCopy />}
                </button>
              </div>

              {successData.payableAmount > 0 && (
                <div className="text-xs text-[#58595B] mb-6 font-['Fira_Sans']">
                  Amount: <strong className="text-[#231F20]">₹{successData.payableAmount}</strong> · Status:{' '}
                  <span
                    className={`font-semibold capitalize ${
                      successData.paymentStatus === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {successData.paymentStatus}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={downloadQR}
                  className="font-['Fira_Sans'] btn-primary w-full justify-center py-3 text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <HiOutlineDownload className="text-lg" /> <span>Download QR Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="w-full py-3 px-4 rounded-full bg-[#FAF8F8] hover:bg-[#E5E7EB] text-[#231F20] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#E5E7EB] font-['Fira_Sans']"
                >
                  <HiOutlineCalendar className="text-lg text-[#B7202E]" /> <span>Add Event to Calendar</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/register"
                    className="py-2.5 px-3 rounded-full border border-[#E5E7EB] hover:border-[#B7202E] text-[#58595B] hover:text-[#B7202E] text-xs font-semibold transition-colors text-center font-['Fira_Sans']"
                  >
                    Register Another Event
                  </Link>
                  <Link
                    href="/"
                    className="py-2.5 px-3 rounded-full border border-[#E5E7EB] hover:border-[#B7202E] text-[#58595B] hover:text-[#B7202E] text-xs font-semibold transition-colors text-center font-['Fira_Sans']"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
