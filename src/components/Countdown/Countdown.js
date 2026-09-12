'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './Countdown.module.css';

export default function Countdown({ targetDate }) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!mounted) {
    return (
      <div className={styles.countdown}>
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div key={label} className={styles.block}>
            <span className={styles.number}>00</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (isLive) {
    return (
      <div className={styles.liveContainer}>
        <div className={styles.livePulse} />
        <span className={styles.liveText}>EVENT IS LIVE</span>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className={styles.countdown} aria-label="Countdown to ICON 2026">
      {blocks.map((block) => (
        <div key={block.label} className={styles.block}>
          <span className={styles.number}>
            {String(block.value).padStart(2, '0')}
          </span>
          <span className={styles.label}>{block.label}</span>
        </div>
      ))}
    </div>
  );
}
