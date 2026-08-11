import { prisma } from "../../lib/prisma";

export async function recordAdminAction(params: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: unknown;
}) {
  await prisma.adminAuditLog.create({
    data: {
      adminUserId: params.adminUserId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    },
  });
}
