import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getTrip } from "../../api/trips";
import { createBooking } from "../../api/bookings";
import type { Trip } from "../../types";
import { formatXof } from "../../utils/format";
import { ApiClientError } from "../../api/client";

export default function Booking() {
  const { tripId } = useParams();
  const nav = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId).then((r) => setTrip(r.trip)).catch(() => setError("Trajet introuvable."));
  }, [tripId]);

  const maxSeats = trip?.seatsAvailable ?? 0;
  const tripAmount = (trip?.pricePerSeatXof ?? 0) * seats;
  // Estimation affichee cote client (le montant exact/definitif est calcule par le backend)
  const estimatedFeeShare = Math.round(tripAmount * 0.015 * 0.5);
  const estimatedTotal = tripAmount + estimatedFeeShare;

  const canContinue = useMemo(() => seats >= 1 && seats <= maxSeats, [seats, maxSeats]);

  if (error) {
    return (
      <PageShell title="Réservation" subtitle="Trajet introuvable">
        <Section title="Info"><p className="text-gray-600">Retourne aux résultats et choisis un trajet existant.</p></Section>
      </PageShell>
    );
  }
  if (!trip) return <PageShell title="Réservation" subtitle="Chargement…" />;

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const { booking } = await createBooking(trip!.id, seats);
      nav(`/p/payment/${booking.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Réservation impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Réservation"
      subtitle={`${trip.fromCity} → ${trip.toCity} • ${new Date(trip.departAt).toLocaleString("fr-FR")}`}
      actions={[{ label: "Retour", href: `/trips/${trip.id}`, variant: "secondary" }]}
      nextApi={["POST /bookings", "GET /trips/:id"]}
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
          {!canContinue && <p className="mt-2 text-sm text-brand-red-600">Nombre de places invalide.</p>}
        </Section>

        <Section title="Récapitulatif">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Prix / place</span><span className="font-semibold">{formatXof(trip.pricePerSeatXof)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Places</span><span className="font-semibold">{seats}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Part frais de retrait (~50%)</span><span className="font-semibold">{formatXof(estimatedFeeShare)}</span></div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-base"><span className="font-semibold">Total estimé</span><span className="font-extrabold">{formatXof(estimatedTotal)}</span></div>
          </div>

          {error && <p className="mt-3 text-sm text-brand-red-600">{error}</p>}

          <button
            disabled={!canContinue || submitting}
            className="mt-4 w-full rounded-xl bg-brand-green-600 px-4 py-2 text-white font-medium hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
          >
            {submitting ? "Réservation…" : "Continuer vers paiement"}
          </button>

          <p className="mt-3 text-xs text-gray-500">
            Le montant total est déposé sur ton portefeuille MobiBenin à la réservation ; il sera débloqué pour le
            conducteur au fil du trajet.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
