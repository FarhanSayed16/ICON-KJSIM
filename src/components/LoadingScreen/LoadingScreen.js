'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if it's the first visit in this session
    const hasVisited = sessionStorage.getItem('icon_has_visited');
    
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    // Set visited flag and hide loader after 2.5s
    sessionStorage.setItem('icon_has_visited', 'true');
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          aria-busy="true"
          aria-label="Loading ICON 2026"
        >
          <div className={styles.loaderContent}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
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
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className={styles.progressBar}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </motion.div>
            
            <motion.p 
              className={styles.loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              INITIALIZING DATATRON...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
