import { defineEventHandler, getQuery, createError } from 'h3'
import { googleOAuth } from '../../../utils/google-oauth'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { code, state, error } = query
    
    // Handle OAuth errors
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: `OAuth error: ${error}`
      })
    }
    
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Authorization code not provided'
      })
    }
    
    // Decode state to get redirect URL
    let redirectTo = '/'
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state as string, 'base64').toString())
        redirectTo = decodedState.redirectTo || '/'
      } catch (e) {
        console.warn('Failed to decode state:', e)
      }
    }
    
    // Exchange code for tokens
    const tokens = await googleOAuth.getTokens(code as string)
    
    if (!tokens.id_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No ID token received from Google'
      })
    }
    
    // Verify the ID token and get user info
    const googleUser = await googleOAuth.verifyToken(tokens.id_token)
    
    if (!googleUser.email || !googleUser.verified) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Google account email not verified'
      })
    }
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
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
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          provider: 'GOOGLE',
          providerId: googleUser.id,
          avatarUrl: googleUser.picture || user.avatarUrl,
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
          email: googleUser.email,
          name: googleUser.name || 'User',
          provider: 'GOOGLE',
          providerId: googleUser.id,
          avatarUrl: googleUser.picture,
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
    
    // Check if user is approved
    if (user.status !== 'APPROVED') {
      // Redirect to login page with pending message
      await sendRedirect(event, `/auth/login?message=pending-approval&email=${encodeURIComponent(user.email)}`)
      return
    }
    
    // Create JWT token for authenticated user
    const jwt = await import('jsonwebtoken')
    const token = jwt.default.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    // Set authentication cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    // Redirect to intended page
    await sendRedirect(event, redirectTo)
    
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    
    // Redirect to login page with error
    const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed'
    await sendRedirect(event, `/auth/login?error=${encodeURIComponent(errorMessage)}`)
  }
})
