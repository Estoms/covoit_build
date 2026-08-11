import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";
import { recordAdminAction } from "../admin/auditLog";

export const supportRouter = Router();

const createTicketSchema = z.object({ subject: z.string().min(3), body: z.string().min(3) });

supportRouter.post("/tickets", requireAuth, validateBody(createTicketSchema), async (req: AuthedRequest, res) => {
  const ticket = await prisma.supportTicket.create({
    data: {
      subject: req.body.subject,
      createdByUserId: req.auth!.userId,
      messages: { create: { authorId: req.auth!.userId, body: req.body.body } },
    },
    include: { messages: true },
  });
  res.status(201).json({ ticket });
});

supportRouter.get("/tickets/mine", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.supportTicket.findMany({
    where: { createdByUserId: req.auth!.userId },
    orderBy: { createdAt: "desc" },
    include: { messages: true },
  });
  res.json({ items });
});

// Console support (agents) : toutes les tickets, filtrables par statut
supportRouter.get("/tickets", requireAuth, requireRoles("SUPPORT", "ADMIN"), async (req, res) => {
  const { status } = req.query as { status?: string };
  const items = await prisma.supportTicket.findMany({
    where: status ? { status: status as any } : undefined,
    include: { createdBy: true, assignedTo: true, messages: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

supportRouter.get("/tickets/:id", requireAuth, async (req: AuthedRequest, res) => {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: req.params.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, createdBy: true, assignedTo: true },
  });
  if (!ticket) throw new ApiError(404, "Ticket introuvable.");
  const isOwner = ticket.createdByUserId === req.auth!.userId;
  const isStaff = req.auth!.roles.includes("SUPPORT") || req.auth!.roles.includes("ADMIN");
  if (!isOwner && !isStaff) throw new ApiError(403, "Acces refuse.");
  res.json({ ticket });
});

const replySchema = z.object({ body: z.string().min(1) });

supportRouter.post("/tickets/:id/messages", requireAuth, validateBody(replySchema), async (req: AuthedRequest, res) => {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
  if (!ticket) throw new ApiError(404, "Ticket introuvable.");
  const message = await prisma.ticketMessage.create({
    data: { ticketId: ticket.id, authorId: req.auth!.userId, body: req.body.body },
  });
  res.status(201).json({ message });
});

const updateStatusSchema = z.object({ status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]) });

supportRouter.patch(
  "/tickets/:id/status",
  requireAuth,
  requireRoles("SUPPORT", "ADMIN"),
  validateBody(updateStatusSchema),
  async (req: AuthedRequest, res) => {
    const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    await recordAdminAction({
      adminUserId: req.auth!.userId,
      action: "SUPPORT_TICKET_STATUS_CHANGED",
      targetType: "SupportTicket",
      targetId: ticket.id,
      metadata: { status: req.body.status },
    });
    res.json({ ticket });
  }
);
