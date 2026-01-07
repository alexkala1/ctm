import prisma from '../../../lib/prisma';

export default defineEventHandler(async event => {
  try {
    const competitorId = getRouterParam(event, 'id');

    if (!competitorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Competitor ID is required',
      });
    }

    // Verify competitor exists and is not deleted
    const existingCompetitor = await prisma.competitor.findUnique({
      where: {
        id: competitorId,
        deletedAt: null,
      },
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

    if (!existingCompetitor) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Competitor not found',
      });
    }

    // Soft delete competitor
    await prisma.competitor.update({
      where: { id: competitorId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Participant deleted successfully',
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error deleting competitor:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete participant',
    });
  }
});
