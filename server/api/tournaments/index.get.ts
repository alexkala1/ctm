import prisma from '../../../lib/prisma'
import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Get current user to determine visibility rules
    const user = await getCurrentUser(event)
    
    // Build where clause based on user role
    const whereClause: Record<string, unknown> = {
      deletedAt: null, // Only fetch non-deleted tournaments
    }
    
    // If user is not authenticated or not an admin, only show OPEN and IN_PROGRESS tournaments
    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      whereClause.status = {
        in: ['OPEN', 'IN_PROGRESS']
      }
    }
    
    const tournaments = await prisma.tournament.findMany({
      where: whereClause,
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
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      data: tournaments,
    }
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching tournaments:', error)
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tournaments',
    })
  }
})
