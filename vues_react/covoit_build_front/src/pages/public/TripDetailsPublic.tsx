import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { findTripById } from "../../data/tripsStore";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TripDetailsPublic() {
  const { tripId } = useParams();

  const trip = useMemo(() => (tripId ? findTripById(tripId) : undefined), [tripId]);

  if (!trip) {
    return (
      <PageShell
        title="Trajet introuvable"
        subtitle="Ce trajet n’existe pas (mock)."
        actions={[{ label: "Retour aux résultats", href: "/search/results", variant: "secondary" }]}
      >
        <Section title="Conseil">
          <p className="text-gray-600">
            Essaie un id existant : t1, t2, t3, t4 (ex: /trips/t1)
          </p>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`${trip.from} → ${trip.to}`}
      subtitle={`Départ : ${trip.dateTime} • Prix : ${formatXof(trip.priceXof)}`}
      actions={[
        { label: "Retour", href: "/search/results", variant: "secondary" },
        { label: "Se connecter pour réserver", href: "/login", variant: "primary" },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Infos conducteur">
          <p className="text-sm text-gray-600">Nom</p>
          <p className="font-semibold">{trip.driverName}</p>
          <p className="mt-2 text-sm text-gray-600">Note</p>
          <p className="font-semibold">{trip.driverRating}/5</p>
          <p className="mt-2 text-sm text-gray-600">Véhicule</p>
          <p className="font-semibold">{trip.car}</p>
        </Section>

        <Section title="Infos trajet">
          <p className="text-sm text-gray-600">Point de rendez-vous</p>
          <p className="font-semibold">{trip.meetingPoint}</p>
          <p className="mt-2 text-sm text-gray-600">Point d’arrivée</p>
          <p className="font-semibold">{trip.dropPoint}</p>
          <p className="mt-2 text-sm text-gray-600">Places restantes</p>
          <p className="font-semibold">{trip.seatsLeft}</p>
        </Section>
      </div>

      <Section title="Actions">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/login"
            className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 text-center"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 text-center"
          >
            Inscription
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
