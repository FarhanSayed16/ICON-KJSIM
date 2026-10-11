'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          if (typeof window !== 'undefined' && !window.location.hash) {
            window.scrollTo(0, 0);
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
