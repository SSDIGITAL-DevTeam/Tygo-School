import { Redis } from "@upstash/redis";

// Sliding window rate limiter using Upstash Redis with in-memory fallback for dev
export type RateLimitOptions = {
  limit: number; // max requests
  window: number; // seconds
  prefix?: string;
};

const memoryStore: Map<string, number[]> = new Map();

function getRedis() {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;
  if (url && token) return new Redis({ url, token });
  return null;
}

export async function rateLimit(key: string, opts: RateLimitOptions) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - opts.window;
  const redis = getRedis();

  const k = `${opts.prefix || "rl"}:${key}`;
  if (redis) {
    // Use simple fixed-window counter via INCR + EXPIRE
    const used = await redis.incr(k);
    if (used === 1) {
      await redis.expire(k, opts.window);
    }
    const allowed = used <= opts.limit;
    const retryAfter = allowed ? 0 : opts.window;
    return { allowed, used, limit: opts.limit, retryAfter };
  }

  // In-memory fallback (dev only)
  const arr = memoryStore.get(k) || [];
  const filtered = arr.filter((ts) => ts > windowStart);
  filtered.push(now);
  memoryStore.set(k, filtered);
  const used = filtered.length;
  const allowed = used <= opts.limit;
  const retryAfter = allowed ? 0 : opts.window;
  return { allowed, used, limit: opts.limit, retryAfter };
}
