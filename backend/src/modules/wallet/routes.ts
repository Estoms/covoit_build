import { Router } from "express";
import type { Request } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, requireRoles, type AuthedRequest } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error";
import { initiateMockMomoPayment } from "./momoProvider";
import { completeTrip, confirmBookingPayment, confirmDeparture, getMyWallet } from "./service";
import { env } from "../../config/env";
import { verifyHmacSignature } from "../../lib/crypto";

export const walletRouter = Router();

walletRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const data = await getMyWallet(req.auth!.userId);
  res.json(data);
});

const initiateSchema = z.object({
  bookingId: z.string(),
  provider: z.enum(["MTN", "MOOV"]),
  phone: z.string().min(8),
});

// Initie le paiement Mobile Money pour une reservation (depot integral + part des frais)
walletRouter.post("/payments/initiate", requireAuth, requireRoles("PASSENGER"), validateBody(initiateSchema), async (req: AuthedRequest, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.body.bookingId } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.passengerId !== req.auth!.userId) throw new ApiError(403, "Acces refuse.");
  if (booking.status !== "PENDING_PAYMENT") throw new ApiError(400, "Cette reservation a deja ete traitee.");

  const { reference, autoConfirmInMs } = initiateMockMomoPayment({
    provider: req.body.provider,
    phone: req.body.phone,
    amountXof: booking.totalChargedXof,
  });

  await prisma.momoPaymentIntent.create({
    data: {
      bookingId: booking.id,
      provider: req.body.provider,
      phone: req.body.phone,
      amountXof: booking.totalChargedXof,
      reference,
      status: "PENDING",
    },
  });

  // Simulation sandbox: le webhook de confirmation arrive automatiquement apres un delai,
  // signe avec le meme secret que celui verifie sur la vraie route de webhook,
  // pour exercer le meme chemin de code que la production.
  setTimeout(() => {
    confirmMomoReference(reference).catch((err) => console.error("[MOMO MOCK] auto-confirm error", err));
  }, autoConfirmInMs);

  res.status(202).json({ reference, amountXof: booking.totalChargedXof, autoConfirmInMs, status: "PENDING" });
});

async function confirmMomoReference(reference: string) {
  const intent = await prisma.momoPaymentIntent.findUnique({ where: { reference } });
  if (!intent || intent.status !== "PENDING") return;
  await prisma.momoPaymentIntent.update({ where: { id: intent.id }, data: { status: "SUCCESS", confirmedAt: new Date() } });
  await confirmBookingPayment(intent.bookingId, intent.reference);
}

type RequestWithRawBody = Request & { rawBody?: Buffer };

/**
 * Webhook Mobile Money : la signature HMAC-SHA256 (header x-momo-signature,
 * calculee sur le corps brut avec MOMO_WEBHOOK_SECRET) est VERIFIEE DANS TOUS
 * LES ENVIRONNEMENTS, y compris en developpement. C'est la seule protection
 * de cette route puisqu'elle est appelee par un tiers externe (pas de JWT
 * possible) : sans verification stricte, n'importe qui pourrait confirmer de
 * faux paiements. En dev/demo, utilise le script `npm run momo:sign` (voir
 * README) pour generer un appel de test signe correctement.
 */
walletRouter.post("/webhooks/momo", async (req: RequestWithRawBody, res) => {
  const signature = req.header("x-momo-signature");
  const rawBody = req.rawBody?.toString("utf8") ?? "";
  if (!verifyHmacSignature(rawBody, env.momoWebhookSecret, signature ?? undefined)) {
    throw new ApiError(401, "Signature webhook invalide.");
  }

  const { reference, status } = req.body as { reference: string; status: "SUCCESS" | "FAILED" };
  const intent = await prisma.momoPaymentIntent.findUnique({ where: { reference } });
  if (!intent) throw new ApiError(404, "Intention de paiement introuvable.");
  if (status === "FAILED") {
    await prisma.momoPaymentIntent.update({ where: { id: intent.id }, data: { status: "FAILED" } });
    return res.json({ ok: true });
  }
  await confirmMomoReference(reference);
  res.json({ ok: true });
});

// Statut d'une intention de paiement (polling cote front)
walletRouter.get("/payments/:reference", requireAuth, async (req: AuthedRequest, res) => {
  const intent = await prisma.momoPaymentIntent.findUnique({ where: { reference: req.params.reference } });
  if (!intent) throw new ApiError(404, "Intention de paiement introuvable.");
  res.json({ intent });
});

// Conducteur : confirme le depart (jour J) -> libere l'acompte si choisi
walletRouter.post("/bookings/:id/confirm-departure", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const booking = await confirmDeparture(req.params.id, req.auth!.userId);
  res.json({ booking });
});

// Conducteur : cloture la course -> verse le solde (avec commission + pack cout operationnel)
walletRouter.post("/bookings/:id/complete", requireAuth, requireRoles("DRIVER"), async (req: AuthedRequest, res) => {
  const result = await completeTrip(req.params.id, req.auth!.userId);
  res.json(result);
});
