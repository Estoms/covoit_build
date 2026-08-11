import crypto from "node:crypto";
import { env } from "../../config/env";

export type MomoProviderName = "MTN" | "MOOV";

/**
 * Fournisseur Mobile Money "mock" (MTN MoMo / Moov Money).
 * Simule le comportement d'un vrai agregateur : on initie un paiement, on
 * recoit une reference, puis une confirmation arrive de facon asynchrone
 * via un webhook (ici auto-declenche apres un delai, comme en sandbox).
 */
export function initiateMockMomoPayment(params: { provider: MomoProviderName; phone: string; amountXof: number }) {
  const reference = `MOCK-${params.provider}-${crypto.randomUUID()}`;
  return { reference, autoConfirmInMs: env.momoAutoConfirmMs };
}
