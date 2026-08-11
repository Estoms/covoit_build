import { api } from "./client";

export function getMyDriverRewards() {
  return api.get<{
    tripsThisMonth: number;
    commissionRatePercent: number;
    projectedNextCommissionRatePercent: number;
    algoPriorityScore: number;
    operationalPack: { cashoutFeeWaiverActive: boolean; dataPassEligible: boolean; note: string };
  }>("/driver-rewards/me");
}
