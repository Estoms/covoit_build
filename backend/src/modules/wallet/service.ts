import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/error";
import { createNotification } from "../notifications/service";
import { sendSms } from "../notifications/smsProvider";
import {
  computeCommissionRatePercent,
  computeOperationalPack,
} from "../../utils/commission";
import { formatXof } from "../../utils/xof";

async function ensureWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId, balanceXof: 0 },
  });
}

/** Confirmation du paiement Mobile Money (webhook) : passe la reservation CONFIRMED,
 * decremente les places, cree la conversation passager<->conducteur, notifie tout le monde. */
export async function confirmBookingPayment(bookingId: string, momoReference: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { trip: true } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.status !== "PENDING_PAYMENT") return booking; // idempotent

  const passengerWallet = await ensureWallet(booking.passengerId);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        walletId: passengerWallet.id,
        bookingId: booking.id,
        type: "DEPOSIT",
        amountXof: booking.totalChargedXof,
        momoReference,
        status: "SUCCESS",
      },
    });

    const b = await tx.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED" } });

    await tx.trip.update({
      where: { id: booking.tripId },
      data: { seatsAvailable: { decrement: booking.seats } },
    });

    const existingConv = await tx.conversation.findUnique({ where: { bookingId: booking.id } });
    if (!existingConv) {
      await tx.conversation.create({
        data: {
          bookingId: booking.id,
          tripId: booking.tripId,
          passengerId: booking.passengerId,
          driverId: booking.trip.driverId,
        },
      });
    }

    return b;
  });

  await createNotification({
    userId: booking.passengerId,
    kind: "PAYMENT_RECEIVED",
    title: "Paiement confirme",
    body: `Ta reservation est confirmee (${formatXof(booking.totalChargedXof)}). Retrouve ton conducteur dans la messagerie de l'application.`,
  });
  await createNotification({
    userId: booking.trip.driverId,
    kind: "BOOKING_CONFIRMED",
    title: "Nouvelle reservation",
    body: `Un passager a reserve ${booking.seats} place(s) sur ton trajet du ${booking.trip.departAt.toLocaleString("fr-FR")}.`,
  });

  return updated;
}

/** Jour J : confirmation du depart. Si le conducteur a choisi un acompte, on le libere. */
export async function confirmDeparture(bookingId: string, driverUserId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { trip: true } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.trip.driverId !== driverUserId) throw new ApiError(403, "Acces refuse.");
  if (booking.status !== "CONFIRMED") throw new ApiError(400, "La reservation n'est pas confirmee.");

  const driverProfile = await prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
  const driverWallet = await ensureWallet(driverUserId);

  const wantsAdvance = (driverProfile?.payoutModePreference ?? "ADVANCE_THEN_FINAL") === "ADVANCE_THEN_FINAL";
  const advanceAmount = wantsAdvance ? Math.round(booking.tripAmountXof * 0.5) : 0;

  const updated = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.update({
      where: { id: booking.id },
      data: { status: "IN_PROGRESS", advanceReleasedAt: wantsAdvance ? new Date() : null },
    });
    if (wantsAdvance && advanceAmount > 0) {
      await tx.wallet.update({ where: { id: driverWallet.id }, data: { balanceXof: { increment: advanceAmount } } });
      await tx.transaction.create({
        data: { walletId: driverWallet.id, bookingId: booking.id, type: "RELEASE_ADVANCE", amountXof: advanceAmount, status: "SUCCESS" },
      });
    }
    return b;
  });

  await createNotification({
    userId: driverUserId,
    kind: "PAYOUT_RELEASED",
    title: "Depart confirme",
    body: wantsAdvance
      ? `Un acompte de ${formatXof(advanceAmount)} a ete verse sur ton portefeuille pour couvrir les frais du trajet.`
      : "Depart confirme. Le solde sera verse a la fin du trajet.",
  });

  return updated;
}

/** Fin de course : versement du solde restant (ou du montant total), en appliquant
 * la commission degressive et le pack "cout operationnel" (frais de retrait / data). */
