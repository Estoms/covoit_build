import { api } from "./client";

export function getMyLoyalty() {
  return api.get<{
    account: { points: number; completedTrips: number };
    tiers: { threshold: number; label: string }[];
    nextTier?: { threshold: number; label: string };
  }>("/loyalty/me");
}

export function redeemLoyalty(label: string, pointsSpent: number) {
  return api.post("/loyalty/redeem", { label, pointsSpent });
}
