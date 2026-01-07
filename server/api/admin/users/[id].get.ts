import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../utils/auth';
import { log } from '../../../utils/logger';

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

    // Get user details
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatarUrl: true,
        provider: true,
        providerId: true,
        lastLoginAt: true,
        approvedAt: true,
        approvedBy: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        createdAt: true,
        updatedAt: true,
        createdTournaments: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 tournaments
        },
        auditLogs: {
          select: {
            id: true,
            entityType: true,
            entityId: true,
            action: true,
            oldValue: true,
            newValue: true,
            changedAt: true,
          },
          orderBy: { changedAt: 'desc' },
          take: 20, // Last 20 audit logs
        },
        _count: {
          select: {
            createdTournaments: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!userDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    // Get who approved this user (if applicable)
    let approvedByUser = null;
    if (userDetails.approvedBy) {
      approvedByUser = await prisma.user.findUnique({
        where: { id: userDetails.approvedBy },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }

    log.info('Admin user details accessed', {
      adminId: user.id,
      targetUserId: userId,
    });

    return {
      success: true,
      data: {
        ...userDetails,
        approvedByUser,
      },
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    log.error('Admin user details error', { error });
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
