import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { createBookingSchema } from "./schemas";
import { ApiError } from "../../middleware/error";
import { estimateCashoutFeeXof, passengerFeeShareXof } from "../../utils/commission";

export const bookingsRouter = Router();

bookingsRouter.post("/", requireAuth, requireRoles("PASSENGER"), validateBody(createBookingSchema), async (req: AuthedRequest, res) => {
  const { tripId, seats } = req.body;
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.status !== "PUBLISHED") throw new ApiError(404, "Trajet indisponible.");
  if (trip.seatsAvailable < seats) throw new ApiError(400, "Pas assez de places disponibles.");

  const tripAmountXof = trip.pricePerSeatXof * seats;
  const cashoutFeeEstimateXof = estimateCashoutFeeXof(tripAmountXof);
  const passengerShare = passengerFeeShareXof(cashoutFeeEstimateXof);
  const totalChargedXof = tripAmountXof + passengerShare;

  const booking = await prisma.booking.create({
    data: {
      tripId,
      passengerId: req.auth!.userId,
      seats,
      pricePerSeatXof: trip.pricePerSeatXof,
      tripAmountXof,
      cashoutFeeEstimateXof,
      passengerFeeShareXof: passengerShare,
      totalChargedXof,
      status: "PENDING_PAYMENT",
    },
  });

  res.status(201).json({ booking });
});

bookingsRouter.get("/mine", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.booking.findMany({
    where: { passengerId: req.auth!.userId },
    include: { trip: true, review: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

bookingsRouter.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { trip: { include: { driver: true } }, transactions: true },
  });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  const isOwner = booking.passengerId === req.auth!.userId || booking.trip.driverId === req.auth!.userId;
  if (!isOwner && !req.auth!.roles.includes("ADMIN")) throw new ApiError(403, "Acces refuse.");
  res.json({ booking });
});

// Trajets a venir avec liste de passagers, cote conducteur
bookingsRouter.get("/trip/:tripId/passengers", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
  if (!trip || trip.driverId !== req.auth!.userId) throw new ApiError(404, "Trajet introuvable.");
  const items = await prisma.booking.findMany({
    where: { tripId: req.params.tripId, status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"] } },
    include: { passenger: true },
  });
  res.json({ items });
});

bookingsRouter.post("/:id/cancel", requireAuth, async (req: AuthedRequest, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id }, include: { trip: true } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.passengerId !== req.auth!.userId) throw new ApiError(403, "Acces refuse.");
  if (booking.status !== "PENDING_PAYMENT" && booking.status !== "CONFIRMED") {
    throw new ApiError(400, "Cette reservation ne peut plus etre annulee.");
  }
  const updated = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED", cancelledAt: new Date() } });
    if (booking.status === "CONFIRMED") {
      await tx.trip.update({ where: { id: booking.tripId }, data: { seatsAvailable: { increment: booking.seats } } });
    }
    return b;
  });
  res.json({ booking: updated });
});
