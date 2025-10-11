import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    return {
      success: true,
      data: {
        user: user
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Get user error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
