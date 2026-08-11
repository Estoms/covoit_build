import { env } from "../../config/env";

/**
 * Fournisseur SMS "mock". Dans une vraie integration, ceci appellerait
 * l'API SMS d'un agregateur local (ou MTN/Moov). Ici on simule l'envoi et
 * on journalise le message pour le developpement / les demos.
 */
export async function sendSms(phone: string, message: string): Promise<{ ok: true; simulated: true }> {
  if (env.otpMockLog) {
    // eslint-disable-next-line no-console
    console.log(`[SMS MOCK] -> ${phone}: ${message}`);
  }
  return { ok: true, simulated: true };
}
