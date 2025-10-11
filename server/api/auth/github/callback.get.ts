import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3'
import prisma from '../../../../lib/prisma'
import { githubOAuth } from '../../../utils/github-oauth'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { code, state, error } = query

    if (error) {
      throw createError({ statusCode: 400, statusMessage: `OAuth error: ${error}` })
    }
    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Authorization code not provided' })
    }

    let redirectTo = '/'
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state as string, 'base64').toString())
        redirectTo = decoded.redirectTo || '/'
      } catch (e) {
        console.warn('Failed to decode state:', e)
      }
    }

    const { access_token } = await githubOAuth.getTokens(code as string)
    const ghUser = await githubOAuth.getUser(access_token)

    if (!ghUser.email) {
      throw createError({ statusCode: 400, statusMessage: 'GitHub account has no accessible email' })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: ghUser.email },
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
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          provider: 'GITHUB',
          providerId: ghUser.id,
          avatarUrl: ghUser.avatar_url || user.avatarUrl,
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
      user = await prisma.user.create({
        data: {
          email: ghUser.email,
          name: ghUser.name || 'User',
          provider: 'GITHUB',
          providerId: ghUser.id,
          avatarUrl: ghUser.avatar_url,
          status: 'APPROVED', // Auto-approve OAuth users
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

    if (user.status !== 'APPROVED') {
      await sendRedirect(event, `/auth/login?message=pending-approval&email=${encodeURIComponent(user.email)}`)
      return
    }

    const jwt = await import('jsonwebtoken')
    const token = jwt.default.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    await sendRedirect(event, redirectTo)
  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed'
    await sendRedirect(event, `/auth/login?error=${encodeURIComponent(errorMessage)}`)
  }
})

