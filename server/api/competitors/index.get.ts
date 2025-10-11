import prisma from '../../../lib/prisma'
import { getCurrentUser, requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    requireAuth(user)

    const query = getQuery(event)
    const {
      page = 1,
      limit = 50,
      search = '',
      tournamentId,
      status = [],
      categories = [],
      gender = [],
      teams = [],
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query

    // Build where clause
    const where: Record<string, unknown> = {}

    if (tournamentId) {
      where.tournamentId = tournamentId
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { team: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status.length > 0) {
      where.playerAcceptanceStatus = { in: status }
    }

    if (categories.length > 0) {
      where.category = { in: categories }
    }

    if (gender.length > 0) {
      where.gender = { in: gender }
    }

    if (teams.length > 0) {
      where.team = { in: teams }
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {}
    orderBy[sortBy as string] = sortOrder

    // Get competitors with pagination
    const [competitors, total] = await Promise.all([
      prisma.competitor.findMany({
        where,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          tournament: {
            select: {
              id: true,
              name: true,
              status: true,
              hasTeams: true,
            },
          },
        },
      }),
      prisma.competitor.count({ where }),
    ])

    return {
      success: true,
      data: competitors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Error fetching competitors:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch competitors',
    })
  }
})
