'use client';

import { useEffect } from 'react';
import { isStaleChunkError, reloadForStaleAssets } from '@/lib/assetRecovery';

/**
 * Runtime half of stale-build recovery (the <head> script covers CSS/JS tags
 * that fail before React hydrates). Handles lazy chunk / RSC failures.
 */
export default function ChunkLoadRecovery() {
  useEffect(() => {
    const onRejection = (event) => {
      if (isStaleChunkError(event.reason)) {
        event.preventDefault();
        reloadForStaleAssets();
      }
    };

    const onError = (event) => {
      if (isStaleChunkError(event.error)) reloadForStaleAssets();
    };

    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

  return null;
}
