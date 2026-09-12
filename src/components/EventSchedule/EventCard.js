'use client';

import Image from 'next/image';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';
import styles from './EventSchedule.module.css';

function categoryKey(category) {
  return category.replace('-', '');
}

function categoryLabel(category) {
  if (category === 'non-technical') return 'Non-Tech';
  if (category === 'technical') return 'Tech';
  return 'Gaming';
}

export default function EventCard({ event, onClick }) {
  const cat = categoryKey(event.category);

  return (
    <button
      className={`${styles.card} ${styles[`card_${cat}`] || ''}`}
      onClick={onClick}
      aria-label={`View details for ${event.name}`}
    >
      <div className={`${styles.posterWrap} ${styles[`stage_${cat}`] || ''}`}>
        <span className={`${styles.categoryBadge} ${styles[cat]}`}>
          {categoryLabel(event.category)}
        </span>

        {/* Full flyer visible — no crop, no dark wash over the art */}
        <div className={styles.posterStage}>
          <Image
            src={event.posterImage}
            alt={`${event.name} poster`}
            fill
            className={styles.posterImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{event.name}</h3>
        <p className={styles.cardDesc}>{event.shortDesc}</p>

        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <HiOutlineCalendar size={14} />
            <span>{event.date}</span>
          </div>
          <div className={styles.metaItem}>
            <HiOutlineLocationMarker size={14} />
            <span>{event.venue}</span>
          </div>
          <div className={styles.metaItem}>
            <HiOutlineUserGroup size={14} />
            <span>{event.teamSize}</span>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.fee}>
            <HiOutlineCurrencyRupee size={16} />
            <span>{event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}</span>
          </div>
          {event.prizePool > 0 ? (
            <div className={styles.prize}>
              <HiOutlineTrophy size={16} />
              <span>₹{event.prizePool.toLocaleString()}</span>
            </div>
          ) : (
            <div className={styles.prizeMuted}>Open entry</div>
          )}
        </div>
      </div>
    </button>
  );
}
