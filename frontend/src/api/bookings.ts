import { api } from "./client";
import type { Booking } from "../types";

export function createBooking(tripId: string, seats: number) {
  return api.post<{ booking: Booking }>("/bookings", { tripId, seats });
}

export function myBookings() {
  return api.get<{ items: Booking[] }>("/bookings/mine");
}

export function getBooking(id: string) {
  return api.get<{ booking: Booking }>(`/bookings/${id}`);
}

export function cancelBooking(id: string) {
  return api.post<{ booking: Booking }>(`/bookings/${id}/cancel`);
}

export function tripPassengers(tripId: string) {
  return api.get<{ items: Booking[] }>(`/bookings/trip/${tripId}/passengers`);
}
