const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

const buckets = globalThis.__abilityToThriveRateLimitBuckets || new Map();
globalThis.__abilityToThriveRateLimitBuckets = buckets;

function getClientIp(request) {
  const forwardedFor =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "";

  return forwardedFor.split(",")[0]?.trim() || "unknown";
}

function pruneExpiredBuckets(now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(request, options = {}) {
  const limit = options.limit || DEFAULT_LIMIT;
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
  const namespace = options.namespace || "default";
  const now = Date.now();
  const clientIp = getClientIp(request);
  const key = `${namespace}:${clientIp}`;

  pruneExpiredBuckets(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      limited: false,
      remaining: limit - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= limit) {
    return {
      limited: true,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;

  return {
    limited: false,
    remaining: Math.max(limit - bucket.count, 0),
    retryAfterSeconds: 0,
  };
}

export function rateLimitResponse(result) {
  return Response.json(
    {
      error: "Too many requests. Please wait before trying again.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
      },
    }
  );
}
