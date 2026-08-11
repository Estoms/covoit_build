import { env } from "../config/env";

/**
 * Commission degressive (levier 1) :
 * le taux de depart reste sous le standard local (Gozem ~20%), cible 10-12%,
 * et descend par paliers selon le volume mensuel de trajets realises.
 */
export function computeCommissionRatePercent(tripsThisMonth: number): number {
  const base = env.commissionBasePercent; // ex 12
  const min = env.commissionMinPercent; // ex 8
  if (tripsThisMonth >= 40) return min;
  if (tripsThisMonth >= 25) return Math.max(min, base - 3);
  if (tripsThisMonth >= 10) return Math.max(min, base - 1.5);
  return base;
}

/**
 * Levier 2 : priorite dans l'algorithme de recherche.
 * Score simple combinant note moyenne, regularite (trajets/mois) et certification.
 */
export function computeAlgoPriorityScore(params: {
  averageRating: number; // 0-5
  tripsThisMonth: number;
  isVerified: boolean;
}): number {
  const ratingScore = (params.averageRating / 5) * 60; // jusqu'a 60 pts
  const regularityScore = Math.min(params.tripsThisMonth, 30); // jusqu'a 30 pts
  const certifiedBonus = params.isVerified ? 10 : 0; // 10 pts
  return Math.round(ratingScore + regularityScore + certifiedBonus);
}

/**
 * Leviers 3 & 4 sont regroupes en un seul "pack couts operationnels" pour eviter
 * le cumul non maitrise (cf. remarque du cahier des charges) : ils partagent le
 * meme palier de declenchement (nombre de trajets dans le mois).
 */
export function computeOperationalPack(tripsThisMonth: number): {
  cashoutFeeWaiverActive: boolean;
  dataPassEligible: boolean;
} {
  const eligible = tripsThisMonth >= 4; // ex: ~2 allers-retours Cotonou-Parakou / mois
  return { cashoutFeeWaiverActive: eligible, dataPassEligible: eligible };
}

/** Estimation des frais de retrait Mobile Money sur un montant donne. */
export function estimateCashoutFeeXof(amountXof: number): number {
  return Math.round((amountXof * env.cashoutFeeRatePercent) / 100);
}

/** Part des frais de retrait payee par le passager a la reservation. */
export function passengerFeeShareXof(cashoutFeeXof: number): number {
  return Math.round((cashoutFeeXof * env.passengerFeeSharePercent) / 100);
}
