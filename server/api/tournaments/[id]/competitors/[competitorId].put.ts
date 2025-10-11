import prisma from '../../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const tournamentId = getRouterParam(event, 'id')
    const competitorId = getRouterParam(event, 'competitorId')
    const body = await readBody(event)

    if (!tournamentId || !competitorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID and Competitor ID are required',
      })
    }

    // Check if this is a delete request
    if (body._delete) {
      // Verify tournament exists and is not deleted
      const tournament = await prisma.tournament.findUnique({
        where: {
          id: tournamentId,
          deletedAt: null,
        },
        select: { id: true, name: true },
      })

      if (!tournament) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Tournament not found',
        })
      }

      // Verify competitor exists and belongs to this tournament
      const existingCompetitor = await prisma.competitor.findFirst({
        where: {
          id: competitorId,
          tournamentId: tournamentId,
          deletedAt: null,
        },
      })

      if (!existingCompetitor) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Competitor not found in this tournament',
        })
      }

      // Soft delete competitor
      await prisma.competitor.update({
        where: { id: competitorId },
        data: { deletedAt: new Date() },
      })

      return {
        success: true,
        message: 'Competitor deleted successfully',
      }
    }

    // Update competitor
    // Verify tournament exists and is not deleted
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
        deletedAt: null,
      },
      select: { id: true, name: true },
    })

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      })
    }

    // Verify competitor exists and belongs to this tournament
    const existingCompetitor = await prisma.competitor.findFirst({
      where: {
        id: competitorId,
        tournamentId: tournamentId,
        deletedAt: null,
      },
    })

    if (!existingCompetitor) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Competitor not found in this tournament',
      })
    }

    // Update competitor
    const updatedCompetitor = await prisma.competitor.update({
      where: { id: competitorId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return {
      success: true,
      data: updatedCompetitor,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Error updating/deleting competitor:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update/delete competitor',
    })
  }
})
