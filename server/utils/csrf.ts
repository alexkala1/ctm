import crypto from 'crypto';

// In-memory store for CSRF tokens (use Redis in production)
// Note: This is kept for compatibility but CSRF is now handled by sidebase/nuxt-auth
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and store a CSRF token for a session
 */
export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken();
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour

  csrfTokens.set(sessionId, { token, expires });

  // Clean up expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < Date.now()) {
      csrfTokens.delete(key);
    }
  }

  return token;
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored || stored.expires < Date.now()) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(stored.token, 'hex'), Buffer.from(token, 'hex'));
}
