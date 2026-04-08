import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { captureException } from "@/lib/monitoring";

export type RateLimitPath = "js" | "no_js";

function getUpstashRestConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ??
    null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ??
    null;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

const upstashRestConfig = getUpstashRestConfig();
const redis = upstashRestConfig
  ? new Redis({
      url: upstashRestConfig.url,
      token: upstashRestConfig.token,
    })
  : null;
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
  try {
    const result = await limiter.limit(ip);

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("Rate limit check failed", error);
    captureException(error, {
      tags: {
        area: "rate_limit",
        rate_limit_path: path,
      },
      extras: {
        ip,
      },
    });
    return {
      allowed: true,
      skipped: true as const,
      error: "rate_limit_unavailable" as const,
    };
  }
}
