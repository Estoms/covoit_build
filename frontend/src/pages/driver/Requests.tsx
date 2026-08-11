import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { myTrips } from "../../api/trips";
import type { AdminTrip } from "../../types";
import { formatDateTime } from "../../utils/format";

export default function Requests() {
  const [trips, setTrips] = useState<AdminTrip[]>([]);

  useEffect(() => {
    myTrips().then((r) => setTrips(r.items.filter((t) => t.bookings?.length > 0)));
  }, []);

  return (
    <PageShell title="Demandes de réservation" subtitle="Par trajet" nextApi={["GET /trips/mine/list"]}>
      {trips.length === 0 ? (
        <Section title="Aucune demande"><p className="text-sm text-gray-600">Aucune réservation en attente pour tes trajets.</p></Section>
      ) : (
        <div className="grid gap-4">
          {trips.map((t) => (
            <Link key={t.id} to={`/d/trips/${t.id}/passengers`}>
              <Section title={`${t.fromCity} → ${t.toCity}`}>
                <div className="text-sm text-gray-600">{formatDateTime(t.departAt)} • {t.bookings.length} réservation(s)</div>
              </Section>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
