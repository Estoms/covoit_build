import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { computeCommissionRatePercent, computeOperationalPack } from "../../utils/commission";

export const driverRewardsRouter = Router();

/**
 * Tableau de bord des 4 leviers de gratification conducteur :
 * 1) commission degressive, 2) priorite algo, 3) zero frais cash-out,
 * 4) pass data & recharge (3 et 4 forment un seul "pack cout operationnel").
 */
driverRewardsRouter.get("/me", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const monthKey = new Date().toISOString().slice(0, 7);
  let profile = await prisma.driverRewardProfile.upsert({
    where: { userId: req.auth!.userId },
    update: {},
    create: { userId: req.auth!.userId, monthKey },
  });
  if (profile.monthKey !== monthKey) {
    profile = await prisma.driverRewardProfile.update({
      where: { userId: req.auth!.userId },
      data: { monthKey, tripsThisMonth: 0 },
    });
  }

  const projectedNextCommission = computeCommissionRatePercent(profile.tripsThisMonth + 1);
  const pack = computeOperationalPack(profile.tripsThisMonth);

  res.json({
    tripsThisMonth: profile.tripsThisMonth,
    commissionRatePercent: profile.commissionRatePercent,
    projectedNextCommissionRatePercent: projectedNextCommission,
    algoPriorityScore: profile.algoPriorityScore,
    operationalPack: {
      cashoutFeeWaiverActive: pack.cashoutFeeWaiverActive,
      dataPassEligible: pack.dataPassEligible,
      note: "Les avantages 'zero frais cash-out' et 'pass data' partagent le meme palier de declenchement pour eviter le cumul (cf. remarque du cahier des charges).",
    },
  });
});
