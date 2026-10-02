// In-memory sliding-window rate limiter, keyed per request (e.g. by IP).
//
// This is process-local: on a multi-instance deployment each instance
// tracks its own counts, so the effective limit is "N per minute per
// instance", not globally. Fine for a low-traffic launch page. If this needs
// to hold under real scale or run correctly across many instances, swap the
// Map below for a shared store (Vercel KV / Upstash Redis) with the same
// sliding-window logic.
const hits = new Map();

export function rateLimit(key, { max = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= max) {
    const retryAfterMs = windowMs - (now - recent[0]);
    return { allowed: false, retryAfterMs };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, remaining: max - recent.length };
}
