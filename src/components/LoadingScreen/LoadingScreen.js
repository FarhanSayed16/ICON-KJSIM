'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function LoadingScreen() {
  const pathname = usePathname();
  // Only run the intro loader on the home / root page
  const isHomePage = pathname === '/';
  const [isLoading, setIsLoading] = useState(() => isHomePage);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isHomePage) return;

    // Lock body scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Smooth simulated progress from 0% to 100% over ~1.1 seconds
    const startTime = Date.now();
    const duration = 1100;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = originalOverflow;
        }, 150);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [isHomePage]);

  if (!isHomePage) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-6 select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
          aria-busy="true"
          aria-label="Loading ICON 2026 DATATRON"
        >
          <div className="flex flex-col items-center gap-6 max-w-xs w-full text-center">
            {/* ICON Brand Logo */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-28 h-24"
            >
              <Image
                src="/images/icon_logo.png"
                alt="ICON 2026"
                fill
                sizes="120px"
                className="object-contain drop-shadow-[0_4px_16px_rgba(183,32,46,0.25)]"
                priority
              />
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="font-['Marcellus'] text-2xl sm:text-3xl font-normal tracking-wide text-[#231F20]">
                DATATRON
              </span>
              <span className="font-['Fira_Sans'] text-xs font-bold tracking-[0.2em] uppercase text-[#B7202E]">
                ICON 2026 • KJSIM
              </span>
            </motion.div>

            {/* Progress Container */}
            <div className="w-56 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#B7202E] to-[#ED1C24] rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(237,28,36,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status & Live Percentage */}
            <div className="flex justify-between items-center w-56 text-[0.72rem] font-['Fira_Sans'] font-semibold text-[#58595B] tracking-wider uppercase">
              <span>INITIALIZING</span>
              <span className="text-[#B7202E] font-bold">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
