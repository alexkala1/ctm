import prisma from '../../../lib/prisma'
import { getCurrentUser, requireAuth, requireAdmin } from '../../utils/auth'

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

    // Check if tournament exists and is soft deleted
    const existingTournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
        deletedAt: { not: null }, // Only find soft-deleted tournaments
      },
    })

    if (!existingTournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Soft-deleted tournament not found',
      })
    }

    // Check if another tournament with the same name exists (excluding soft-deleted ones)
    const duplicateTournament = await prisma.tournament.findFirst({
      where: {
        name: existingTournament.name,
        id: { not: tournamentId },
        deletedAt: null, // Only check non-deleted tournaments
      },
    })

    if (duplicateTournament) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'A tournament with this name already exists. Please rename the tournament before restoring.',
      })
    }

    // Restore tournament by setting deletedAt to null
    const restoredTournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        deletedAt: null,
      },
    })

    // Create audit log for the restore
    await prisma.auditLog.create({
      data: {
        entityType: 'Tournament',
        entityId: tournamentId,
        action: 'RESTORE',
        oldValue: {
          name: existingTournament.name,
          status: existingTournament.status,
          deletedAt: existingTournament.deletedAt,
        },
        newValue: {
          name: existingTournament.name,
          status: existingTournament.status,
          deletedAt: null,
        },
        changedBy: user!.id,
      },
    })

    return {
      success: true,
      message: 'Tournament restored successfully',
      data: restoredTournament,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Restore tournament error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to restore tournament',
    })
  }
})
