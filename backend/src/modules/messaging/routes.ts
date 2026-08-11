import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";
import { createNotification } from "../notifications/service";

export const messagingRouter = Router();

// Liste des conversations de l'utilisateur (protege la vie privee : pas de numero
// de telephone du conducteur echange, tout passe par cette messagerie interne)
messagingRouter.get("/conversations", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const items = await prisma.conversation.findMany({
    where: { OR: [{ passengerId: userId }, { driverId: userId }] },
    include: {
      passenger: true,
      driver: true,
      trip: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

messagingRouter.get("/conversations/:id/messages", requireAuth, async (req: AuthedRequest, res) => {
  const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
  if (!conv) throw new ApiError(404, "Conversation introuvable.");
  const userId = req.auth!.userId;
  if (conv.passengerId !== userId && conv.driverId !== userId) throw new ApiError(403, "Acces refuse.");

  const messages = await prisma.message.findMany({
    where: { conversationId: conv.id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ conversation: conv, messages });
});

const sendMessageSchema = z.object({ body: z.string().min(1).max(2000) });

messagingRouter.post("/conversations/:id/messages", requireAuth, validateBody(sendMessageSchema), async (req: AuthedRequest, res) => {
  const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
  if (!conv) throw new ApiError(404, "Conversation introuvable.");
  const userId = req.auth!.userId;
  if (conv.passengerId !== userId && conv.driverId !== userId) throw new ApiError(403, "Acces refuse.");

  const message = await prisma.message.create({
    data: { conversationId: conv.id, senderId: userId, body: req.body.body },
  });

  const recipientId = conv.passengerId === userId ? conv.driverId : conv.passengerId;
  await createNotification({
    userId: recipientId,
    kind: "MESSAGE_RECEIVED",
    title: "Nouveau message",
    body: req.body.body.slice(0, 120),
  });

  res.status(201).json({ message });
});
