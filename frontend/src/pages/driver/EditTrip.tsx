import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { cancelTrip, getTrip } from "../../api/trips";
import type { Trip } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";

export default function EditTrip() {
  const { tripId } = useParams();
  const nav = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (tripId) getTrip(tripId).then((r) => setTrip(r.trip));
  }, [tripId]);

  if (!trip) return <PageShell title="Trajet" subtitle="Chargement…" />;

  async function handleCancel() {
    await cancelTrip(trip!.id);
    nav("/d/trips");
  }

  return (
    <PageShell title={`${trip.fromCity} → ${trip.toCity}`} subtitle={formatDateTime(trip.departAt)} nextApi={["GET /trips/:id", "POST /trips/:id/cancel"]}>
      <Section title="Détails">
        <div className="space-y-2 text-sm">
          <div><span className="text-gray-500">Départ : </span>{trip.fromPoint}</div>
          <div><span className="text-gray-500">Arrivée : </span>{trip.toPoint}</div>
          <div><span className="text-gray-500">Prix / place : </span>{formatXof(trip.pricePerSeatXof)}</div>
          <div><span className="text-gray-500">Places disponibles : </span>{trip.seatsAvailable}</div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Pour modifier un trajet déjà publié, annule-le et publie une nouvelle annonce avec les bonnes informations.
        </p>
        <button onClick={handleCancel} className="mt-4 rounded-xl bg-brand-red-500 px-4 py-2 text-white font-semibold hover:bg-brand-red-600">
          Annuler ce trajet
        </button>
      </Section>
    </PageShell>
  );
}
