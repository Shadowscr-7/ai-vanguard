/**
 * Simple in-memory rate limiter for API routes.
 * For production, consider using Redis-based solutions like @upstash/ratelimit.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests per window */
  limit?: number;
  /** Window size in milliseconds */
  windowMs?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 5, windowMs = 60 * 1000 } = options;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  entry.count++;
  store.set(key, entry);

  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get a rate limiting key from a request.
 * Uses x-forwarded-for or falls back to a generic key.
 */
export function getRateLimitKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
