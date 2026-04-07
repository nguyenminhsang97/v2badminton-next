import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitPath = "js" | "no_js";

const hasUpstashConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN,
);

const redis = hasUpstashConfig ? Redis.fromEnv() : null;
const jsLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: false,
    })
  : null;
const noJsLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, "1 h"),
      analytics: false,
    })
  : null;

export async function checkRateLimit(ip: string, path: RateLimitPath) {
  if (!jsLimiter || !noJsLimiter) {
    return { allowed: true, skipped: true as const };
  }

  const limiter = path === "js" ? jsLimiter : noJsLimiter;
  const result = await limiter.limit(ip);

  return {
    allowed: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
