'use server';

import { LIVE_SCHEDULE, LIVE_STREAM, SITE_CONFIG } from '@/lib/data';

/**
 * Live stream payload driven by static config in data.js.
 * Update LIVE_STREAM.youtubeVideoId + isLive before the fest.
 */
export async function getLiveStreamData() {
  const schedule = LIVE_SCHEDULE.map((item, index) => ({
    id: index + 1,
    title: item.event,
    time: item.time,
    status:
      item.status === 'completed'
        ? 'past'
        : item.status === 'live'
          ? 'live'
          : 'upcoming',
  }));

  const liveItem = LIVE_SCHEDULE.find((s) => s.status === 'live');

  return {
    success: true,
    data: {
      isLive: Boolean(LIVE_STREAM.isLive),
      youtubeVideoId: LIVE_STREAM.youtubeVideoId || null,
      currentEvent: liveItem
        ? {
            id: liveItem.event,
            title: liveItem.event,
            description: LIVE_STREAM.description || SITE_CONFIG.tagline,
            startTime: liveItem.time,
            endTime: '',
          }
        : LIVE_STREAM.currentEventTitle
          ? {
              id: 'current',
              title: LIVE_STREAM.currentEventTitle,
              description: LIVE_STREAM.description || SITE_CONFIG.tagline,
              startTime: '',
              endTime: '',
            }
          : null,
      schedule,
    },
  };
}
