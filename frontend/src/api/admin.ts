import { api } from "./client";
import type { AdminTrip, DriverProfileDTO, PublicUser, SupportTicket, WalletTransaction } from "../types";

export function adminListUsers(role?: string) {
  return api.get<{ items: PublicUser[] }>(`/admin/users${role ? `?role=${role}` : ""}`);
}
export function adminGetUser(id: string) {
  return api.get<{
    user: PublicUser;
    driverProfile?: DriverProfileDTO | null;
    wallet?: { balanceXof: number } | null;
    loyaltyAccount?: { points: number } | null;
  }>(`/admin/users/${id}`);
}
export function adminListTrips() {
  return api.get<{ items: AdminTrip[] }>("/admin/trips");
}
export function adminListTransactions() {
  return api.get<{ items: WalletTransaction[] }>("/admin/transactions");
}
export function adminGlobalStats() {
  return api.get<{
    userCount: number; verifiedDriverCount: number; tripCount: number;
    bookingCount: number; completedBookings: number; totalVolumeXof: number;
  }>("/admin/stats/global");
}
export function adminDisputes() {
  return api.get<{ items: SupportTicket[] }>("/admin/disputes");
}
