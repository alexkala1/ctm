// In-memory store for rate limiting (use Redis in production)
export const attempts = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  windowMs: number;
  maxAttempts: number;
  message?: string;
  identifier?: 'ip' | 'email' | 'both';
}

/**
 * Rate limiting function for authentication endpoints
 * Note: This is kept for compatibility but rate limiting should be handled by infrastructure
 */
export function createRateLimit(options: RateLimitOptions) {
  const { windowMs, maxAttempts, message = 'Too many attempts, please try again later', identifier = 'both' } = options;

  return (clientIP?: string, email?: string) => {
    const now = Date.now();

    // Create multiple rate limit keys for better protection
    const keys: string[] = [];

    if (identifier === 'ip' || identifier === 'both') {
      keys.push(`rate_limit:ip:${clientIP || 'unknown'}`);
    }

    if (identifier === 'email' || identifier === 'both') {
      if (email && typeof email === 'string') {
        keys.push(`rate_limit:email:${email.toLowerCase()}`);
      }
    }

    // If no keys can be generated, use IP as fallback
    if (keys.length === 0) {
      keys.push(`rate_limit:ip:${clientIP || 'unknown'}`);
    }

    // Check all keys and use the one with highest count
    let maxCount = 0;
    let shouldBlock = false;

    for (const key of keys) {
      const current = attempts.get(key);

      if (!current || now > current.resetTime) {
        // First attempt or window expired
        attempts.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
        maxCount = Math.max(maxCount, 1);
      } else {
        maxCount = Math.max(maxCount, current.count);

        if (current.count >= maxAttempts) {
          shouldBlock = true;
        } else {
          // Increment attempt count
          current.count++;
          attempts.set(key, current);
        }
      }
    }

    if (shouldBlock) {
      throw new Error(message);
    }
  };
}

// Predefined rate limiters (kept for compatibility but should be handled by infrastructure)
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  message: 'Too many login attempts, please try again in 15 minutes',
});

export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  message: 'Too many registration attempts, please try again in 1 hour',
});
