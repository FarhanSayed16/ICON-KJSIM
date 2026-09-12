'use client';

import Link from 'next/link';
import { HiOutlineCode, HiOutlineUsers, HiOutlineCurrencyRupee } from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './HackathonPage.module.css';

export default function HackathonClient() {
  return (
    <div className={styles.page}>
      <div className="container">
        
        {/* ── Hero ── */}
        <ScrollReveal>
          <div className={styles.hero}>
            <h1 className={styles.title}>CodeICON</h1>
            <p className={styles.subtitle}>The Ultimate 24-Hour Hackathon at KJSIM</p>
            <div className={styles.dates}>February 13 – 14, 2026</div>
            <div>
              <Link href="/register?event=code-icon" className="btn-primary">
                Register Now
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Key Details Grid ── */}
        <ScrollReveal delay={0.2}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <div className={styles.iconWrap}><HiOutlineUsers /></div>
              <h3>Team Size</h3>
              <p>2 to 4 Members</p>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.iconWrap}><HiOutlineCurrencyRupee /></div>
              <h3>Registration Fee</h3>
              <p>₹500 per team</p>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.iconWrap}><HiOutlineCode /></div>
              <h3>Domains</h3>
              <p>Web, AI/ML, Blockchain, Open Innovation</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── About Section ── */}
        <ScrollReveal>
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>The Challenge</h2>
            <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              CodeICON is a grueling 24-hour hackathon designed to push your limits. 
              Gather your smartest peers, pick a problem statement from our diverse domains, 
              and build a working prototype from scratch. Whether you're a frontend wizard, 
              a machine learning enthusiast, or a full-stack architect, this is your arena to 
              innovate, build, and conquer.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Prizes ── */}
        <ScrollReveal>
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Prize Pool</h2>
            <div className={styles.prizesGrid}>
              <div className={styles.prizeCard} data-place="2">
                <h4>Runner Up</h4>
                <div className={styles.prizeAmount}>₹15,000</div>
              </div>
              <div className={styles.prizeCard} data-place="1">
                <h4>Grand Prize</h4>
                <div className={styles.prizeAmount}>₹30,000</div>
              </div>
              <div className={styles.prizeCard} data-place="3">
                <h4>Second Runner Up</h4>
                <div className={styles.prizeAmount}>₹5,000</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Timeline ── */}
        <ScrollReveal>
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Timeline</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineDate}>Feb 5, 2026</span>
                <h4>Registration Closes</h4>
                <p>Last day to form your teams and submit your registration.</p>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineDate}>Feb 13, 2026 - 10:00 AM</span>
                <h4>Hackathon Commences</h4>
                <p>Problem statements are revealed and the 24-hour timer begins.</p>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineDate}>Feb 14, 2026 - 10:00 AM</span>
                <h4>Coding Ends</h4>
                <p>Time's up! Stop coding and prepare your presentations.</p>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <span className={styles.timelineDate}>Feb 14, 2026 - 12:00 PM</span>
                <h4>Judging & Pitches</h4>
                <p>Pitch your solution to our panel of industry experts.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Rules ── */}
        <ScrollReveal>
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Rules & Eligibility</h2>
            <ul className={styles.rulesList}>
              <li>All team members must be currently enrolled university/college students.</li>
              <li>Teams must consist of 2 to 4 members. Cross-college teams are permitted.</li>
              <li>All code must be written during the hackathon. Use of pre-existing code/templates is strictly prohibited and will lead to disqualification.</li>
              <li>Use of open-source libraries and APIs is allowed and encouraged.</li>
              <li>Decisions made by the judging panel are final and binding.</li>
            </ul>
          </div>
        </ScrollReveal>

        {/* ── Bottom CTA ── */}
        <ScrollReveal>
          <div className={styles.ctaBottom}>
            <Link href="/register?event=code-icon" className="btn-primary">
              Register Your Team
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
