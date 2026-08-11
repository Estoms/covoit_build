import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { myBookings } from "../../api/bookings";
import { myTrips } from "../../api/trips";
import type { AdminTrip, Booking } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";

export default function MixedHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<AdminTrip[]>([]);

  useEffect(() => {
    myBookings().then((r) => setBookings(r.items.filter((b) => b.status === "COMPLETED")));
    myTrips().then((r) => setTrips(r.items.filter((t) => t.status === "COMPLETED")));
  }, []);

  return (
    <PageShell title="Historique récent" actions={[{ label: "Historique complet", href: "/m/history/all", variant: "secondary" }]} nextApi={["GET /bookings/mine", "GET /trips/mine/list"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Trajets pris (passager)">
          {bookings.length === 0 ? <p className="text-sm text-gray-600">Rien pour le moment.</p> : (
            <div className="divide-y">{bookings.map((b) => (
              <div key={b.id} className="py-2 text-sm flex justify-between"><span>{b.trip?.fromCity} → {b.trip?.toCity}</span><span className="text-gray-500">{formatXof(b.totalChargedXof)}</span></div>
            ))}</div>
          )}
        </Section>
        <Section title="Trajets conduits (conducteur)">
          {trips.length === 0 ? <p className="text-sm text-gray-600">Rien pour le moment.</p> : (
            <div className="divide-y">{trips.map((t) => (
              <div key={t.id} className="py-2 text-sm flex justify-between"><span>{t.fromCity} → {t.toCity}</span><span className="text-gray-500">{formatDateTime(t.departAt)}</span></div>
            ))}</div>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
