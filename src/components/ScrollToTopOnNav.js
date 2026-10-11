'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTopOnNav
 * Ensures that whenever a route or page changes, the window automatically
 * scrolls smoothly to the very top (top: 0, left: 0), preventing the browser
 * from staying at the bottom or previous scroll position.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();

  // Configure manual scroll restoration to prevent browser from staying down on reload/nav
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Whenever the pathname changes, automatically reset scroll to the top
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If an anchor hash (like #tracks or #domains) is specified, let the anchor handle it
    if (window.location.hash) return;

    // Immediate instant reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Double-check on next animation frame after DOM mount & layout shifts
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
