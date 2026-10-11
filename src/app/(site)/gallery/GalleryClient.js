'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { HiOutlineMagnifyingGlassPlus, HiXMark, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './GalleryPage.module.css';

// Mock data since the gallery folder is empty right now.
// Real implementation would import a list of image paths.
const GALLERY_DATA = [
  { id: 1, src: '/images/gallery/11.webp', alt: 'ICON Techfest Event', width: 800, height: 600 },
  { id: 2, src: '/images/gallery/2.webp', alt: 'ICON Techfest Audience', width: 800, height: 600 },
  { id: 3, src: '/images/gallery/33.webp', alt: 'Tech Event 1', width: 800, height: 600 },
  { id: 4, src: '/images/gallery/44.webp', alt: 'Tech Event 2', width: 800, height: 600 },
  { id: 5, src: '/images/gallery/5.webp', alt: 'Tech Event 3', width: 800, height: 600 },
];

export default function GalleryClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === GALLERY_DATA.length - 1 ? 0 : prev + 1));
  }, []);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_DATA.length - 1 : prev - 1));
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, showNext, showPrev]);

  return (
    <div className={styles.page}>
      <div className="container">
        
        {/* Page Header */}
        <ScrollReveal>
          <div className={styles.header}>
            <h1 className={styles.title}>Gallery</h1>
            <p className={styles.subtitle}>Relive the moments from our past editions.</p>
          </div>
        </ScrollReveal>

        {/* Masonry Grid */}
        <div className={styles.grid}>
          {GALLERY_DATA.map((img, index) => (
            <ScrollReveal key={img.id} delay={0.1 + (index % 3) * 0.1}>
              <div 
                className={styles.gridItem} 
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt}`}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') openLightbox(index); }}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className={styles.image}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                  <div className={styles.overlay}>
                    <HiOutlineMagnifyingGlassPlus className={styles.overlayIcon} size={32} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Image gallery lightbox">
          <div className={styles.lightboxHeader}>
            <button 
              className={styles.closeBtn} 
              onClick={closeLightbox}
              aria-label="Close lightbox"
              autoFocus
            >
              <HiXMark size={24} />
            </button>
          </div>
          
          <div className={styles.lightboxContent} onClick={(e) => {
            // Close if clicking the backdrop, not the image or buttons
            if (e.target === e.currentTarget) closeLightbox();
          }}>
            <button 
              className={`${styles.navBtn} ${styles.prevBtn}`} 
              onClick={showPrev}
              aria-label="Previous image"
            >
              <HiChevronLeft size={28} />
            </button>

            <div className={styles.lightboxImageWrap}>
              <Image
                src={GALLERY_DATA[currentIndex].src}
                alt={GALLERY_DATA[currentIndex].alt}
                fill
                className={styles.lightboxImage}
                sizes="100vw"
                priority
              />
            </div>

            <button 
              className={`${styles.navBtn} ${styles.nextBtn}`} 
              onClick={showNext}
              aria-label="Next image"
            >
              <HiChevronRight size={28} />
            </button>
          </div>
          
          <div className={styles.lightboxCaption}>
            {GALLERY_DATA[currentIndex].alt} ({currentIndex + 1} of {GALLERY_DATA.length})
          </div>
        </div>
      )}

    </div>
  );
}
