import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { tripPassengers } from "../../api/bookings";
import { confirmDeparture, completeTrip } from "../../api/wallet";
import type { Booking, PublicUser } from "../../types";
import { formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";
import { ApiClientError } from "../../api/client";

export default function PassengersList() {
  const { tripId } = useParams();
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function reload() {
    if (tripId) tripPassengers(tripId).then((r) => setItems(r.items)).catch(() => setError("Impossible de charger les passagers."));
  }
  useEffect(reload, [tripId]);

  async function handleDeparture(bookingId: string) {
    setBusyId(bookingId);
    setError(null);
    try {
      await confirmDeparture(bookingId);
      reload();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Action impossible.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(bookingId: string) {
    setBusyId(bookingId);
    setError(null);
    try {
      await completeTrip(bookingId);
      reload();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Action impossible.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <PageShell title="Passagers du trajet" nextApi={["GET /bookings/trip/:tripId/passengers", "POST /wallet/bookings/:id/confirm-departure", "POST /wallet/bookings/:id/complete"]}>
      {error && <p className="text-sm text-brand-red-600 mb-3">{error}</p>}
      {items.length === 0 ? (
        <Section title="Aucun passager"><p className="text-sm text-gray-600">Personne n'a encore réservé ce trajet.</p></Section>
      ) : (
        <div className="grid gap-4">
          {items.map((b: Booking & { passenger?: PublicUser }) => (
            <Section key={b.id} title={b.passenger?.fullName ?? "Passager"} action={<StatusBadge label={b.status} tone={bookingStatusTone(b.status)} />}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-gray-600">{b.seats} place(s) • {formatXof(b.totalChargedXof)}</span>
                <div className="flex gap-2">
                  {b.status === "CONFIRMED" && (
                    <button disabled={busyId === b.id} onClick={() => handleDeparture(b.id)} className="rounded-xl bg-brand-yellow-500 px-3 py-1.5 text-white font-semibold hover:bg-brand-yellow-600 disabled:opacity-50">
                      Confirmer le départ
                    </button>
                  )}
                  {b.status === "IN_PROGRESS" && (
                    <button disabled={busyId === b.id} onClick={() => handleComplete(b.id)} className="rounded-xl bg-brand-green-600 px-3 py-1.5 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50">
                      Clôturer la course
                    </button>
                  )}
                </div>
              </div>
            </Section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
