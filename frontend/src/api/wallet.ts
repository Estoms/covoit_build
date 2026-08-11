import { api } from "./client";
import type { WalletTransaction } from "../types";

export function getMyWallet() {
  return api.get<{ wallet: { balanceXof: number }; transactions: WalletTransaction[] }>("/wallet/me");
}

export function initiatePayment(bookingId: string, provider: "MTN" | "MOOV", phone: string) {
  return api.post<{ reference: string; amountXof: number; autoConfirmInMs: number; status: string }>(
    "/wallet/payments/initiate",
    { bookingId, provider, phone }
  );
}

export function getPaymentIntent(reference: string) {
  return api.get<{ intent: { status: string } }>(`/wallet/payments/${reference}`);
}

export function confirmDeparture(bookingId: string) {
  return api.post(`/wallet/bookings/${bookingId}/confirm-departure`);
}

export function completeTrip(bookingId: string) {
  return api.post(`/wallet/bookings/${bookingId}/complete`);
}
