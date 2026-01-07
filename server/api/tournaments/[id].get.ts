import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../utils/auth';

export default defineEventHandler(async event => {
  try {
    const tournamentId = getRouterParam(event, 'id');

    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      });
    }

    // Get current user to determine visibility rules
    const user = await getCurrentUser(event);

    // Build where clause based on user role
    const whereClause: Record<string, unknown> = {
      id: tournamentId,
      deletedAt: null, // Only fetch non-deleted tournaments
    };

    // If user is not authenticated or not an admin, only show OPEN and IN_PROGRESS tournaments
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      whereClause.status = {
        in: ['OPEN', 'IN_PROGRESS'],
      };
    }

    // Get tournament by ID with visibility rules
    const tournament = await prisma.tournament.findUnique({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      });
    }

    return {
      success: true,
      data: tournament,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') console.error('Fetch tournament error:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tournament',
    });
  }
});
