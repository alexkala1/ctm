import { getCurrentUser } from '../../utils/auth'
import { log } from '../../utils/logger'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get current user for logging
    const user = await getCurrentUser(event)
    
    // Clear the auth cookie
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    })

    // Log logout
    if (user) {
      log.auth.logout(user.id)
    }

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    log.error('Logout error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
