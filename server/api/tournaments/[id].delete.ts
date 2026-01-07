import prisma from '../../../lib/prisma';
import { getCurrentUser, requireAuth, requireAdmin } from '../../utils/auth';

export default defineEventHandler(async event => {
  try {
    const user = await getCurrentUser(event);
    requireAuth(user);
    requireAdmin(user!);

    const tournamentId = getRouterParam(event, 'id');
    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      });
    }

    // Check if tournament exists and is not already soft deleted
    const existingTournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
        deletedAt: null, // Only find non-deleted tournaments
      },
    });

    if (!existingTournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      });
    }

    // Soft delete tournament by setting deletedAt timestamp
    const deletedTournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        deletedAt: new Date(),
      },
    });

    // Create audit log for the soft delete
    await prisma.auditLog.create({
      data: {
        entityType: 'Tournament',
        entityId: tournamentId,
        action: 'SOFT_DELETE',
        oldValue: {
          name: existingTournament.name,
          status: existingTournament.status,
          deletedAt: null,
        },
        newValue: {
          name: existingTournament.name,
          status: existingTournament.status,
          deletedAt: deletedTournament.deletedAt,
        },
        changedBy: user!.id,
      },
    });

    return {
      success: true,
      message: 'Tournament deleted successfully',
      deletedAt: deletedTournament.deletedAt,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    if (process.env.NODE_ENV === 'development') console.error('Delete tournament error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete tournament',
    });
  }
});
