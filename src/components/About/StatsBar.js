'use client';

import { useRef, useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineCalendar, HiOutlineAcademicCap } from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import { SITE_CONFIG } from '@/lib/data';
import styles from './About.module.css';

const statsData = [
  { icon: <HiOutlineUsers size={28} />, value: SITE_CONFIG.stats.participants, label: 'Participants', suffix: '+' },
  { icon: <HiOutlineCalendar size={28} />, value: SITE_CONFIG.stats.events, label: 'Events', suffix: '+' },
  { icon: <HiOutlineTrophy size={28} />, value: SITE_CONFIG.stats.prizePool, label: 'Prize Pool', prefix: '₹', suffix: '+' },
  { icon: <HiOutlineAcademicCap size={28} />, value: SITE_CONFIG.stats.colleges, label: 'Colleges', suffix: '+' },
];

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const displayValue = value >= 1000
    ? `${prefix}${(count / 1000).toFixed(count >= value ? 0 : 0)}K${suffix}`
    : `${prefix}${count.toLocaleString()}${suffix}`;

  return <span ref={ref} className={styles.statNumber}>{displayValue}</span>;
}

export default function StatsBar() {
  return (
    <section className={styles.statsSection}>
      <div className={`container ${styles.statsGrid}`}>
        {statsData.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
