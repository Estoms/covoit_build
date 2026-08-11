import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";
import { createNotification } from "../notifications/service";
import { recordAdminAction } from "../admin/auditLog";
import { decryptField } from "../../lib/crypto";

export const verificationsRouter = Router();

// --- Conducteur : soumission du casier judiciaire (document deja televerse via /documents) ---
const submitCriminalRecordSchema = z.object({ documentId: z.string().min(1) });

verificationsRouter.post(
  "/driver/criminal-record",
  requireAuth,
  requireRoles("DRIVER"),
  validateBody(submitCriminalRecordSchema),
  async (req: AuthedRequest, res) => {
    const [profile, document] = await Promise.all([
      prisma.driverProfile.findUnique({ where: { userId: req.auth!.userId } }),
      prisma.document.findUnique({ where: { id: req.body.documentId } }),
    ]);
    if (!profile) throw new ApiError(404, "Profil conducteur introuvable.");
    if (!document || document.ownerUserId !== req.auth!.userId) {
      throw new ApiError(403, "Ce document ne t'appartient pas.");
    }
    const updated = await prisma.driverProfile.update({
      where: { userId: req.auth!.userId },
      data: { criminalRecordDocumentId: document.id, criminalRecordSubmittedAt: new Date() },
    });
    res.json({ driverProfile: updated });
  }
);

// --- Conducteur / Passager : statut de verification courant ---
verificationsRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const [user, driverProfile] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.auth!.userId } }),
    prisma.driverProfile.findUnique({ where: { userId: req.auth!.userId } }),
  ]);
  const npi = user?.npiEncrypted ? decryptField(user.npiEncrypted) : undefined;
  res.json({
    passenger: user
      ? { npi, idCardDocumentId: user.idCardDocumentId, complete: !!(npi && user.idCardDocumentId) }
      : null,
    driver: driverProfile,
  });
});

// --- Admin : file d'attente de verification manuelle des conducteurs ---
verificationsRouter.get("/admin/queue", requireAuth, requireRoles("ADMIN"), async (_req, res) => {
  const items = await prisma.driverProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  res.json({ items });
});

const decisionSchema = z.object({ approve: z.boolean(), reason: z.string().optional() });

verificationsRouter.post(
  "/admin/:driverUserId/decision",
  requireAuth,
  requireRoles("ADMIN"),
  validateBody(decisionSchema),
  async (req: AuthedRequest, res) => {
    const { driverUserId } = req.params;
    const status = req.body.approve ? "APPROVED" : "REJECTED";
    const profile = await prisma.driverProfile.update({
      where: { userId: driverUserId },
      data: { verificationStatus: status, verifiedAt: new Date(), verifiedByAdminId: req.auth!.userId },
    });

    await recordAdminAction({
      adminUserId: req.auth!.userId,
      action: req.body.approve ? "DRIVER_VERIFICATION_APPROVED" : "DRIVER_VERIFICATION_REJECTED",
      targetType: "DriverProfile",
      targetId: profile.id,
      metadata: { reason: req.body.reason },
    });

    await createNotification({
      userId: driverUserId,
      kind: "VERIFICATION_UPDATE",
      title: req.body.approve ? "Compte conducteur active" : "Dossier conducteur refuse",
      body: req.body.approve
        ? "Ton dossier a ete verifie et approuve. Tu peux publier des trajets."
        : `Ton dossier a ete refuse. Raison: ${req.body.reason ?? "non precisee"}.`,
    });
    res.json({ driverProfile: profile });
  }
);

const payoutModeSchema = z.object({ payoutModePreference: z.enum(["ADVANCE_THEN_FINAL", "FULL_AT_END"]) });

verificationsRouter.patch(
  "/driver/payout-mode",
  requireAuth,
  requireRoles("DRIVER"),
  validateBody(payoutModeSchema),
  async (req: AuthedRequest, res) => {
    const profile = await prisma.driverProfile.update({
      where: { userId: req.auth!.userId },
      data: { payoutModePreference: req.body.payoutModePreference },
    });
    res.json({ driverProfile: profile });
  }
);

const vehicleSchema = z.object({
  vehicleType: z.string().min(2).optional(),
  vehiclePlate: z.string().optional(),
  licenseDocumentId: z.string().optional(),
});

verificationsRouter.patch(
  "/driver/vehicle",
  requireAuth,
  requireRoles("DRIVER"),
  validateBody(vehicleSchema),
  async (req: AuthedRequest, res) => {
    if (req.body.licenseDocumentId) {
      const doc = await prisma.document.findUnique({ where: { id: req.body.licenseDocumentId } });
      if (!doc || doc.ownerUserId !== req.auth!.userId) {
        throw new ApiError(403, "Ce document ne t'appartient pas.");
      }
    }
    const profile = await prisma.driverProfile.update({
      where: { userId: req.auth!.userId },
      data: req.body,
    });
    res.json({ driverProfile: profile });
  }
);
