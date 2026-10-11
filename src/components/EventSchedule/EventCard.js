'use client';

import Image from 'next/image';
import { HiOutlineLocationMarker, HiArrowRight } from 'react-icons/hi';

function categoryLabel(category) {
  if (category === 'non-technical') return 'Non-Tech';
  if (category === 'technical') return 'Tech';
  return 'Gaming';
}

export default function EventCard({ event, onClick }) {
  return (
    <button
      className="group relative flex flex-col text-left bg-[#231F20] border border-[#E5E7EB] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:border-[#B7202E]/60 transition-all duration-300 p-0 w-full text-inherit shadow-md aspect-[3/4.2]"
      onClick={onClick}
      aria-label={`View details for ${event.name}`}
    >
      {/* Full Poster Image covering 100% of the card */}
      <div className="absolute inset-0 w-full h-full bg-[#231F20] overflow-hidden">
        {event.posterImage ? (
          <Image
            src={event.posterImage}
            alt={`${event.name} poster`}
            fill
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#231F20] text-white/50 font-['Fira_Sans'] text-sm">
            {event.name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/95 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Floating Top Badges */}
      <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between w-full pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 text-[0.68rem] font-bold uppercase rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white shadow-xs font-['Fira_Sans'] tracking-wider">
            {categoryLabel(event.category)}
          </span>
          {event.registrationStatus === 'closed' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-[#B7202E] text-white shadow-xs font-['Fira_Sans'] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Closed
            </span>
          ) : event.registrationStatus === 'paused' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-orange-600 text-white shadow-xs font-['Fira_Sans'] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Paused
            </span>
          ) : event.registrationStatus === 'starting_soon' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-amber-500 text-black shadow-xs font-['Fira_Sans'] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
              Soon
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase rounded-full bg-emerald-600/90 text-white shadow-xs font-['Fira_Sans'] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
              Open
            </span>
          )}
        </div>
        {event.prizePool > 0 && (
          <span className="px-2.5 py-1 text-[0.68rem] font-bold uppercase rounded-full bg-[#B7202E] text-white shadow-xs font-['Fira_Sans'] tracking-wider">
            Pool: ₹{event.prizePool.toLocaleString()}
          </span>
        )}
      </div>

      {/* Smart Bottom CTA Overlay */}
      <div className="relative z-10 mt-auto p-4 sm:p-5 pt-10 flex flex-col gap-2">
        <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-normal text-white m-0 leading-snug group-hover:text-[#ED1C24] transition-colors drop-shadow-sm">
          {event.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-white/80 font-['Fira_Sans']">
          <HiOutlineLocationMarker size={13} className="text-[#ED1C24] shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/15">
          <span className="font-['Fira_Sans'] text-xs font-semibold text-white/70">
            {event.date}
          </span>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-['Fira_Sans'] text-xs font-bold tracking-wide shadow-xs transition-all duration-200 group-hover:scale-105 ${
              event.registrationStatus === 'closed'
                ? 'bg-neutral-700'
                : event.registrationStatus === 'paused'
                ? 'bg-orange-600'
                : event.registrationStatus === 'starting_soon'
                ? 'bg-amber-600'
                : 'bg-[#B7202E] group-hover:bg-[#ED1C24]'
            }`}
          >
            <span>
              {event.registrationStatus === 'closed'
                ? 'Closed'
                : event.registrationStatus === 'paused'
                ? 'Paused'
                : event.registrationStatus === 'starting_soon'
                ? 'Soon'
                : 'View Details'}
            </span>
            <HiArrowRight size={12} />
          </div>
        </div>
      </div>
    </button>
  );
}
