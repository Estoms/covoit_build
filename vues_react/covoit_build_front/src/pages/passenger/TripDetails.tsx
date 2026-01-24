import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { MOCK_TRIPS } from "../../data/mockTrips";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TripDetails() {
  const { tripId } = useParams();
  const nav = useNavigate();

  const trip = useMemo(() => MOCK_TRIPS.find((t) => t.id === tripId), [tripId]);

  if (!trip) {
    return (
      <PageShell
        title="Trajet introuvable"
        subtitle="Ce trajet n’existe pas (mock)."
        actions={[{ label: "Retour", href: "/search/results", variant: "secondary" }]}
      >
        <Section title="Conseil">
          <p className="text-gray-600">Essaie : /p/trips/t1</p>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`Réserver : ${trip.from} → ${trip.to}`}
      subtitle={`Départ : ${trip.dateTime} • ${formatXof(trip.priceXof)} • Places: ${trip.seatsLeft}`}
      actions={[{ label: "Retour aux résultats", href: "/search/results", variant: "secondary" }]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Détails">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Rendez-vous :</span>{" "}
              <span className="font-semibold">{trip.meetingPoint}</span>
            </div>
            <div>
              <span className="text-gray-600">Arrivée :</span>{" "}
              <span className="font-semibold">{trip.dropPoint}</span>
            </div>
            <div>
              <span className="text-gray-600">Véhicule :</span>{" "}
              <span className="font-semibold">{trip.car}</span>
            </div>
          </div>
        </Section>

        <Section title="Conducteur">
          <p className="font-semibold">{trip.driverName}</p>
          <p className="text-sm text-gray-600">Note : {trip.driverRating}/5</p>
          <p className="mt-3 text-xs text-gray-500">
            (Mock) Plus tard : avis, vérifications, historique.
          </p>
        </Section>
      </div>

      <Section title="Réservation">
        <button
          disabled={trip.seatsLeft <= 0}
          className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => nav(`/p/booking/${trip.id}`)}
        >
          Réserver maintenant
        </button>

        <div className="mt-3 text-sm text-gray-600">
          Ou revenir à la{" "}
          <Link className="underline" to="/search/results">
            liste des trajets
          </Link>
          .
        </div>
      </Section>
    </PageShell>
  );
}
