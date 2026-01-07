// In-memory token blacklist (use Redis in production)
const blacklistedTokens = new Set<string>();

/**
 * Add a token to the blacklist
 */
export function blacklistToken(token: string): void {
  blacklistedTokens.add(token);
  
  // Clean up old blacklisted tokens periodically
  if (blacklistedTokens.size > 1000) {
    blacklistedTokens.clear();
  }
}

/**
 * Check if a token is blacklisted
 */
export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token);
}

/**
 * Remove a token from the blacklist (for testing purposes)
 */
export function removeFromBlacklist(token: string): void {
  blacklistedTokens.delete(token);
}

/**
 * Clear all blacklisted tokens (for testing purposes)
 */
export function clearBlacklist(): void {
  blacklistedTokens.clear();
}
