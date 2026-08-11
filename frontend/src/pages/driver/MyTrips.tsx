import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { myTrips } from "../../api/trips";
import type { AdminTrip } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";

export default function MyTrips() {
  const [trips, setTrips] = useState<AdminTrip[]>([]);

  useEffect(() => {
    myTrips().then((r) => setTrips(r.items));
  }, []);

  return (
    <PageShell title="Mes trajets" actions={[{ label: "Publier un trajet", href: "/d/trips/publish" }]} nextApi={["GET /trips/mine/list"]}>
      {trips.length === 0 ? (
        <Section title="Aucun trajet"><p className="text-sm text-gray-600">Tu n'as pas encore publié de trajet.</p></Section>
      ) : (
        <div className="grid gap-4">
          {trips.map((t) => (
            <Section key={t.id} title={`${t.fromCity} → ${t.toCity}`} action={<StatusBadge label={t.status} tone={bookingStatusTone(t.status)} />}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-gray-600">{formatDateTime(t.departAt)} • {t.seatsAvailable}/{t.seatsTotal} places</span>
                <div className="flex gap-2">
                  <span className="font-semibold">{formatXof(t.pricePerSeatXof)}</span>
                  <Link to={`/d/trips/${t.id}/passengers`} className="underline">Passagers</Link>
                  <Link to={`/d/trips/${t.id}/edit`} className="underline">Modifier</Link>
                </div>
              </div>
            </Section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
