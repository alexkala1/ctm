import prisma from '../../../lib/prisma'
import type { AuthUser } from '../../../types'
import { loginSchema } from '../../utils/validation'
import { verifyPassword } from '../../utils/password'
import { generateToken } from '../../utils/jwt'
import { authRateLimit } from '../../utils/rateLimit'
import { log } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Apply rate limiting
    authRateLimit(event)
    
    const body = (await readBody(event)) as unknown
    const validatedData = loginSchema.parse(body)

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        hashedPassword: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        avatarUrl: true,
        provider: true,
      },
    })

    if (!user) {
      log.auth.failedAttempt(validatedData.email, 'User not found')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      log.auth.failedAttempt(validatedData.email, 'Account locked')
      throw createError({
        statusCode: 423,
        statusMessage: 'Account is temporarily locked due to too many failed attempts',
      })
    }

    // Check if user is approved
    if (user.status !== 'APPROVED') {
      log.auth.failedAttempt(validatedData.email, `User status: ${user.status}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Account is pending approval',
      })
    }

    // Verify password
    if (!user.hashedPassword || !(await verifyPassword(validatedData.password, user.hashedPassword))) {
      // Increment failed login attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1
      const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // 15 minutes lock
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil: lockUntil,
        },
      })

      log.auth.failedAttempt(validatedData.email, 'Invalid password')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl ?? undefined,
      provider: user.provider,
      lastLoginAt: user.lastLoginAt ?? undefined,
    }

    // Generate JWT token
    const token = generateToken(authUser)

    // Set session cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    log.auth.login(validatedData.email, true)

    return {
      success: true,
      data: {
        user: authUser,
        token: token,
      },
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    log.error('Login error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
