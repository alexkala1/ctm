import { z } from 'zod';

import prisma from '../../../lib/prisma';

// Validation schema
const updateCompetitorSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  team: z.string().optional().nullable(),
  ratedPlayerLinks: z.array(z.string()).optional().default([]),
  tournamentDocumentUrl: z.string().url().optional().or(z.literal('')),
  playerAcceptanceStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  adminNotes: z.string().optional().nullable(),
  _delete: z.boolean().optional(),
});

export default defineEventHandler(async event => {
  try {
    const competitorId = getRouterParam(event, 'id');
    const body = await readBody(event);

    if (!competitorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Competitor ID is required',
      });
    }

    // Validate input
    const validatedData = updateCompetitorSchema.parse(body);

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
            categories: true,
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

    // Handle soft delete
    if (validatedData._delete) {
      const deletedCompetitor = await prisma.competitor.update({
        where: { id: competitorId },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
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

      return {
        success: true,
        data: deletedCompetitor,
        message: 'Participant deleted successfully',
      };
    }

    // Validate category is in tournament categories (if provided)
    if (validatedData.category && !existingCompetitor.tournament.categories.includes(validatedData.category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Category "${validatedData.category}" is not available for this tournament`,
      });
    }

    // Prepare update data (only include provided fields)
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (validatedData.firstName !== undefined) updateData.firstName = validatedData.firstName;
    if (validatedData.lastName !== undefined) updateData.lastName = validatedData.lastName;
    if (validatedData.gender !== undefined) updateData.gender = validatedData.gender;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.team !== undefined) updateData.team = validatedData.team ?? null;
    if (validatedData.ratedPlayerLinks !== undefined) updateData.ratedPlayerLinks = validatedData.ratedPlayerLinks;
    if (validatedData.tournamentDocumentUrl !== undefined)
      updateData.tournamentDocumentUrl = validatedData.tournamentDocumentUrl ?? null;
    if (validatedData.playerAcceptanceStatus !== undefined)
      updateData.playerAcceptanceStatus = validatedData.playerAcceptanceStatus;
    if (validatedData.adminNotes !== undefined) updateData.adminNotes = validatedData.adminNotes ?? null;

    // Update competitor
    const updatedCompetitor = await prisma.competitor.update({
      where: { id: competitorId },
      data: updateData,
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

    return {
      success: true,
      data: updatedCompetitor,
      message: 'Participant updated successfully',
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error updating competitor:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: error.issues,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update participant',
    });
  }
});
