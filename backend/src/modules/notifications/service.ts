import { prisma } from "../../lib/prisma";
import type { NotificationKind } from "@prisma/client";

export async function createNotification(params: {
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
}) {
  return prisma.notification.create({ data: params });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function markNotificationRead(userId: string, id: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
}
