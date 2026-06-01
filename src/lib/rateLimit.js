const rateLimitMap = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;      // max 10 requests per minute per IP

export function rateLimit(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + WINDOW_MS };

  // Reset window if expired
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);

  const remaining = MAX_REQUESTS - entry.count;
  const allowed = entry.count <= MAX_REQUESTS;

  return {
    allowed,
    remaining: Math.max(remaining, 0),
    resetAt: entry.resetAt,
    ip,
  };
}