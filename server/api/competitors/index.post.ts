import { z } from 'zod'

import prisma from '../../../lib/prisma'
import { getCurrentUser } from '../../utils/auth'

// Validation schema
const createCompetitorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  category: z.string().min(1, 'Category is required'),
  team: z.string().optional().or(z.null()),
  ratedPlayerLinks: z.array(z.string()).optional().default([]),
  tournamentDocumentUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success,
      {
        message: 'Must be a valid URL or empty',
      }
    )
    .or(z.null()),
  playerAcceptanceStatus: z
    .enum(['PENDING', 'APPROVED', 'REJECTED'])
    .default('PENDING'),
  adminNotes: z.string().optional().or(z.null()),
  tournamentId: z.string().min(1, 'Tournament ID is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    const validatedData = createCompetitorSchema.parse(body)

    // Check if user is authenticated (optional for participant registration)
    const user = await getCurrentUser(event)
    const isAdmin = user
      ? user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      : false

    // Verify tournament exists and is not deleted
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: validatedData.tournamentId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        status: true,
        categories: true,
        hasTeams: true,
      },
    })

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      })
    }

    // Check if tournament is open for registration (admins can bypass this)
    if (tournament.status !== 'OPEN' && !isAdmin) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament is not open for registration',
      })
    }

    // Validate category is in tournament categories
    if (!tournament.categories.includes(validatedData.category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Category "${validatedData.category}" is not available for this tournament`,
      })
    }

    // Get the next personal number for this tournament
    const lastCompetitor = await prisma.competitor.findFirst({
      where: {
        tournamentId: validatedData.tournamentId,
        deletedAt: null,
      },
      orderBy: {
        personalNumber: 'desc',
      },
      select: {
        personalNumber: true,
      },
    })

    const nextPersonalNumber = (lastCompetitor?.personalNumber ?? 0) + 1

    // Check if name combination is unique within the tournament
    const existingName = await prisma.competitor.findFirst({
      where: {
        tournamentId: validatedData.tournamentId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        deletedAt: null,
      },
    })

    if (existingName) {
      throw createError({
        statusCode: 400,
        statusMessage: `A participant with the name "${validatedData.firstName} ${validatedData.lastName}" already exists in this tournament`,
      })
    }

    // Create competitor
    const competitor = await prisma.competitor.create({
      data: {
        ...validatedData,
        personalNumber: nextPersonalNumber,
        tournamentDocumentUrl: validatedData.tournamentDocumentUrl ?? null,
        adminNotes: validatedData.adminNotes ?? null,
        team: validatedData.team ?? null,
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
    })

    return {
      success: true,
      data: competitor,
      message: 'Participant added successfully',
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create participant',
    })
  }
})
