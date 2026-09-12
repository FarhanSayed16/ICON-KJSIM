'use client';

import { useState, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import EventCard from '@/components/EventSchedule/EventCard';
import EventModal from '@/components/EventSchedule/EventModal';
import { EVENTS, EVENT_CATEGORIES } from '@/lib/data';
import styles from './Events.module.css';

export default function EventsClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = EVENTS.filter((e) => e.isActive);

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((e) => e.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerQuery) ||
          e.shortDesc.toLowerCase().includes(lowerQuery) ||
          e.venue.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    if (sortBy === 'fee-asc') {
      result.sort((a, b) => {
        const feeA = !a.fee || a.fee === 'Free' ? 0 : parseInt(a.fee.replace(/[^0-9]/g, ''), 10) || 0;
        const feeB = !b.fee || b.fee === 'Free' ? 0 : parseInt(b.fee.replace(/[^0-9]/g, ''), 10) || 0;
        return feeA - feeB;
      });
    } else if (sortBy === 'prize-desc') {
      result.sort((a, b) => {
        const prizeA = !a.prizePool || a.prizePool === 'TBD' ? 0 : parseInt(a.prizePool.replace(/[^0-9]/g, ''), 10) || 0;
        const prizeB = !b.prizePool || b.prizePool === 'TBD' ? 0 : parseInt(b.prizePool.replace(/[^0-9]/g, ''), 10) || 0;
        return prizeB - prizeA;
      });
    } else if (sortBy === 'date') {
      result.sort((a, b) => {
        const dateA = new Date(`${a.date} 2026 ${a.time.split('-')[0]}`);
        const dateB = new Date(`${b.date} 2026 ${b.time.split('-')[0]}`);
        return dateA - dateB;
      });
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page Header */}
        <ScrollReveal>
          <div className={styles.header}>
            <h1 className={styles.title}>All Events</h1>
            <p className={styles.subtitle}>Discover, compete, and conquer at ICON 2026</p>
          </div>
        </ScrollReveal>

        {/* Toolbar */}
        <ScrollReveal delay={0.1}>
          <div className={styles.toolbar}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <HiSearch className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search events, venues..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
            </div>

            {/* Category Filters */}
            <div className={styles.filters} role="tablist" aria-label="Event categories">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  title={cat.fullLabel || cat.label}
                  aria-selected={activeCategory === cat.key}
                  className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className={styles.sortWrap}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort events"
              >
                <option value="default">Featured</option>
                <option value="date">Date & Time</option>
                <option value="fee-asc">Entry Fee (Low to High)</option>
                <option value="prize-desc">Prize Pool (High to Low)</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Events Grid */}
        <div className={styles.grid}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, i) => (
              <ScrollReveal key={event.slug} delay={0.1 + (i % 3) * 0.1}>
                <EventCard event={event} onClick={() => setSelectedEvent(event)} />
              </ScrollReveal>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No events found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
