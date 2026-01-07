import prisma from '../../../lib/prisma';
import { getCurrentUser, requireAuth, requireAdmin } from '../../utils/auth';
import { createTournamentSchema } from '../../utils/validation';

export default defineEventHandler(async event => {
  try {
    const user = await getCurrentUser(event);
    requireAuth(user);
    requireAdmin(user!);

    const body = await readBody(event);
    const validatedData = createTournamentSchema.parse(body);

    // Check if tournament name already exists
    const existingTournament = await prisma.tournament.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTournament) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament with this name already exists',
      });
    }

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        ...validatedData,
        createdBy: user!.id,
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
    });

    return {
      success: true,
      data: tournament,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    if (process.env.NODE_ENV === 'development') console.error('Create tournament error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create tournament',
    });
  }
});
