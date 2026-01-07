import { PrismaClient } from '@prisma/client';

import { getCurrentUser } from '../../utils/auth';
import { exportCompetitors } from '../../utils/importExport';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    // Check authentication
    const user = await getCurrentUser(event);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      });
    }

    const body = await readBody(event);
    const { tournamentId, format = 'csv', filename } = body;

    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID is required',
      });
    }

    // Verify tournament exists
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        competitors: {
          orderBy: { personalNumber: 'asc' },
        },
      },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tournament not found',
      });
    }

    // Generate filename if not provided
    const exportFilename =
      filename ||
      `${tournament.name.replace(/[^a-zA-Z0-9]/g, '_')}_participants_${new Date().toISOString().split('T')[0]}`;

    // Transform competitors data to match Competitor type
    const competitorsData = tournament.competitors.map(competitor => ({
      ...competitor,
      team: competitor.team ?? undefined,
      school: competitor.school ?? undefined,
      tournamentDocumentUrl: competitor.tournamentDocumentUrl ?? undefined,
      adminNotes: competitor.adminNotes ?? undefined,
      createdAt: competitor.createdAt.toISOString(),
      updatedAt: competitor.updatedAt.toISOString(),
    }));

    // Export competitors data
    const result = await exportCompetitors(competitorsData, format as 'csv' | 'xlsx' | 'pdf', exportFilename);

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.error || 'Export failed',
      });
    }

    // Set appropriate headers for file download
    const mimeTypes = {
      csv: 'text/csv',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
    };

    const fileExtensions = {
      csv: 'csv',
      xlsx: 'xlsx',
      pdf: 'pdf',
    };

    setHeader(event, 'Content-Type', mimeTypes[format as keyof typeof mimeTypes]);
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="${exportFilename}.${fileExtensions[format as keyof typeof fileExtensions]}"`
    );

    // Return the file data
    if (format === 'csv') {
      return result.data;
    } else if (format === 'xlsx') {
      return Buffer.from(result.data as ArrayBuffer);
    } else if (format === 'pdf') {
      return Buffer.from(result.data as Uint8Array);
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported format',
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    if (process.env.NODE_ENV === 'development') console.error('Export competitors error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
