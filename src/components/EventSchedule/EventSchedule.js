'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { EVENTS, EVENT_CATEGORIES } from '@/lib/data';
import styles from './EventSchedule.module.css';

export default function EventSchedule() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents =
    activeCategory === 'all'
      ? EVENTS.filter((e) => e.isActive)
      : EVENTS.filter((e) => e.category === activeCategory && e.isActive);

  return (
    <section className={styles.section} id="events">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Event Schedule</h2>
            <p>Explore our lineup of technical, non-technical &amp; gaming events</p>
            <span className="accent-line" />
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal>
          <div className={styles.tabs} role="tablist" aria-label="Event categories">
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                role="tab"
                aria-selected={activeCategory === cat.key}
                className={`${styles.tab} ${activeCategory === cat.key ? styles.tabActive : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Event Cards Grid */}
        <div className={styles.grid} role="tabpanel">
          {filteredEvents.map((event, i) => (
            <ScrollReveal key={event.slug} delay={i * 0.08}>
              <EventCard event={event} onClick={() => setSelectedEvent(event)} />
            </ScrollReveal>
          ))}
          {filteredEvents.length === 0 && (
            <p className={styles.empty}>No events in this category yet.</p>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
