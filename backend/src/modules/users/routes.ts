import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { toPublicUser } from "./mapper";
import { ApiError } from "../../middleware/error";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";
import { encryptField } from "../../lib/crypto";
import { revokeAllUserSessions } from "../auth/refreshTokens";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    include: { roles: true, driverProfile: true },
  });
  if (!user || user.deletedAt) throw new ApiError(404, "Utilisateur introuvable.");
  res.json({ user: toPublicUser(user) });
});

const updateMeSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
  npi: z.string().min(4).optional(),
  idCardDocumentId: z.string().optional(),
});

usersRouter.patch("/me", requireAuth, validateBody(updateMeSchema), async (req: AuthedRequest, res) => {
  const { npi, idCardDocumentId, ...rest } = req.body as z.infer<typeof updateMeSchema>;

  if (idCardDocumentId) {
    const doc = await prisma.document.findUnique({ where: { id: idCardDocumentId } });
    if (!doc || doc.ownerUserId !== req.auth!.userId) {
      throw new ApiError(403, "Ce document ne t'appartient pas.");
    }
  }

  const user = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: {
      ...rest,
      npiEncrypted: npi ? encryptField(npi) : undefined,
      idCardDocumentId,
    },
    include: { roles: true, driverProfile: true },
  });
  res.json({ user: toPublicUser(user) });
});

/** Profil public minimal, sans aucune donnee sensible (utilise sur les pages de trajet/avis). */
usersRouter.get("/:id/public", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user || user.deletedAt) throw new ApiError(404, "Utilisateur introuvable.");
  res.json({
    user: { id: user.id, fullName: user.fullName, avatarUrl: user.avatarUrl, createdAt: user.createdAt },
  });
});

/**
 * Droit a l'effacement (reglementation beninoise sur les donnees personnelles) :
 * suppression logique + anonymisation des champs identifiants, revocation de
 * toutes les sessions actives. On conserve l'enregistrement (id) pour ne pas
 * casser l'integrite des trajets/reservations/transactions passees.
 */
usersRouter.delete("/me", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      fullName: "Utilisateur supprime",
      email: null,
      phone: `deleted-${userId}`,
      npiEncrypted: null,
      idCardDocumentId: null,
      address: null,
      avatarUrl: null,
      passwordHash: "",
    },
  });
  await revokeAllUserSessions(userId);
  res.json({ ok: true });
});
