import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { createTripSchema } from "./schemas";
import { ApiError } from "../../middleware/error";
import { computeAlgoPriorityScore } from "../../utils/commission";

export const tripsRouter = Router();

// Recherche publique de trajets, triee par priorite algorithme (levier 2)
tripsRouter.get("/", async (req, res) => {
  const { fromCity, toCity, date } = req.query as { fromCity?: string; toCity?: string; date?: string };

  const where: any = { status: "PUBLISHED", seatsAvailable: { gt: 0 } };
  if (fromCity) where.fromCity = { contains: fromCity, mode: "insensitive" };
  if (toCity) where.toCity = { contains: toCity, mode: "insensitive" };
  if (date) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);
    where.departAt = { gte: start, lte: end };
  }

  const trips = await prisma.trip.findMany({
    where,
    include: {
      driver: { include: { driverProfile: true, driverRewardProfile: true, reviewsReceived: true } },
    },
    orderBy: { departAt: "asc" },
  });

  const ranked = trips
    .map((t) => {
      const ratings = t.driver.reviewsReceived.map((r) => r.rating);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.5;
      const score = computeAlgoPriorityScore({
        averageRating: avgRating,
        tripsThisMonth: t.driver.driverRewardProfile?.tripsThisMonth ?? 0,
        isVerified: t.driver.driverProfile?.verificationStatus === "APPROVED",
      });
      return {
        id: t.id,
        fromCity: t.fromCity,
        fromPoint: t.fromPoint,
        toCity: t.toCity,
        toPoint: t.toPoint,
        departAt: t.departAt,
        pricePerSeatXof: t.pricePerSeatXof,
        seatsAvailable: t.seatsAvailable,
        vehicleLabel: t.vehicleLabel,
        driver: { id: t.driver.id, fullName: t.driver.fullName, avgRating: Math.round(avgRating * 10) / 10 },
        priorityScore: score,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  res.json({ items: ranked });
});

tripsRouter.get("/:id", async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: { driver: { include: { driverProfile: true, reviewsReceived: true } } },
  });
  if (!trip) throw new ApiError(404, "Trajet introuvable.");
  res.json({ trip });
});

tripsRouter.post("/", requireAuth, requireRoles("DRIVER"), validateBody(createTripSchema), async (req: AuthedRequest, res) => {
  const driverProfile = await prisma.driverProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!driverProfile || driverProfile.verificationStatus !== "APPROVED") {
    throw new ApiError(403, "Ton dossier conducteur doit etre verifie par un administrateur avant de publier un trajet.");
  }
  const body = req.body;
  const trip = await prisma.trip.create({
    data: {
      driverId: req.auth!.userId,
      fromCity: body.fromCity,
      fromPoint: body.fromPoint,
      toCity: body.toCity,
      toPoint: body.toPoint,
      departAt: new Date(body.departAt),
      pricePerSeatXof: body.pricePerSeatXof,
      seatsTotal: body.seatsTotal,
      seatsAvailable: body.seatsTotal,
      vehicleLabel: body.vehicleLabel,
    },
  });
  res.status(201).json({ trip });
});

tripsRouter.get("/mine/list", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const trips = await prisma.trip.findMany({
    where: { driverId: req.auth!.userId },
    orderBy: { departAt: "desc" },
    include: { bookings: true },
  });
  res.json({ items: trips });
});

tripsRouter.post("/:id/cancel", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  if (!trip || trip.driverId !== req.auth!.userId) throw new ApiError(404, "Trajet introuvable.");
  const updated = await prisma.trip.update({ where: { id: trip.id }, data: { status: "CANCELLED" } });
  res.json({ trip: updated });
});
