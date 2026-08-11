import { z } from "zod";

export const createTripSchema = z.object({
  fromCity: z.string().min(2),
  fromPoint: z.string().min(2),
  toCity: z.string().min(2),
  toPoint: z.string().min(2),
  departAt: z.string(), // ISO datetime
  pricePerSeatXof: z.number().int().positive(),
  seatsTotal: z.number().int().min(1).max(8),
  vehicleLabel: z.string().optional(),
});

export const searchTripsSchema = z.object({
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  date: z.string().optional(), // YYYY-MM-DD
});
