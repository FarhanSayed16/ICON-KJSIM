'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Somaiya "The Edge" Graphic Device
 * Implements the official visual representation of Somaiya Vidyavihar University.
 * Built with Framer Motion and Tailwind CSS.
 *
 * Variants:
 *  - 'macro-top-right-down': The Big Edge banner! Thick band sliding left->right with Vitality Red leading block, then right pillar dropping top->down.
 *  - 'macro-bottom-right': Big Edge at bottom! Right pillar rising upwards, then bottom band sweeping right->left with Vitality Red on the far left.
 *  - 'macro-left-down-right': Left pillar drops down, then band sweeps across.
 *  - 'top-right-down': Horizontal bar slides left -> right, then vertical bar slides top -> down.
 *  - 'left-down-right': Vertical bar slides top -> down, then horizontal bar slides left -> right.
 *  - 'bottom-stepped': Horizontal bottom bar slides left -> right, then stepped corner notch reveals.
 */
export default function SomaiyaEdge({
  variant = 'top-right-down',
  thickness = 4,
  dropHeight = null,
  className = '',
  triggerKey = null,
  accentCap = true,
  children,
}) {
  const containerRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Instantly trigger animation for elements in the initial viewport
    requestAnimationFrame(() => setAnimating(true));

    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimating(true);
        }
      },
      { threshold: 0, rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (triggerKey !== null && animating) {
      let timer;
      const raf = requestAnimationFrame(() => {
        setAnimating(false);
        timer = setTimeout(() => {
          setAnimating(true);
        }, 40);
      });
      return () => {
        cancelAnimationFrame(raf);
        if (timer) clearTimeout(timer);
      };
    }
  }, [triggerKey, animating]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        variant === 'macro-bottom-right'
          ? '!absolute !bottom-0 !left-0 !right-0 !w-full !h-[clamp(40px,5vw,64px)] !pointer-events-none !z-[5]'
          : ''
      } ${className}`}
      style={{ '--edge-thickness': `${thickness}px` }}
    >
      {/* ── Macro / Big Edge: Top-Right-Down (Official Somaiya Banner Edge above About) ── */}
      {variant === 'macro-top-right-down' && (
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-[12] overflow-visible" aria-hidden="true">
          {/* Segment 1: Thick Horizontal Band sliding Left -> Right with Vitality Red leading block */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={animating ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, transformOrigin: 'left center' }}
            className="flex w-full h-[clamp(40px,5vw,64px)] absolute top-0 left-0"
          >
            <span className="w-[clamp(70px,10vw,130px)] h-full bg-[#ED1C24] shrink-0" />
            <span className="flex-1 h-full bg-[#B7202E]" />
          </motion.div>

          {/* Segment 2: Thick Right Drop Pillar sliding Top -> Down with Rubber Bounce */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={animating ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              originY: 0,
              transformOrigin: 'center top',
              height: typeof dropHeight === 'number' ? `${dropHeight}px` : dropHeight || '220px',
            }}
            className="absolute top-0 right-0 w-[clamp(40px,5vw,64px)] bg-[#B7202E]"
          />
        </div>
      )}

      {/* ── Macro / Big Edge: Bottom-Right (Framing below Contact Form) ── */}
      {variant === 'macro-bottom-right' && (
        <div className="absolute left-0 right-0 bottom-0 h-[clamp(40px,5vw,64px)] pointer-events-none z-[5] overflow-visible" aria-hidden="true">
          {/* Segment 1: Right Vertical Pillar rising Bottom -> Up with Rubber Bounce */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={animating ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              originY: 1,
              transformOrigin: 'center bottom',
              height: typeof dropHeight === 'number' ? `${dropHeight}px` : dropHeight || '180px',
            }}
            className="absolute bottom-0 right-0 w-[clamp(40px,5vw,64px)] bg-[#B7202E] z-10"
          />

          {/* Segment 2: Thick Bottom Horizontal Band sweeping Right -> Left with Vitality Red on the left */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={animating ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 1, transformOrigin: 'right center' }}
            className="absolute bottom-0 left-0 right-0 h-[clamp(40px,5vw,64px)] flex z-[5]"
          >
            <span className="w-[clamp(70px,10vw,130px)] h-full bg-[#ED1C24] shrink-0" />
            <span className="flex-1 h-full bg-[#B7202E]" />
          </motion.div>
        </div>
      )}

      {/* ── Top-Right-Down Variant ── */}
      {variant === 'top-right-down' && (
        <div className="absolute inset-0 pointer-events-none z-[15]" aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={animating ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, transformOrigin: 'left center' }}
            className="absolute top-0 left-0 right-0 bg-[#B7202E] h-[var(--edge-thickness,4px)]"
          >
            {accentCap && (
              <span className="absolute left-0 top-0 w-[calc(var(--edge-thickness,4px)*2.5)] h-full bg-[#ED1C24]" />
            )}
          </motion.div>

          <motion.div
            initial={{ scaleY: 0 }}
            animate={animating ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0, transformOrigin: 'center top' }}
            className="absolute top-0 right-0 bottom-0 bg-[#B7202E] w-[var(--edge-thickness,4px)]"
          >
            {accentCap && (
              <span className="absolute left-0 bottom-0 w-full h-[calc(var(--edge-thickness,4px)*2.5)] bg-[#ED1C24]" />
            )}
          </motion.div>
        </div>
      )}

      {/* ── Left-Down-Right Variant ── */}
      {variant === 'left-down-right' && (
        <div className="absolute inset-0 pointer-events-none z-[15]" aria-hidden="true">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={animating ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0, transformOrigin: 'center top' }}
            className="absolute top-0 left-0 bottom-0 bg-[#B7202E] w-[var(--edge-thickness,4px)]"
          >
            {accentCap && (
              <span className="absolute left-0 top-0 w-full h-[calc(var(--edge-thickness,4px)*2.5)] bg-[#ED1C24]" />
            )}
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={animating ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, transformOrigin: 'left center' }}
            className="absolute bottom-0 left-0 right-0 bg-[#B7202E] h-[var(--edge-thickness,4px)]"
          >
            {accentCap && (
              <span className="absolute right-0 top-0 w-[calc(var(--edge-thickness,4px)*2.5)] h-full bg-[#ED1C24]" />
            )}
          </motion.div>
        </div>
      )}

      {/* ── Bottom-Stepped Variant ── */}
      {variant === 'bottom-stepped' && (
        <div className="absolute inset-0 pointer-events-none z-[15]" aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={animating ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, transformOrigin: 'left center' }}
            className="absolute bottom-0 left-0 right-0 bg-[#B7202E] h-[var(--edge-thickness,4px)]"
          >
            {accentCap && (
              <span className="absolute left-0 top-0 w-[calc(var(--edge-thickness,4px)*2.5)] h-full bg-[#ED1C24]" />
            )}
          </motion.div>

          <motion.div
            initial={{ scaleY: 0 }}
            animate={animating ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.35, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ originY: 1, transformOrigin: 'center bottom' }}
            className="absolute right-0 bottom-0 w-[calc(var(--edge-thickness,4px)*3)] h-[calc(var(--edge-thickness,4px)*3.5)] bg-[#B7202E]"
          />
        </div>
      )}

      {/* Optional Wrapped Content */}
      {children}
    </div>
  );
}
