import { createClient } from '@supabase/supabase-js';
import type { ZodSchema } from 'zod';

import type { AuthUser } from '../../types';

const supabase = createClient(process.env.NUXT_PUBLIC_SUPABASE_URL!, process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!);

export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Content-Security-Policy': string;
}

export const securityHeaders: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';",
};

// Note: Security headers are now handled by sidebase/nuxt-auth

export async function verifyAuth(token?: string): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    if (!token) {
      return { user: null, error: 'No authentication token provided' };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: error?.message || 'Invalid token' };
    }

    return { user, error: null };
  } catch {
    return { user: null, error: 'Authentication verification failed' };
  }
}

// requireAuth function moved to auth.ts to avoid conflicts

export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  return (
    (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >=
    (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0)
  );
}

export function validateInput(data: unknown, schema: ZodSchema): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    schema.parse(data);
    return { valid: true, errors: [] };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as {
        errors: Array<{ path: string[]; message: string }>;
      };
      errors.push(...zodError.errors.map(err => `${err.path.join('.')}: ${err.message}`));
    } else {
      errors.push('Invalid input data');
    }
    return { valid: false, errors };
  }
}

export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
}

export function rateLimit(maxRequests: number, windowMs: number) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return (_event: H3Event) => {
    const clientId = 'unknown'; // getClientIP(event) || 'unknown'
    const now = Date.now();
    const _windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < now) {
        requestCounts.delete(key);
      }
    }

    const clientData = requestCounts.get(clientId);

    if (!clientData || clientData.resetTime < now) {
      requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
      return;
    }

    if (clientData.count >= maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
      });
    }

    clientData.count++;
  };
}

export function validateFileUpload(
  file: File | null,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }

  const fileType = file.type ?? file.mimetype;
  if (!allowedTypes.includes(fileType)) {
    return { valid: false, error: `File type ${fileType} not allowed` };
  }

  return { valid: true };
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Password hashing functions moved to password.ts to avoid conflicts
