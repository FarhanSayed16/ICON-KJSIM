'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { EVENT_CATEGORIES } from '@/lib/data';
import styles from './EventSchedule.module.css';

export default function EventSchedule({ events = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents =
    activeCategory === 'all'
      ? events.filter((e) => e.isActive)
      : events.filter((e) => e.category === activeCategory && e.isActive);

  return (
    <section className={styles.section} id="events">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading">
            <h2>Event Schedule</h2>
            <p>ICON 2026 Event List — technical, sports, indoor &amp; esports, mini-games</p>
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
                type="button"
                title={cat.fullLabel || cat.label}
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
