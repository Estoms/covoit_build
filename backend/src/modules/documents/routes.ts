import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";
import { env } from "../../config/env";
import { extensionForMime, isAllowedMime, objectStorage } from "./storage";

export const documentsRouter = Router();

const uploadSchema = z.object({
  kind: z.enum(["ID_CARD", "DRIVER_LICENSE", "CRIMINAL_RECORD"]),
  mimeType: z.string(),
  base64Data: z.string(),
});

/**
 * Televersement d'un document sensible. Le fichier est ecrit dans le stockage
 * prive (jamais expose par une URL publique) et seule une reference opaque
 * (documentId) est renvoyee au client pour etre associee au profil.
 */
documentsRouter.post("/", requireAuth, validateBody(uploadSchema), async (req: AuthedRequest, res) => {
  const { kind, mimeType, base64Data } = req.body;

  if (!isAllowedMime(mimeType)) {
    throw new ApiError(400, "Type de fichier non autorise (jpeg, png, webp, pdf uniquement).");
  }

  const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ""), "base64");
  if (buffer.length > env.documentsMaxSizeBytes) {
    throw new ApiError(400, `Fichier trop volumineux (max ${Math.round(env.documentsMaxSizeBytes / 1024 / 1024)} Mo).`);
  }

  const storageKey = await objectStorage.put(buffer, extensionForMime(mimeType));

  const document = await prisma.document.create({
    data: {
      ownerUserId: req.auth!.userId,
      kind,
      storageKey,
      mimeType,
      sizeBytes: buffer.length,
    },
  });

  res.status(201).json({ documentId: document.id });
});

/**
 * Telechargement d'un document : reserve au proprietaire ou a un admin/support
 * (pour la moderation). Jamais accessible sans authentification.
 */
documentsRouter.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
  if (!doc) throw new ApiError(404, "Document introuvable.");

  const isOwner = doc.ownerUserId === req.auth!.userId;
  const isStaff = req.auth!.roles.includes("ADMIN") || req.auth!.roles.includes("SUPPORT");
  if (!isOwner && !isStaff) throw new ApiError(403, "Acces refuse.");

  const buffer = await objectStorage.get(doc.storageKey);
  res.setHeader("Content-Type", doc.mimeType);
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("Cache-Control", "private, no-store");
  res.send(buffer);
});

documentsRouter.delete("/:id", requireAuth, requireRoles("ADMIN"), async (req, res) => {
  const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
  if (!doc) throw new ApiError(404, "Document introuvable.");
  await objectStorage.delete(doc.storageKey);
  await prisma.document.delete({ where: { id: doc.id } });
  res.json({ ok: true });
});
