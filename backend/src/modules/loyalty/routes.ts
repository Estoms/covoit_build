import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { ApiError } from "../../middleware/error";

export const loyaltyRouter = Router();

const REWARD_TIERS = [
  { threshold: 50, label: "Trajet gratuit" },
  { threshold: 20, label: "Ticket valeur partenaire" },
];

loyaltyRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const account = await prisma.loyaltyAccount.upsert({
    where: { userId: req.auth!.userId },
    update: {},
    create: { userId: req.auth!.userId },
    include: { redemptions: true },
  });
  const nextTier = REWARD_TIERS.filter((t) => t.threshold > account.points).sort((a, b) => a.threshold - b.threshold)[0];
  res.json({ account, tiers: REWARD_TIERS, nextTier });
});

loyaltyRouter.post("/redeem", requireAuth, async (req: AuthedRequest, res) => {
  const { label, pointsSpent } = req.body as { label: string; pointsSpent: number };
  const account = await prisma.loyaltyAccount.findUnique({ where: { userId: req.auth!.userId } });
  if (!account || account.points < pointsSpent) throw new ApiError(400, "Points insuffisants.");

  const updated = await prisma.$transaction(async (tx) => {
    const acc = await tx.loyaltyAccount.update({
      where: { userId: req.auth!.userId },
      data: { points: { decrement: pointsSpent } },
    });
    const redemption = await tx.loyaltyRedemption.create({
      data: { accountId: account.id, label, pointsSpent },
    });
    return { acc, redemption };
  });

  res.status(201).json(updated);
});
