import { api } from "./client";
import type { Review } from "../types";

export function submitReview(bookingId: string, rating: number, comment?: string) {
  return api.post("/reviews", { bookingId, rating, comment });
}

export function userReviews(userId: string) {
  return api.get<{ items: Review[]; averageRating: number | null }>(`/reviews/user/${userId}`);
}
