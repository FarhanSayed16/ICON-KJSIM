import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { SPONSORS } from '@/lib/data';
import styles from './Sponsors.module.css';

export default function Sponsors() {
  return (
    <section className={styles.section} id="sponsors">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Our Sponsors</h2>
            <p>Proudly supported by industry leaders</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.grid}>
            {SPONSORS.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sponsorCard}
                aria-label={`${sponsor.name} — ${sponsor.tier}`}
              >
                <div className={styles.logoWrap}>
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={160}
                    height={80}
                    className={styles.logo}
                  />
                </div>
                <span className={styles.tier}>{sponsor.tier}</span>
                <span className={styles.name}>{sponsor.name}</span>
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.cta}>
            <Link href="/sponsors" className="btn-outline">
              View All Sponsors
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
