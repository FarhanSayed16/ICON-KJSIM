'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { NAV_LINKS } from '@/lib/data';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add background after 50px scroll
      setScrolled(currentScrollY > 50);

      // Hide on scroll down, show on scroll up (only after 300px)
      if (currentScrollY > 300) {
        setHidden(currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
    >
      <nav className={styles.nav} aria-label="Main navigation">
        {/* Somaiya Logo */}
        <Link href="/" className={styles.logoLeft} aria-label="Home">
          <Image
            src="/images/kjsim_logo.jpg"
            alt="KJ Somaiya Institute of Management"
            width={180}
            height={50}
            priority
            className={styles.somaiyaLogo}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks} role="menubar">
          {NAV_LINKS.map((link) => (
            <li key={link.href} role="none">
              <Link
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + ICON Logo */}
        <div className={styles.navRight}>
          <Link href="/register" className={styles.registerBtn}>
            Register
          </Link>
          <Link href="/" aria-label="ICON 2026">
            <Image
              src="/images/icon_logo.png"
              alt="ICON 2026"
              width={60}
              height={50}
              className={styles.iconLogo}
            />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={styles.drawerContent}>
          <ul className={styles.drawerLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.drawerLink} ${isActive(link.href) ? styles.drawerActive : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className={styles.drawerRegister}
            onClick={() => setIsOpen(false)}
          >
            Register Now
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
