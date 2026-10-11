'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';
import BorderlandCard from './BorderlandCard';
import './BorderlandHero.css';

// Skyline silhouette inspired by Tokyo & Somaiya Vidyavihar campus architecture
function Skyline() {
  const heights = [40, 70, 52, 90, 60, 110, 48, 80, 64, 100, 56, 76, 44, 92, 66, 84];
  return (
    <svg
      className="borderland-sky"
      viewBox="0 0 1600 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 100 + 6}
          y={120 - h}
          width={88}
          height={h}
          fill="#58595B"
          opacity={0.28 + (i % 3) * 0.08}
        />
      ))}
    </svg>
  );
}

// Live ticking VISA survival countdown timer
function useVisaCountdown() {
  const [timeLeft, setTimeLeft] = useState('14:08:42:15');

  useEffect(() => {
    const baseTarget = new Date('2026-12-01T09:00:00+05:30').getTime();
    const target = baseTarget > Date.now()
      ? baseTarget
      : Date.now() + 14 * 86400 * 1000 + 8 * 3600 * 1000;

    const pad = (n) => String(n).padStart(2, '0');

    const update = () => {
      const now = Date.now();
      const s = Math.max(0, Math.floor((target - now) / 1000));
      const days = pad(Math.floor(s / 86400));
      const hours = pad(Math.floor((s % 86400) / 3600));
      const mins = pad(Math.floor((s % 3600) / 60));
      const secs = pad(s % 60);
      setTimeLeft(`${days}:${hours}:${mins}:${secs}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const SUITS = [
  ['♠', '4%', '8%', -30],
  ['♥', '82%', '12%', 40],
  ['♦', '8%', '58%', 50],
  ['♣', '76%', '56%', -40],
];

export default function BorderlandHero({ status = 'open', eventSlug = 'code-icon' }) {
  const sceneRef = useRef(null);
  const countdown = useVisaCountdown();

  const isClosed = status === 'closed';
  const isPaused = status === 'paused';
  const isSoon = status === 'starting_soon';
  const isDisabled = isClosed || isPaused || isSoon;

  // Smooth lerp mouse tracking for 3D card tilt & sheen physics
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let animId;

    const handlePointerMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const loop = () => {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      el.style.setProperty('--mx', current.x.toFixed(3));
      el.style.setProperty('--my', current.y.toFixed(3));
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      className="borderland-scene"
      aria-label="CodeICON Borderland Arena Hero"
    >
      {/* ── Searchlight Beams ── */}
      <div className="borderland-rays" aria-hidden="true">
        <div className="borderland-beam borderland-b1" />
        <div className="borderland-beam borderland-b2" />
        <div className="borderland-beam borderland-b3" />
      </div>

      {/* ── Parallax Floating Card Suits (♠ ♥ ♦ ♣) ── */}
      {SUITS.map(([s, l, tp, k], i) => (
        <div
          key={i}
          className="borderland-suit"
          style={{ left: l, top: tp, '--k': k }}
          aria-hidden="true"
        >
          {s}
        </div>
      ))}

      {/* ── Skyline Silhouette at Base ── */}
      <Skyline />

      {/* ── 2-Column Hero: Left Text Center & Right Card Center ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 sm:py-24 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[72vh]">

          {/* ── LEFT SECTION (Vertically Centered Text) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Kicker Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md mb-6 w-fit">
              <span className="borderland-dot" />
              <span className="font-['Fira_Sans'] text-xs font-bold tracking-[0.25em] uppercase text-white/90">
                STAGE 01 // WELCOME TO THE BORDERLAND
              </span>
            </div>

            {/* Display Title */}
            <h1 className="font-['Marcellus'] text-5xl sm:text-7xl lg:text-8xl leading-none text-white font-normal mb-3">
              Code<span className="text-[#ED1C24]">ICON</span>
            </h1>

            {/* Sub-Tagline: 12 Hours */}
            <p className="font-['Marcellus'] text-xl sm:text-2xl text-white/85 tracking-wide mb-4">
              12 Hours. One Stage. Infinite Survival.
            </p>

            {/* Mission Description */}
            <p className="font-['Fira_Sans'] text-base sm:text-lg text-white/70 max-w-xl mb-6 leading-relaxed font-normal">
              Enter the flagship 12-hour arena at Somaiya Vidyavihar campus. Choose your domain, assemble your crew, and code through the sprint before your VISA expires. Compete for ₹50,000+ in rewards, mentorship from industry leaders, and institutional glory.
            </p>

            {/* VISA Survival Countdown Bar */}
            <div className="mb-7 inline-flex items-center gap-3 border border-white/40 px-4 py-2 font-medium tracking-widest bg-black/40 backdrop-blur-md rounded-lg w-fit">
              <span className="borderland-dot" />
              <span className="text-xs font-bold tracking-widest text-[#ED1C24] uppercase">VISA</span>
              <span className="text-white/30">|</span>
              <span className="tabular-nums font-mono text-white text-base sm:text-lg tracking-wider font-semibold">
                {countdown}
              </span>
              <span className="text-[11px] font-['Fira_Sans'] text-white/50 tracking-normal hidden sm:inline">
                (D : H : M : S)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {isDisabled ? (
                <button
                  type="button"
                  disabled
                  className="py-3.5 px-9 rounded-full font-medium text-white bg-neutral-700 cursor-not-allowed opacity-90 font-['Fira_Sans'] text-base"
                >
                  {isClosed ? 'Arena Closed' : isPaused ? 'Arena Paused' : 'Starting Soon'}
                </button>
              ) : (
                <Link
                  href={`/register?event=${eventSlug}`}
                  className="borderland-cta inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white shadow-lg text-base font-['Fira_Sans'] group cursor-pointer"
                >
                  <span>Enter the game</span>
                  <HiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white/90 border border-white/30 hover:border-white hover:bg-white/10 text-base font-['Fira_Sans'] backdrop-blur-xs transition-colors cursor-pointer"
              >
                <span>Choose your game</span>
              </a>
            </div>

            {/* Quick Metrics (12h Sprint Limit) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-xl">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#ED1C24] block">₹50K+</span>
                <span className="font-['Fira_Sans'] text-[11px] font-semibold text-white/60 uppercase tracking-wider block mt-0.5">Prize Pool</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-white block">12h</span>
                <span className="font-['Fira_Sans'] text-[11px] font-semibold text-white/60 uppercase tracking-wider block mt-0.5">Sprint Limit</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-[#ED1C24] block">30+</span>
                <span className="font-['Fira_Sans'] text-[11px] font-semibold text-white/60 uppercase tracking-wider block mt-0.5">Top Squads</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="font-['Marcellus'] text-2xl sm:text-3xl text-white block">1,000+</span>
                <span className="font-['Fira_Sans'] text-[11px] font-semibold text-white/60 uppercase tracking-wider block mt-0.5">Attendees</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT SECTION (Vertically Centered 3D Card) ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="borderland-stage">
              <div className="borderland-float">
                <BorderlandCard />
              </div>
              <div className="borderland-shadow" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
