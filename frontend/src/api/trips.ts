import { api } from "./client";
import type { AdminTrip, Trip } from "../types";

export function searchTrips(params: { fromCity?: string; toCity?: string; date?: string }) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => !!v) as [string, string][]).toString();
  return api.get<{ items: Trip[] }>(`/trips${qs ? `?${qs}` : ""}`);
}

export function getTrip(id: string) {
  return api.get<{ trip: Trip }>(`/trips/${id}`);
}

export function createTrip(input: {
  fromCity: string; fromPoint: string; toCity: string; toPoint: string;
  departAt: string; pricePerSeatXof: number; seatsTotal: number; vehicleLabel?: string;
}) {
  return api.post<{ trip: Trip }>("/trips", input);
}

export function myTrips() {
  return api.get<{ items: AdminTrip[] }>("/trips/mine/list");
}

export function cancelTrip(id: string) {
  return api.post<{ trip: Trip }>(`/trips/${id}/cancel`);
}
