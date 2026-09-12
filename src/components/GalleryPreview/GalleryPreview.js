'use client';

import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './GalleryPreview.module.css';

const PREVIEW_IMAGES = [
  '/images/gallery/11.webp',
  '/images/gallery/2.webp',
  '/images/gallery/33.webp',
  '/images/gallery/44.webp',
];

export default function GalleryPreview() {
  return (
    <section className={styles.section} id="gallery">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>ICON Highlights</h2>
            <p>Moments from past editions</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.galleryGrid}>
            {PREVIEW_IMAGES.map((src, i) => (
              <div key={i} className={styles.imageWrap}>
                <Image
                  src={src}
                  alt={`Gallery preview ${i + 1}`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.cta}>
            <Link href="/gallery" className="btn-outline">
              View Full Gallery
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
