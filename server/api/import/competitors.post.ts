import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { getCurrentUser } from '../../utils/auth'
import {
  importFromCSV,
  importFromExcel,
  createCompetitorImportSchema,
  validateImportFile,
} from '../../utils/importExport'

const prisma = new PrismaClient()

// Zod schema for competitor validation
const competitorSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Gender must be MALE or FEMALE' }),
  }),
  category: z.string().min(1, 'Category is required'),
  team: z.string().optional(),
  school: z.string().optional(),
  adminNotes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const user = await getCurrentUser(event)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      })
    }

    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    const filePart = form.find((p) => p.name === 'file' && p.data)
    const tournamentIdPart = form.find(
      (p) => p.name === 'tournamentId' && p.data
    )

    if (!filePart?.filename || !filePart.type || !filePart.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file payload',
      })
    }

    if (!tournamentIdPart?.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      })
    }

    const tournamentId = tournamentIdPart.data.toString()

    // Verify tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    })

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      })
    }

    // Create file object for validation
    const file = new File([filePart.data], filePart.filename, {
      type: filePart.type,
    })

    // Validate file
    const fileValidation = validateImportFile(file)
    if (!fileValidation.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: fileValidation.error,
      })
    }

    // Parse file based on type
    let importResult
    if (filePart.type === 'text/csv') {
      importResult = await importFromCSV(file, createCompetitorImportSchema())
    } else if (
      filePart.type.includes('sheet') ||
      filePart.type.includes('excel')
    ) {
      importResult = await importFromExcel(file, createCompetitorImportSchema())
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported file type. Please use CSV or Excel files.',
      })
    }

    if (!importResult.success) {
      return {
        success: false,
        message: 'Import failed due to validation errors',
        errors: importResult.errors,
        warnings: importResult.warnings,
        imported: importResult.imported,
      }
    }

    // Get existing competitors to determine next personal number
    const existingCompetitors = await prisma.competitor.findMany({
      where: { tournamentId },
      orderBy: { personalNumber: 'desc' },
      take: 1,
    })

    let nextPersonalNumber =
      existingCompetitors.length > 0
        ? existingCompetitors[0].personalNumber + 1
        : 1

    // Import valid competitors
    const competitorsToCreate = []
    const importErrors = []

    for (let i = 0; i < importResult.imported; i++) {
      try {
        const competitorData = importResult.data[i]
        const validatedData = competitorSchema.parse(competitorData)

        // Check for duplicate names in the same tournament
        const existingCompetitor = await prisma.competitor.findFirst({
          where: {
            tournamentId,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
          },
        })

        if (existingCompetitor) {
          importErrors.push({
            row: i + 1,
            field: 'name',
            message:
              'A competitor with this name already exists in this tournament',
            value: `${validatedData.firstName} ${validatedData.lastName}`,
          })
          continue
        }

        competitorsToCreate.push({
          tournamentId,
          personalNumber: nextPersonalNumber++,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          gender: validatedData.gender,
          category: validatedData.category,
          team: validatedData.team ?? null,
          school: validatedData.school ?? null,
          adminNotes: validatedData.adminNotes ?? null,
          playerAcceptanceStatus: 'PENDING' as const,
        })
      } catch (error: unknown) {
        importErrors.push({
          row: i + 1,
          field: 'validation',
          message: error.message || 'Validation error',
          value: JSON.stringify(competitorData),
        })
      }
    }

    // Create competitors in database
    if (competitorsToCreate.length > 0) {
      await prisma.competitor.createMany({
        data: competitorsToCreate,
      })
    }

    return {
      success: true,
      message: `Successfully imported ${competitorsToCreate.length} competitors`,
      imported: competitorsToCreate.length,
      errors: importErrors,
      warnings: importResult.warnings,
      totalProcessed: importResult.imported + importErrors.length,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (process.env.NODE_ENV === 'development')
      console.error('Import competitors error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
