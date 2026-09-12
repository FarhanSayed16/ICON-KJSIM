'use client';

import { useState, useEffect } from 'react';
import styles from './LivePage.module.css';
import { HiOutlineStatusOnline } from 'react-icons/hi';

export default function LiveClient({ initialData }) {
  const [liveData, setLiveData] = useState(initialData);

  // In a real app, we might poll the server action every 30s here to get live updates
  // For now, we just use the initialData provided by the server component

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Live Stream</h1>
            <p className={styles.subtitle}>Watch ICON 2026 events as they happen.</p>
          </div>
          
          <div className={`${styles.livePill} ${liveData.isLive ? styles.isLive : styles.isOffline}`}>
            {liveData.isLive ? (
              <>
                <div className={styles.dot}></div>
                LIVE NOW
              </>
            ) : (
              <>
                <HiOutlineStatusOnline size={18} />
                OFFLINE
              </>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className={styles.layout}>
          
          {/* Left: Video Player */}
          <div className={styles.playerSection}>
            <div className={styles.videoWrapper}>
              {liveData.isLive && liveData.youtubeVideoId ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${liveData.youtubeVideoId}?autoplay=1&mute=1`}
                  title="ICON 2026 Live Stream" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className={styles.offlineBanner}>
                  <HiOutlineStatusOnline size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <div>The stream is currently offline.</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Check the schedule for upcoming events.</div>
                </div>
              )}
            </div>
            
            {liveData.isLive && liveData.currentEvent && (
              <div className={styles.eventInfo}>
                <h2>{liveData.currentEvent.title}</h2>
                <p>{liveData.currentEvent.description}</p>
              </div>
            )}
          </div>

          {/* Right: Schedule */}
          <div className={styles.scheduleSection}>
            <h3>Today's Schedule</h3>
            <div className={styles.scheduleList}>
              {liveData.schedule.map((item) => (
                <div 
                  key={item.id} 
                  className={`
                    ${styles.scheduleItem} 
                    ${item.status === 'live' ? styles.itemLive : ''} 
                    ${item.status === 'past' ? styles.itemPast : ''}
                  `}
                >
                  <div className={styles.itemTime}>{item.time}</div>
                  <div className={styles.itemTitle}>
                    {item.title} {item.status === 'live' && '(LIVE)'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
