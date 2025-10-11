import { createError } from 'h3'

/**
 * Security middleware for CSRF protection and security headers
 */
export default defineEventHandler(async (event) => {
  // Add security headers
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'X-XSS-Protection', '1; mode=block')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Add CSP header
  setHeader(event, 'Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  )

  // CSRF protection for state-changing operations
  if (event.node.req.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.node.req.method)) {
    const origin = getHeader(event, 'origin')
    const referer = getHeader(event, 'referer')
    const host = getHeader(event, 'host')
    
    // Allow same-origin requests
    if (origin && referer) {
      const originHost = new URL(origin).host
      const refererHost = new URL(referer).host
      
      if (originHost !== host || refererHost !== host) {
        throw createError({
          statusCode: 403,
          statusMessage: 'CSRF token mismatch',
        })
      }
    }
  }
})
