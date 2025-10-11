import prisma from '../../../lib/prisma'
import { getCurrentUser, requireAuth, requireAdmin } from '../../utils/auth'
import { createTournamentSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    requireAuth(user)
    requireAdmin(user!)

    const tournamentId = getRouterParam(event, 'id')
    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      })
    }

    const body = await readBody(event)
    const validatedData = createTournamentSchema.parse(body)

    // Check if tournament exists and is not soft deleted
    const existingTournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
        deletedAt: null, // Only find non-deleted tournaments
      },
    })

    if (!existingTournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      })
    }

    // Check if another tournament with the same name exists (excluding current one and soft-deleted ones)
    const duplicateTournament = await prisma.tournament.findFirst({
      where: {
        name: validatedData.name,
        id: { not: tournamentId },
        deletedAt: null, // Only check non-deleted tournaments
      },
    })

    if (duplicateTournament) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament with this name already exists',
      })
    }

    // Update tournament
    const tournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        ...validatedData,
        // Don't update createdBy - keep original creator
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            competitors: true,
          },
        },
      },
    })

    return {
      success: true,
      data: tournament,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Update tournament error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update tournament',
    })
  }
})
