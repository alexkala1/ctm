import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../utils/auth'
import { log } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(event)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = Math.min(parseInt(query.limit as string) || 10, 100) // Max 100 per page
    const search = query.search as string || ''
    const role = query.role as string || ''
    const status = query.status as string || ''
    const sortBy = query.sortBy as string || 'createdAt'
    const sortOrder = query.sortOrder as string || 'desc'

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    if (status) {
      where.status = status
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatarUrl: true,
        provider: true,
        lastLoginAt: true,
        approvedAt: true,
        approvedBy: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdTournaments: true,
            auditLogs: true,
          },
        },
      },
    })

    // Get user statistics
    const stats = await prisma.user.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    })

    const totalPages = Math.ceil(total / limit)

    log.info('Admin users list accessed', {
      adminId: user.id,
      page,
      limit,
      total,
      filters: { search, role, status },
    })

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        stats: stats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id
          return acc
        }, {} as Record<string, number>),
      },
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    log.error('Admin users list error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
