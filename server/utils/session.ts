import Redis from 'ioredis';
import type { AuthUser } from '../../types';

// Redis client configuration
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Session configuration
const SESSION_PREFIX = 'session:';
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionData {
  user: AuthUser;
  createdAt: number;
  lastAccessed: number;
}

/**
 * Store user session in Redis
 */
export async function storeSession(sessionId: string, user: AuthUser): Promise<void> {
  const sessionData: SessionData = {
    user,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  };

  await redis.setex(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(sessionData));
}

/**
 * Get user session from Redis
 */
export async function getRedisSession(sessionId: string): Promise<SessionData | null> {
  try {
    const data = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!data) return null;

    const sessionData = JSON.parse(data) as SessionData;
    // Update last accessed time
    sessionData.lastAccessed = Date.now();
    await redis.setex(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(sessionData));

    return sessionData;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Delete user session from Redis
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<string[]> {
  const pattern = `${SESSION_PREFIX}*`;
  const keys = await redis.keys(pattern);
  const sessions: string[] = [];

  for (const key of keys) {
    try {
      const data = await redis.get(key);
      if (data) {
        const sessionData = JSON.parse(data) as SessionData;
        if (sessionData.user.id === userId) {
          sessions.push(key.replace(SESSION_PREFIX, ''));
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  return sessions;
}

/**
 * Invalidate all sessions for a user
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  const sessions = await getUserSessions(userId);
  if (sessions.length > 0) {
    await redis.del(...sessions.map(sessionId => `${SESSION_PREFIX}${sessionId}`));
  }
}

/**
 * Clean up expired sessions (run periodically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  const pattern = `${SESSION_PREFIX}*`;
  const keys = await redis.keys(pattern);

  for (const key of keys) {
    try {
      const data = await redis.get(key);
      if (data) {
        const sessionData = JSON.parse(data) as SessionData;
        const now = Date.now();
        const sessionAge = now - sessionData.lastAccessed;

        // Delete sessions older than 7 days
        if (sessionAge > 7 * 24 * 60 * 60 * 1000) {
          await redis.del(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up session:', error);
    }
  }
}

export default redis;
