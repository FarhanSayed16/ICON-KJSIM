'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function BorderlandCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef(null);

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isFlipped) {
      setIsFlipped(false);
    } else {
      setIsFlipped(true);
      // Auto-flip back after 5 seconds
      timerRef.current = setTimeout(() => {
        setIsFlipped(false);
      }, 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="borderland-persp">
      <div className="borderland-tilt">
        <div
          className="borderland-spin"
          style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
          role="button"
          tabIndex={0}
          aria-label="Click to flip the Joker card to view Somaiya CodeICON back face (auto-resets after 5 seconds)"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {/* 3D Paperboard solid thickness edges */}
          <div className="borderland-edge borderland-eL" />
          <div className="borderland-edge borderland-eR" />
          <div className="borderland-edge borderland-eT" />
          <div className="borderland-edge borderland-eB" />

          {/* FRONT FACE: Alice in Borderland Joker Card */}
          <div className="borderland-face borderland-front">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/joker-card.webp"
              alt="Borderland Joker Card"
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
            <div className="borderland-grain" />
            <div className="borderland-sheen" />
          </div>

          {/* BACK FACE: Full-Card Somaiya Theme + CodeICON */}
          <div className="borderland-face borderland-back">
            {/* ── TOP SECTION: Somaiya Logo on Top ── */}
            <div className="w-full flex flex-col items-center justify-center pt-[calc(var(--u)*3.2)] px-3 pointer-events-none">
              <div className="bg-white rounded-lg px-3.5 py-1.5 shadow-md flex items-center justify-center border border-white">
                <Image
                  src="/images/kjsim_logo.jpg"
                  alt="Somaiya KJSIM Logo"
                  width={110}
                  height={44}
                  className="h-[calc(var(--u)*3.8)] w-auto object-contain"
                />
              </div>
              <span className="font-['Fira_Sans'] text-[calc(var(--u)*1.05)] tracking-[0.22em] text-[#ED1C24] font-bold uppercase mt-1.5">
                SOMAIYA VIDYAVIHAR UNIVERSITY
              </span>
            </div>

            {/* ── CENTER SECTION: CodeICON Prominent Display ── */}
            <div className="my-auto w-full text-center px-4 pointer-events-none">
              {/* Somaiya geometric flame insignia */}
              <div className="flex items-center justify-center gap-2 mb-[calc(var(--u)*1.2)]">
                <span className="w-[calc(var(--u)*3)] h-[1px] bg-[#ED1C24]/70" />
                <span className="text-[#ED1C24] text-[calc(var(--u)*1.6)] leading-none">♦</span>
                <span className="w-[calc(var(--u)*3)] h-[1px] bg-[#ED1C24]/70" />
              </div>

              {/* Title */}
              <div
                className="font-['Marcellus'] text-white uppercase"
                style={{
                  fontSize: 'calc(var(--u) * 4.6)',
                  letterSpacing: '0.12em',
                  lineHeight: 1.05,
                  textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                }}
              >
                Code<span className="text-[#ED1C24]">ICON</span>
              </div>

              {/* Sub-label: 12-Hour Flagship */}
              <div
                className="font-['Fira_Sans'] font-light text-white/85 uppercase"
                style={{
                  fontSize: 'calc(var(--u) * 1.8)',
                  marginTop: 'calc(var(--u) * 0.8)',
                  letterSpacing: '0.32em',
                }}
              >
                ICON 2026
              </div>

              {/* Four Suits */}
              <div className="flex items-center justify-center gap-3 mt-[calc(var(--u)*1.6)] text-[calc(var(--u)*1.8)]">
                <span className="text-white/80">♠</span>
                <span className="text-[#ED1C24]">♥</span>
                <span className="text-[#ED1C24]">♦</span>
                <span className="text-white/80">♣</span>
              </div>
            </div>

            {/* ── BOTTOM SECTION: KJSIM 12-Hour Arena ── */}
            <div className="w-full pb-[calc(var(--u)*3)] text-center px-4 pointer-events-none">
              <span className="font-['Fira_Sans'] text-[calc(var(--u)*1.1)] tracking-widest text-white/60 uppercase">
                12-HOUR ARENA · KJSIM
              </span>
            </div>

            <div className="borderland-grain" />
            <div className="borderland-sheen" />
          </div>
        </div>
      </div>
    </div>
  );
}
