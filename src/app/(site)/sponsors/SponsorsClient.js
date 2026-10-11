'use client';

import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { SPONSORS, SPONSOR_TIERS } from '@/lib/data';
import styles from './SponsorsPage.module.css';

export default function SponsorsClient() {
  // Group sponsors by tier
  const sponsorsByTier = SPONSOR_TIERS.reduce((acc, tier) => {
    const tierSponsors = SPONSORS.filter(s => s.tier === tier);
    if (tierSponsors.length > 0) {
      acc[tier] = tierSponsors;
    }
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page Header */}
        <ScrollReveal>
          <div className={styles.header}>
            <h1 className={styles.title}>Our Sponsors</h1>
            <p className={styles.subtitle}>
              Proudly supported by industry leaders who believe in the power of data and technology.
            </p>
          </div>
        </ScrollReveal>

        {/* Sponsor Tiers */}
        {Object.entries(sponsorsByTier).map(([tier, sponsors], index) => (
          <div key={tier} className={styles.tierSection} data-tier={tier}>
            <ScrollReveal delay={0.1}>
              <h2 className={styles.tierHeading}>{tier}</h2>
            </ScrollReveal>
            
            <div className={styles.grid}>
              {sponsors.map((sponsor, sIndex) => (
                <ScrollReveal key={sponsor.name} delay={0.1 + sIndex * 0.1}>
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sponsorCard}
                    aria-label={`${sponsor.name} website`}
                  >
                    <div className={styles.logoWrap}>
                      <Image
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        width={tier === 'Title Sponsor' ? 300 : 200}
                        height={tier === 'Title Sponsor' ? 150 : 100}
                        className={styles.logo}
                      />
                    </div>
                    {tier !== 'Title Sponsor' && (
                      <span className={styles.tierName}>{sponsor.tier}</span>
                    )}
                    <span className={styles.name}>{sponsor.name}</span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State / Fallback if no sponsors */}
        {Object.keys(sponsorsByTier).length === 0 && (
          <ScrollReveal>
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-tertiary)' }}>
              <p>Sponsors will be announced soon!</p>
            </div>
          </ScrollReveal>
        )}

        {/* CTA Section */}
        <ScrollReveal>
          <div className={styles.ctaSection}>
            <h3>Partner With Us</h3>
            <p>
              Join us in shaping the future of data science and technology. We offer various sponsorship 
              tiers with extensive brand visibility across our campus and digital platforms.
            </p>
            <Link href="/#contact" className="btn-primary">
              Become a Sponsor
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
