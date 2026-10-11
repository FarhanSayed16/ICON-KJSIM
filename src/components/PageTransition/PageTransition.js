'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Soft fade on client-side navigation only. The first (SSR) paint is rendered
 * fully visible — never opacity:0 — so a slow/failed JS load can't blank the page.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={hasMounted.current ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
