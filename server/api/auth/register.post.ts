import prisma from '../../../lib/prisma'
import type { AuthUser, UserRole } from '../../../types'
import { registerSchema } from '../../utils/validation'
import { hashPassword, validatePasswordStrength } from '../../utils/password'
import { generateToken } from '../../utils/jwt'
import { registerRateLimit } from '../../utils/rateLimit'
import { log } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Apply rate limiting
    registerRateLimit(event)
    
    const body = await readBody(event)
    const validatedData = registerSchema.parse(body)

    // Validate password strength
    const passwordValidation = validatePasswordStrength(validatedData.password)
    if (!passwordValidation.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: passwordValidation.errors.join(', '),
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      log.auth.register(validatedData.email, false, 'User already exists')
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || 'User',
        hashedPassword,
        role: (validatedData.role as UserRole) || 'USER',
        status: 'PENDING', // Requires admin approval
        provider: 'EMAIL',
      },
    })

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name ?? undefined,
      role: newUser.role,
      status: newUser.status,
      provider: newUser.provider,
    }

    // Generate JWT token (user will be approved later)
    const token = generateToken(authUser)

    // Set session cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    log.auth.register(validatedData.email, true)

    return {
      success: true,
      data: authUser,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    log.error('Registration error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
