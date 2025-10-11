import { createError } from 'h3'

// In-memory store for rate limiting (use Redis in production)
const attempts = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number
  maxAttempts: number
  message?: string
}

/**
 * Rate limiting middleware for authentication endpoints
 */
export function createRateLimit(options: RateLimitOptions) {
  const { windowMs, maxAttempts, message = 'Too many attempts, please try again later' } = options
  
  return (event: any) => {
    const clientIP = getClientIP(event) || 'unknown'
    const now = Date.now()
    const key = `rate_limit:${clientIP}`
    
    const current = attempts.get(key)
    
    if (!current || now > current.resetTime) {
      // First attempt or window expired
      attempts.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return
    }
    
    if (current.count >= maxAttempts) {
      throw createError({
        statusCode: 429,
        statusMessage: message
      })
    }
    
    // Increment attempt count
    current.count++
    attempts.set(key, current)
  }
}

/**
 * Get client IP address
 */
function getClientIP(event: any): string | undefined {
  return event.node.req.headers['x-forwarded-for'] as string ||
         event.node.req.headers['x-real-ip'] as string ||
         event.node.req.connection?.remoteAddress ||
         event.node.req.socket?.remoteAddress
}

// Predefined rate limiters
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  message: 'Too many login attempts, please try again in 15 minutes'
})

export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  message: 'Too many registration attempts, please try again in 1 hour'
})
