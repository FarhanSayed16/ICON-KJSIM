'use client';

import { useState } from 'react';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import SomaiyaEdge from '@/components/SomaiyaEdge/SomaiyaEdge';

export default function LiveClient({ initialData }) {
  const [liveData] = useState(
    initialData || {
      isLive: false,
      youtubeVideoId: null,
      currentEvent: null,
      schedule: [],
    }
  );

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-32 bg-[#FAF8F8] min-h-screen relative overflow-hidden">
      {/* ── Signature Somaiya Edge Graphic Device ── */}
      <SomaiyaEdge
        variant="macro-top-right-down"
        dropHeight={160}
        className="absolute top-0 left-0 right-0 h-[44px] sm:h-[56px] z-10"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-[#ED1C24] shrink-0" />
              <span className="font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-widest uppercase text-[#B7202E]">
                OFFICIAL COVERAGE
              </span>
            </div>
            <h1 className="font-['Marcellus'] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#231F20] mb-2 leading-tight">
              Live Stage &amp; Broadcast
            </h1>
            <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] max-w-2xl leading-relaxed m-0">
              Watch keynote sessions, hackathon pitch finals, and competition arenas broadcast live from KJSIM.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-['Fira_Sans'] text-xs sm:text-sm font-bold tracking-wider self-start sm:self-auto shadow-xs shrink-0 ${
              liveData.isLive
                ? 'bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/30'
                : 'bg-[#58595B]/10 text-[#58595B] border border-[#58595B]/20'
            }`}
          >
            {liveData.isLive ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24] animate-ping" />
                <span>LIVE NOW</span>
              </>
            ) : (
              <>
                <HiOutlineStatusOnline size={18} />
                <span>OFFLINE</span>
              </>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Video Player */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-[#E5E7EB] bg-[#231F20] relative">
              {liveData.isLive && liveData.youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${liveData.youtubeVideoId}?autoplay=1&mute=1`}
                  title="ICON 2026 Live Stream"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 p-6 text-center bg-gradient-to-b from-[#231F20] to-[#1a1718]">
                  <HiOutlineStatusOnline size={54} className="mb-4 text-[#ED1C24]/60" />
                  <h3 className="font-['Marcellus'] text-xl sm:text-2xl text-white font-normal mb-2">
                    The Stream is Currently Offline
                  </h3>
                  <p className="font-['Fira_Sans'] text-sm text-white/60 max-w-sm">
                    Live broadcasts will begin on February 13, 2026. Check the timeline and event schedule for upcoming sessions.
                  </p>
                </div>
              )}
            </div>

            {liveData.isLive && liveData.currentEvent && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E5E7EB] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
                  <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
                </div>
                <span className="font-['Fira_Sans'] text-xs font-bold uppercase tracking-wider text-[#B7202E] mb-1 block">
                  Current Session
                </span>
                <h2 className="font-['Marcellus'] text-2xl font-normal text-[#231F20] mb-2">
                  {liveData.currentEvent.title}
                </h2>
                <p className="font-['Fira_Sans'] text-sm sm:text-base text-[#58595B] leading-relaxed">
                  {liveData.currentEvent.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Schedule */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E5E7EB] shadow-sm h-fit relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-2 bg-[#ED1C24]" />
              <div className="absolute top-0 right-0 w-2 h-8 bg-[#B7202E]" />
            </div>
            <h3 className="font-['Marcellus'] text-xl font-normal text-[#231F20] mb-4 pb-3 border-b border-[#E5E7EB]">
              Today&apos;s Broadcast Schedule
            </h3>
            <div className="flex flex-col gap-3">
              {liveData.schedule.map((item) => {
                const isItemLive = item.status === 'live';
                const isItemPast = item.status === 'past';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isItemLive
                        ? 'border-[#ED1C24] bg-[#ED1C24]/5 shadow-xs'
                        : isItemPast
                        ? 'border-[#E5E7EB] bg-[#FAF8F8] opacity-60'
                        : 'border-[#E5E7EB] bg-[#FAF8F8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-['Fira_Sans'] text-xs font-bold uppercase text-[#B7202E]">
                        {item.time}
                      </span>
                      {isItemLive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ED1C24] text-white font-['Fira_Sans'] text-[0.65rem] font-bold">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="font-['Marcellus'] text-base text-[#231F20] font-normal leading-snug">
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
