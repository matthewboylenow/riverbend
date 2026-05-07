/**
 * In-memory rate limiter for admin auth endpoints.
 *
 * Scope is admin-only and traffic is tiny, so a process-local map is fine.
 * If the app ever runs multiple Node instances or moves to edge, swap this
 * for Upstash/Redis without changing callers.
 *
 * Each bucket allows `max` hits per `windowMs`. Hits past the limit return
 * `{ ok: false, retryAfterMs }`.
 */
type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0];
    return { ok: false, retryAfterMs: oldest + windowMs - now };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

// Periodic cleanup so the map doesn't grow unbounded for stale keys.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const [key, bucket] of buckets) {
      bucket.hits = bucket.hits.filter((t) => t > cutoff);
      if (bucket.hits.length === 0) buckets.delete(key);
    }
  }, 10 * 60 * 1000).unref?.();
}
