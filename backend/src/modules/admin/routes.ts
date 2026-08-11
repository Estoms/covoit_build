import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { toPublicUser } from "../users/mapper";
import { ApiError } from "../../middleware/error";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRoles("ADMIN"));

adminRouter.get("/users", async (req, res) => {
  const { role } = req.query as { role?: string };
  const users = await prisma.user.findMany({
    where: role ? { roles: { some: { role: role as any } } } : undefined,
    include: { roles: true, driverProfile: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json({ items: users.map(toPublicUser) });
});

adminRouter.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { roles: true, driverProfile: true, wallet: true, loyaltyAccount: true },
  });
  if (!user) throw new ApiError(404, "Utilisateur introuvable.");
  res.json({
    user: toPublicUser(user),
    driverProfile: user.driverProfile,
    wallet: user.wallet,
    loyaltyAccount: user.loyaltyAccount,
  });
});

adminRouter.get("/trips", async (_req, res) => {
  const trips = await prisma.trip.findMany({
    include: { driver: true, bookings: true },
    orderBy: { departAt: "desc" },
    take: 200,
  });
  res.json({ items: trips });
});

adminRouter.get("/transactions", async (_req, res) => {
  const items = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { booking: true },
  });
  res.json({ items });
});

adminRouter.get("/stats/global", async (_req, res) => {
  const [userCount, driverCount, tripCount, bookingCount, completedBookings, transactions] = await Promise.all([
    prisma.user.count(),
    prisma.driverProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.trip.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.transaction.findMany({ where: { status: "SUCCESS" } }),
  ]);
  const totalVolumeXof = transactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amountXof, 0);
  res.json({
    userCount,
    verifiedDriverCount: driverCount,
    tripCount,
    bookingCount,
    completedBookings,
    totalVolumeXof,
  });
});

adminRouter.get("/disputes", async (_req, res) => {
  // Litiges = tickets de support lies a une reservation, non resolus
  const items = await prisma.supportTicket.findMany({
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    include: { createdBy: true, messages: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

adminRouter.get("/audit-log", async (_req, res) => {
  const items = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json({ items });
});
