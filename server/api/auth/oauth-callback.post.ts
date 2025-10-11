import prisma from '../../../lib/prisma'
import type { OAuthRegisterData, AuthUser } from '../../../types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { provider, providerId, email, name, avatarUrl } = body as OAuthRegisterData

    if (!provider || !providerId || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required OAuth data',
      })
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
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

    if (user) {
      // Update last login and provider info if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          provider,
          providerId,
          avatarUrl: avatarUrl || user.avatarUrl,
        },
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
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'User',
          provider,
          providerId,
          avatarUrl,
          status: 'PENDING', // Requires admin approval
        },
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
    }

    // Check if user is approved
    if (user.status !== 'APPROVED') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account pending approval. Please wait for admin approval.',
      })
    }

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

    // Set session cookie
    setCookie(event, 'auth-token', 'oauth-token-' + user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      data: authUser,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('OAuth callback error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
