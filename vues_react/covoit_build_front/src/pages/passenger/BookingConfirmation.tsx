import React from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function BookingConfirmation() {
  const { bookingId } = useParams();

  return (
    <PageShell
      title="Confirmation"
      subtitle={`Paiement validé (mock) • Réservation : ${bookingId}`}
      actions={[{ label: "Mes réservations", href: "/p/bookings/upcoming", variant: "primary" }]}
      nextApi={["GET /bookings/{id}", "POST /notifications", "POST /messages (optionnel)"]}
    >
      <Section title="✅ Réservation confirmée">
        <p className="text-gray-700">
          Ton trajet est réservé. Tu recevras une notification (mock) et tu peux contacter le conducteur.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link
            to="/p/messages"
            className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 text-center"
          >
            Aller aux messages
          </Link>
          <Link
            to="/search"
            className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 text-center"
          >
            Rechercher un autre trajet
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
