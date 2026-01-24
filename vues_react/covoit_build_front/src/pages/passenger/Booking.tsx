import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function Booking() {
  const { tripId } = useParams();
  const nav = useNavigate();

  const trip = useMemo(() => MOCK_TRIPS.find((t) => t.id === tripId), [tripId]);

  const [seats, setSeats] = useState(1);

  const maxSeats = trip?.seatsLeft ?? 0;
  const total = (trip?.priceXof ?? 0) * seats;

  if (!trip) {
    return (
      <PageShell title="Réservation" subtitle="Trajet introuvable (mock)">
        <Section title="Info">
          <p className="text-gray-600">Retourne aux résultats et choisis un trajet existant.</p>
        </Section>
      </PageShell>
    );
  }

  const canContinue = seats >= 1 && seats <= maxSeats;

  return (
    <PageShell
      title="Réservation"
      subtitle={`${trip.from} → ${trip.to} • ${trip.dateTime}`}
      actions={[{ label: "Retour", href: `/p/trips/${trip.id}`, variant: "secondary" }]}
      nextApi={["POST /bookings", "GET /bookings/me", "GET /trips/{id}"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Choix des places">
          <label className="grid gap-1 text-sm">
            Nombre de places (max {maxSeats})
            <input
              className="rounded-xl border px-3 py-2"
              type="number"
              min={1}
              max={maxSeats}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>

          {!canContinue && (
            <p className="mt-2 text-sm text-red-600">
              Nombre de places invalide.
            </p>
          )}
        </Section>

        <Section title="Récapitulatif">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Prix / place</span>
              <span className="font-semibold">{formatXof(trip.priceXof)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Places</span>
              <span className="font-semibold">{seats}</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-extrabold">{formatXof(total)}</span>
            </div>
          </div>

          <button
            disabled={!canContinue}
            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // bookingId mock
              const bookingId = `b_${trip.id}_${Date.now()}`;
              nav(`/p/payment/${bookingId}`);
            }}
          >
            Continuer vers paiement
          </button>

          <p className="mt-3 text-xs text-gray-500">
            (Mock) Ici on créerait une réservation avant le paiement.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
