import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import { SITE_CONFIG } from '@/lib/data';
import styles from './Footer.module.css';

export default function Footer() {
  const { contacts, email, socials } = SITE_CONFIG;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Column 1: ICON Info */}
        <div className={styles.col}>
          <Image
            src="/images/icon_logo.png"
            alt="ICON 2026"
            width={100}
            height={80}
            className={styles.footerLogo}
          />
          <p className={styles.about}>
            ICON is the official techfest of Department of Data Science and
            Technology. It has always been our primary motive to encourage
            scientific thinking, innovation, creativity and some good
            old-fashioned fun.
          </p>
        </div>

        {/* Column 2: Useful Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Useful Links</h4>
          <div className={styles.divider} />
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#about">About Us</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/sponsors">Sponsors</Link></li>
            <li><Link href="/hackathon">Hackathon</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/team">Team</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contact Us</h4>
          <div className={styles.divider} />
          <address className={styles.address}>
            <p>K J Somaiya Institute of Management,</p>
            <p>Somaiya Vidyavihar University,</p>
            <p>Vidyavihar East</p>
            <p>Mumbai-400077.</p>
          </address>
          <div className={styles.contactLinks}>
            {contacts.map((c) => (
              <a key={c.phone} href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} className={styles.contactItem}>
                <HiPhone size={14} />
                <span>{c.name} | {c.phone}</span>
              </a>
            ))}
            <a href={`mailto:${email}`} className={styles.contactItem}>
              <HiMail size={14} />
              <span>{email}</span>
            </a>
          </div>
          <div className={styles.socials}>
            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} ICON — KJSIM. All Rights Reserved.</p>
        <p className={styles.madeBy}>Made with ❤️ by Farhan Sayed</p>
      </div>
    </footer>
  );
}
