import { z } from "zod";

export const createBookingSchema = z.object({
  tripId: z.string(),
  seats: z.number().int().min(1).max(4),
});
