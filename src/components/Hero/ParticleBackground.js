'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './Hero.module.css';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: null, y: null });
  const animationId = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const initParticles = useCallback((canvas) => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 40 : 80;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    particles.current = arr;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: null, y: null };
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);

    const maxDist = 150;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particles.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Mouse interaction
        if (mouse.current.x !== null) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 50, 50, ${p.opacity * 1.2})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(120, 120, 120, ${opacity * 1.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, initParticles]);

  if (reducedMotion) {
    return <div className={styles.staticBg} />;
  }

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
