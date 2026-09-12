/**
 * Simple in-memory rate limiter for serverless/dev.
 * Note: resets on cold start; good enough for demo / low volume.
 */
const buckets = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60 * 60 * 1000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count += 1;
  buckets.set(key, entry);
  return { ok: true, remaining: limit - entry.count };
}
