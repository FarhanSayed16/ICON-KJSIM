'use client';

import { motion } from 'framer-motion';

// Curated easing curves for high-end editorial motion design
const EASE_EDITORIAL = [0.16, 1, 0.3, 1]; // Fast attack, ultra-silky settling
const EASE_SPRING = { type: 'spring', stiffness: 260, damping: 22 };

const PRESETS = {
  // Standard vertical editorial lift
  'fade-up': {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
  },
  // Downward slide for top badges or kickers
  'fade-down': {
    hidden: { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  // Editorial slide-in from left (perfect for display headlines, descriptions, maps)
  'slide-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  // Editorial slide-in from right (perfect for cards, forms, stats)
  'slide-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  // Card scale-up with depth perspective
  'scale-up': {
    hidden: { opacity: 0, scale: 0.94, y: 22 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  // Tactile card lift
  'card': {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  // Snappy spring pop (badges, numbers, icons, sponsor logos)
  'pop': {
    hidden: { opacity: 0, scale: 0.86, y: 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: EASE_SPRING,
    },
  },
  // Wide banner reveal with expansive presence
  'banner': {
    hidden: { opacity: 0, scale: 0.98, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

export default function ScrollReveal({
  children,
  className = '',
  style = {},
  variant = 'fade-up',
  variants = null,
  delay = 0,
  duration = 0.65,
  ease = EASE_EDITORIAL,
  once = true,
  amount = 0.18,
  ...props
}) {
  const basePreset = variants || PRESETS[variant] || PRESETS['fade-up'];

  const customVariants = {
    hidden: basePreset.hidden,
    visible: {
      ...basePreset.visible,
      transition: {
        duration,
        ease,
        ...basePreset.visible?.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
