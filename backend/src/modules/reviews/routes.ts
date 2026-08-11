import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";

export const reviewsRouter = Router();

const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

reviewsRouter.post("/", requireAuth, validateBody(createReviewSchema), async (req: AuthedRequest, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.body.bookingId }, include: { trip: true } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.status !== "COMPLETED") throw new ApiError(400, "Le trajet doit etre termine pour laisser un avis.");

  const userId = req.auth!.userId;
  const isPassenger = booking.passengerId === userId;
  const isDriver = booking.trip.driverId === userId;
  if (!isPassenger && !isDriver) throw new ApiError(403, "Acces refuse.");

  const toUserId = isPassenger ? booking.trip.driverId : booking.passengerId;

  const review = await prisma.review.upsert({
    where: { bookingId: booking.id },
    update: { rating: req.body.rating, comment: req.body.comment },
    create: { bookingId: booking.id, fromUserId: userId, toUserId, rating: req.body.rating, comment: req.body.comment },
  });

  res.status(201).json({ review });
});

reviewsRouter.get("/user/:userId", async (req, res) => {
  const items = await prisma.review.findMany({
    where: { toUserId: req.params.userId },
    orderBy: { createdAt: "desc" },
  });
  const avg = items.length ? items.reduce((a, r) => a + r.rating, 0) / items.length : null;
  res.json({ items, averageRating: avg });
});
