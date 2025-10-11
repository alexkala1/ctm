import prisma from '../../../../../lib/prisma'
import { getCurrentUser } from '../../../../utils/auth'
import { log } from '../../../../utils/logger'
import { createAuditLog } from '../../../../utils/audit'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(event)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      })
    }

    const userId = getRouterParam(event, 'id')
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      })
    }

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
    })

    if (!currentUserData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    if (currentUserData.status === 'REJECTED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'User is already rejected',
      })
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED',
        approvedBy: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedBy: true,
      },
    })

    // Create audit log
    await createAuditLog({
      entityType: 'User',
      entityId: userId,
      action: 'REJECT',
      oldValue: { status: currentUserData.status },
      newValue: { status: 'REJECTED', approvedBy: user.id },
      changedBy: user.id,
    })

    log.info('User rejected', {
      adminId: user.id,
      targetUserId: userId,
      targetUserEmail: currentUserData.email,
    })

    return {
      success: true,
      data: updatedUser,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    log.error('Reject user error', { error })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