export async function completeTrip(bookingId: string, driverUserId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { trip: true } });
  if (!booking) throw new ApiError(404, "Reservation introuvable.");
  if (booking.trip.driverId !== driverUserId) throw new ApiError(403, "Acces refuse.");
  if (booking.status !== "IN_PROGRESS" && booking.status !== "CONFIRMED") {
    throw new ApiError(400, "Ce trajet ne peut pas encore etre cloture.");
  }

  const monthKey = new Date().toISOString().slice(0, 7);
  let rewardProfile = await prisma.driverRewardProfile.upsert({
    where: { userId: driverUserId },
    update: {},
    create: { userId: driverUserId, monthKey },
  });
  if (rewardProfile.monthKey !== monthKey) {
    rewardProfile = await prisma.driverRewardProfile.update({
      where: { userId: driverUserId },
      data: { monthKey, tripsThisMonth: 0 },
    });
  }

  const newTripsThisMonth = rewardProfile.tripsThisMonth + 1;
  const commissionRatePercent = computeCommissionRatePercent(newTripsThisMonth);
  const { cashoutFeeWaiverActive, dataPassEligible } = computeOperationalPack(newTripsThisMonth);

  const alreadyAdvanced = booking.advanceReleasedAt
    ? Math.round(booking.tripAmountXof * 0.5)
    : 0;
  const remainingGross = booking.tripAmountXof - alreadyAdvanced;
  const commissionOnRemaining = Math.round(remainingGross * (commissionRatePercent / 100));
  const netRemaining = remainingGross - commissionOnRemaining;

  const driverWallet = await ensureWallet(driverUserId);

  const updated = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.update({
      where: { id: booking.id },
      data: { status: "COMPLETED", finalReleasedAt: new Date() },
    });

    await tx.wallet.update({ where: { id: driverWallet.id }, data: { balanceXof: { increment: netRemaining } } });
    await tx.transaction.create({
      data: {
        walletId: driverWallet.id,
        bookingId: booking.id,
        type: alreadyAdvanced > 0 ? "RELEASE_FINAL" : "PAYOUT_FULL",
        amountXof: netRemaining,
        status: "SUCCESS",
      },
    });

    if (cashoutFeeWaiverActive && booking.passengerFeeShareXof > 0) {
      // MobiBenin prend en charge le reste des frais de retrait (levier 3)
      const bonus = booking.passengerFeeShareXof;
      await tx.wallet.update({ where: { id: driverWallet.id }, data: { balanceXof: { increment: bonus } } });
      await tx.transaction.create({
        data: { walletId: driverWallet.id, bookingId: booking.id, type: "CASHOUT_FEE_WAIVER_BONUS", amountXof: bonus, status: "SUCCESS" },
      });
    }

    await tx.driverRewardProfile.update({
      where: { userId: driverUserId },
      data: {
        tripsThisMonth: newTripsThisMonth,
        commissionRatePercent,
        cashoutFeeWaiverActive,
        dataPassEligible,
      },
    });

    // Points fidelite passager (gratification)
    const loyalty = await tx.loyaltyAccount.upsert({
      where: { userId: booking.passengerId },
      update: { points: { increment: 10 }, completedTrips: { increment: 1 } },
      create: { userId: booking.passengerId, points: 10, completedTrips: 1 },
    });

    return { booking: b, loyalty };
  });

  await createNotification({
    userId: driverUserId,
    kind: "PAYOUT_RELEASED",
    title: "Course terminee",
    body: `Solde verse: ${formatXof(netRemaining)}. Commission appliquee: ${commissionRatePercent}%.`,
  });
  await createNotification({
    userId: booking.passengerId,
    kind: "LOYALTY_REWARD",
    title: "Merci pour ce trajet !",
    body: "Tu as gagne 10 points de fidelite. Pense a noter ton conducteur.",
  });

  return updated;
}

export async function getMyWallet(userId: string) {
  const wallet = await ensureWallet(userId);
  const transactions = await prisma.transaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return { wallet, transactions };
}

export { sendSms };
