import prisma from '../../lib/prisma';

export default defineEventHandler(async event => {
  try {
    const query = getQuery(event);
    const tournamentId = query.tournamentId as string;

    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      });
    }

    // Verify tournament exists and is not deleted
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
        deletedAt: null,
      },
      select: { id: true, name: true },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      });
    }

    // Get all competitors for the tournament
    const competitors = await prisma.competitor.findMany({
      where: {
        tournamentId: tournamentId,
        deletedAt: null,
      },
      orderBy: [{ personalNumber: 'asc' }],
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
    });

    if (process.env.NODE_ENV === 'development')
      console.log(`Found ${competitors.length} competitors for tournament ${tournamentId}`);

    return {
      success: true,
      data: competitors,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching competitors:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch competitors',
    });
  }
});
