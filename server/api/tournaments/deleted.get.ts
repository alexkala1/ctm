import prisma from '../../../lib/prisma'
import { getCurrentUser, requireAuth, requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    requireAuth(user)
    requireAdmin(user!)

    const tournaments = await prisma.tournament.findMany({
      where: {
        deletedAt: { not: null }, // Only fetch soft-deleted tournaments
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        competitors: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        deletedAt: 'desc',
      },
    })

    return {
      success: true,
      data: tournaments,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Error fetching deleted tournaments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch deleted tournaments',
    })
  }
})
