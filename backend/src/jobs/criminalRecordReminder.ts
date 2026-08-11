import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { sendSms } from "../modules/notifications/smsProvider";
import { createNotification } from "../modules/notifications/service";

/**
 * Cahier des charges : le conducteur doit fournir son casier judiciaire dans
 * le mois suivant son inscription, avec un rappel envoye a chaque fois.
 * Cette tache tourne chaque jour et relance les conducteurs dont le dossier
 * n'est pas encore soumis, au plus une fois par 24h.
 */
export function startCriminalRecordReminderJob() {
  const run = async () => {
    const now = new Date();
    const pending = await prisma.driverProfile.findMany({
      where: {
        criminalRecordSubmittedAt: null,
        verificationStatus: { not: "REJECTED" },
      },
      include: { user: true },
    });

    for (const profile of pending) {
      const last = profile.criminalRecordLastReminderAt;
      const dueSoonOrPast = profile.criminalRecordDueAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;
      const canRemind = !last || now.getTime() - last.getTime() > 24 * 60 * 60 * 1000;
      if (dueSoonOrPast && canRemind) {
        const overdue = profile.criminalRecordDueAt < now;
        const message = overdue
          ? "MobiBenin: ton casier judiciaire est en retard. Fournis-le rapidement pour garder ton compte conducteur actif."
          : `MobiBenin: pense a fournir ton casier judiciaire avant le ${profile.criminalRecordDueAt.toLocaleDateString("fr-FR")}.`;
        await sendSms(profile.user.phone, message);
        await createNotification({
          userId: profile.userId,
          kind: "DOCUMENT_REMINDER",
          title: "Casier judiciaire requis",
          body: message,
        });
        await prisma.driverProfile.update({
          where: { id: profile.id },
          data: { criminalRecordLastReminderAt: now },
        });
      }
    }
  };

  // Tous les jours a 08h00
  cron.schedule("0 8 * * *", run);
  // Execution immediate au demarrage pour le dev/demo
  run().catch((err) => console.error("[reminder job] erreur", err));
}
