export default defineEventHandler(async (event) => {
  try {
    // Generate a simple CSRF token
    const csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Set CSRF token in cookie
    setCookie(event, 'csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    return {
      csrfToken
    }
  } catch (_error: unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
