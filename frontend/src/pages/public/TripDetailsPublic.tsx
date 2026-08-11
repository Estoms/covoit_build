import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getTrip } from "../../api/trips";
import type { Trip } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import { useAuth } from "../../auth/AuthContext";

export default function TripDetailsPublic() {
  const { tripId } = useParams();
  const nav = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    getTrip(tripId).then((r) => setTrip(r.trip)).catch(() => setError("Trajet introuvable."));
  }, [tripId]);

  if (error) {
    return (
      <PageShell title="Trajet" subtitle="Introuvable">
        <Section title="Erreur"><p className="text-sm text-brand-red-600">{error}</p></Section>
      </PageShell>
    );
  }
  if (!trip) return <PageShell title="Trajet" subtitle="Chargement…" />;

  function handleReserve() {
    if (!isAuthenticated) return nav("/login", { state: { from: `/p/booking/${trip!.id}` } });
    if (!user!.roles.includes("PASSENGER") && !user!.roles.includes("PASSENGER_DRIVER")) {
      return nav("/403");
    }
    nav(`/p/booking/${trip!.id}`);
  }

  return (
    <PageShell
      title={`${trip.fromCity} → ${trip.toCity}`}
      subtitle={formatDateTime(trip.departAt)}
      actions={[{ label: "Réserver une place", onClick: handleReserve }]}
      nextApi={["GET /trips/:id"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Détails du trajet">
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Départ : </span>{trip.fromPoint}</div>
            <div><span className="text-gray-500">Arrivée : </span>{trip.toPoint}</div>
            <div><span className="text-gray-500">Véhicule : </span>{trip.vehicleLabel ?? "—"}</div>
            <div><span className="text-gray-500">Places disponibles : </span>{trip.seatsAvailable}</div>
            <div><span className="text-gray-500">Prix par place : </span><span className="font-semibold">{formatXof(trip.pricePerSeatXof)}</span></div>
          </div>
        </Section>
        <Section title="Conducteur">
          <div className="text-sm">
            <div className="font-semibold">{trip.driver.fullName}</div>
            {trip.driver.avgRating != null && <div className="text-gray-600">★ {trip.driver.avgRating} / 5</div>}
            <p className="mt-2 text-gray-500 text-xs">
              Pour protéger la vie privée, le numéro du conducteur n'est communiqué qu'après réservation confirmée,
              via la messagerie interne MobiBenin.
            </p>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
