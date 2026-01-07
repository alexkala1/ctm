import { PrismaClient } from '@prisma/client';

import type { EntityType, AuditAction } from '../../types/tournament';

const prisma = new PrismaClient();

export interface AuditLogData {
  entityType: EntityType;
  entityId: string;
  action: AuditAction;
  oldValue?: unknown;
  newValue?: unknown;
  changedBy: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldValue: data.oldValue ? JSON.stringify(data.oldValue) : undefined,
        newValue: data.newValue ? JSON.stringify(data.newValue) : undefined,
        changedBy: data.changedBy,
        changedAt: new Date(),
      },
    });
  } catch {
    // Log error in development only
    // Don't throw error to avoid breaking the main operation
  }
}

export async function getAuditLogs(entityType?: EntityType, entityId?: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const where = {
    ...(entityType && { entityType }),
    ...(entityId && { entityId }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { changedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export function auditTournamentChange(
  action: AuditAction,
  tournamentId: string,
  oldData: unknown,
  newData: unknown,
  userId: string
) {
  return createAuditLog({
    entityType: 'tournament' as EntityType,
    entityId: tournamentId,
    action,
    oldValue: oldData,
    newValue: newData,
    changedBy: userId,
  });
}

export function auditCompetitorChange(
  action: AuditAction,
  competitorId: string,
  oldData: unknown,
  newData: unknown,
  userId: string
) {
  return createAuditLog({
    entityType: 'competitor' as EntityType,
    entityId: competitorId,
    action,
    oldValue: oldData,
    newValue: newData,
    changedBy: userId,
  });
}

export function auditUserChange(
  action: AuditAction,
  userId: string,
  oldData: unknown,
  newData: unknown,
  changedBy: string
) {
  return createAuditLog({
    entityType: 'user' as EntityType,
    entityId: userId,
    action,
    oldValue: oldData,
    newValue: newData,
    changedBy,
  });
}

export async function getEntityAuditHistory(
  entityType: EntityType,
  entityId: string,
  page: number = 1,
  limit: number = 20
) {
  return getAuditLogs(entityType, entityId, page, limit);
}

export async function getUserActivity(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { changedBy: userId },
      skip,
      take: limit,
      orderBy: { changedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where: { changedBy: userId } }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export async function getRecentActivity(limit: number = 10) {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { changedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function cleanupOldAuditLogs(daysToKeep: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await prisma.auditLog.deleteMany({
    where: {
      changedAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}
