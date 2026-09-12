'use client';

import { motion } from 'framer-motion';

const defaultVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ScrollReveal({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
  once = true,
  amount = 0.2,
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
