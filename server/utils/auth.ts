import type { H3Event } from 'h3'
import prisma from '../../lib/prisma'
import type { UserRole, AuthUser } from '../../types'
import { verifyToken, extractTokenFromHeader } from './jwt'
import { log } from './logger'

export async function getCurrentUser(event: H3Event): Promise<AuthUser | null> {
  try {
    // Try to get token from Authorization header first
    const authHeader = getHeader(event, 'authorization')
    let token = extractTokenFromHeader(authHeader)
    
    // Fallback to cookie if no Authorization header
    if (!token) {
      token = getCookie(event, 'auth-token')
    }
    
    if (!token) {
      return null
    }

    // Verify JWT token
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatarUrl: true,
        provider: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      log.auth.failedAttempt(payload.email, 'User not found in database')
      return null
    }

    // Check if user is approved
    if (user.status !== 'APPROVED') {
      log.auth.failedAttempt(user.email, `User status: ${user.status}`)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl ?? undefined,
      provider: user.provider,
      lastLoginAt: user.lastLoginAt ?? undefined,
    }
  } catch (error) {
    log.error('Error in getCurrentUser', { error })
    return null
  }
}

export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  return user
}

export function requireRole(user: AuthUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
}

export function requireAdmin(user: AuthUser): void {
  requireRole(user, ['ADMIN', 'SUPER_ADMIN'])
}

export function requireSuperAdmin(user: AuthUser): void {
  requireRole(user, ['SUPER_ADMIN'])
}
