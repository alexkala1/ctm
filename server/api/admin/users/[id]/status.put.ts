import prisma from '../../../../../lib/prisma';
import { getCurrentUser } from '../../../../utils/auth';
import { log } from '../../../../utils/logger';
import { createAuditLog } from '../../../../utils/audit';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']),
});

export default defineEventHandler(async event => {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(event);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      });
    }

    const userId = getRouterParam(event, 'id');
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    const body = await readBody(event);
    const validatedData = updateStatusSchema.parse(body);

    // Get current user data
    const currentUserData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: true,
      },
    });

    if (!currentUserData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    if (currentUserData.status === validatedData.status) {
      throw createError({
        statusCode: 400,
        statusMessage: `User status is already ${validatedData.status}`,
      });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status: validatedData.status,
    };

    // Set approval data if approving
    if (validatedData.status === 'APPROVED') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = user.id;
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedAt: true,
        approvedBy: true,
      },
    });

    // Create audit log
    await createAuditLog({
      entityType: 'User',
      entityId: userId,
      action: 'UPDATE_STATUS',
      oldValue: { status: currentUserData.status },
      newValue: { status: validatedData.status, ...updateData },
      changedBy: user.id,
    });

    log.info('User status updated', {
      adminId: user.id,
      targetUserId: userId,
      targetUserEmail: currentUserData.email,
      oldStatus: currentUserData.status,
      newStatus: validatedData.status,
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    log.error('Update user status error', { error });
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
