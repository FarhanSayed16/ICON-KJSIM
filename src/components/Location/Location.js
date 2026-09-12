import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { SITE_CONFIG } from '@/lib/data';
import styles from './Location.module.css';

export default function Location() {
  const { venue } = SITE_CONFIG;

  return (
    <section className={styles.section} id="location">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Location</h2>
            <p>Find us at the heart of Mumbai</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.wrapper}>
            <div className={styles.mapContainer}>
              <iframe
                src={venue.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KJSIM Campus Location"
              />
            </div>
            <div className={styles.info}>
              <div className={styles.iconWrap}>
                <HiOutlineLocationMarker size={28} />
              </div>
              <h3 className={styles.venueName}>{venue.name}</h3>
              <p className={styles.venueAddress}>{venue.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${venue.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ marginTop: 'var(--space-lg)' }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
