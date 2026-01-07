import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(process.env.NUXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default defineEventHandler(async event => {
  try {
    const tournamentId = getRouterParam(event, 'id');
    const competitorId = getRouterParam(event, 'competitorId');

    if (!tournamentId || !competitorId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tournament ID and Competitor ID are required',
      });
    }

    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
    }

    const filePart = form.find(p => p.name === 'file' && p.data);
    if (!filePart?.filename || !filePart.type || !filePart.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file payload',
      });
    }

    // Basic validation
    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ]);
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.has(filePart.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported file type',
      });
    }
    if (filePart.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File exceeds 5MB limit',
      });
    }

    // Ensure competitor exists and belongs to tournament
    const competitor = await prisma.competitor.findFirst({
      where: { id: competitorId, tournamentId },
    });
    if (!competitor) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Competitor not found in this tournament',
      });
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const sanitizedName = filePart.filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
    const filename = `${timestamp}-${sanitizedName}`;
    const path = `tournaments/${tournamentId}/competitors/${competitorId}/${filename}`;

    const { error: uploadError } = await supabase.storage.from('tournament-documents').upload(path, filePart.data, {
      contentType: filePart.type,
      upsert: false,
    });

    if (uploadError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Upload failed: ${uploadError.message}`,
      });
    }

    const { data: urlData } = supabase.storage.from('tournament-documents').getPublicUrl(path);

    // Persist URL on competitor
    const updated = await prisma.competitor.update({
      where: { id: competitorId },
      data: { tournamentDocumentUrl: urlData.publicUrl, updatedAt: new Date() },
    });

    return {
      success: true,
      data: { url: urlData.publicUrl, competitor: updated },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error uploading competitor document:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload document',
    });
  } finally {
    await prisma.$disconnect();
  }
});
