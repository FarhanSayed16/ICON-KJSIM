'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

/**
 * First-visit splash only. Must default to hidden on SSR — otherwise a failed
 * JS chunk leaves the overlay stuck forever (blank / unstyled page).
 */
export default function LoadingScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setIsLoading(false);
      return undefined;
    }

    let hasVisited = false;
    try {
      hasVisited = !!sessionStorage.getItem('icon_has_visited');
    } catch {
      hasVisited = true; // can't track — skip splash
    }

    if (hasVisited) {
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    try {
      sessionStorage.setItem('icon_has_visited', 'true');
    } catch {
      /* ignore */
    }

    const timer = setTimeout(() => setIsLoading(false), 1800);
    // Failsafe: never leave the splash up if something goes wrong
    const failsafe = setTimeout(() => setIsLoading(false), 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [isAdmin]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          aria-busy="true"
          aria-label="Loading ICON 2026"
        >
          <div className={styles.loaderContent}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Image
                src="/images/icon_logo.png"
                alt="ICON 2026"
                width={120}
                height={100}
                className={styles.logo}
                priority
                loading="eager"
              />
            </motion.div>

            <motion.div
              className={styles.progressContainer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <motion.div
                className={styles.progressBar}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.p
              className={styles.loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              INITIALIZING DATATRON...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
