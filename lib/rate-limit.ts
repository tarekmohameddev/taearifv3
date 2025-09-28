import { type NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  interval: number; // in milliseconds
  limit: number; // max requests per interval
}

interface RateLimitState {
  timestamp: number;
  count: number;
}

const ipCache = new Map<string, RateLimitState>();

export function rateLimit(options: RateLimitOptions) {
  return async function rateLimiter(req: NextRequest): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const ip = req.ip || "127.0.0.1";
    const now = Date.now();
    const resetTime = now + options.interval;

    let state = ipCache.get(ip);

    if (!state || now > state.timestamp + options.interval) {
      state = { timestamp: now, count: 0 };
    }

    state.count++;
    ipCache.set(ip, state);

    const remaining = Math.max(0, options.limit - state.count);
    const success = state.count <= options.limit;

    return {
      success,
      limit: options.limit,
      remaining,
      reset: resetTime,
    };
  };
}

// Pre-configured rate limiters
export const authRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requests per 15 minutes
});

export const apiRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per minute
});

// Middleware helper for rate limiting
export async function withRateLimit(
  req: NextRequest,
  limiter: ReturnType<typeof rateLimit>,
): Promise<NextResponse | null> {
  const result = await limiter(req);

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": Math.ceil(
            (result.reset - Date.now()) / 1000,
          ).toString(),
        },
      },
    );
  }

  return null;
}
