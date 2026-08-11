import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard, MiniList } from "../../ui/DashboardCards";
import { myBookings } from "../../api/bookings";
import { myTrips } from "../../api/trips";
import type { AdminTrip, Booking } from "../../types";
import { useAuth } from "../../auth/AuthContext";
import { formatDateTime } from "../../utils/format";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<AdminTrip[]>([]);

  useEffect(() => {
    myBookings().then((r) => setBookings(r.items)).catch(() => {});
    myTrips().then((r) => setTrips(r.items)).catch(() => {});
  }, []);

  return (
    <PageShell title={`Bonjour ${user?.fullName ?? ""}`} subtitle="Vue combinée passager + conducteur" showBack={false} actions={[{ label: "Changer de vue", href: "/m/switch-role", variant: "secondary" }]}>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Réservations (passager)" value={String(bookings.length)} href="/p/bookings/upcoming" tone="success" />
        <StatCard title="Trajets publiés (conducteur)" value={String(trips.length)} href="/d/trips" tone="warning" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MiniList
          title="En tant que passager"
          items={bookings.slice(0, 5).map((b) => ({ label: `${b.trip?.fromCity} → ${b.trip?.toCity}`, meta: b.trip?.departAt ? formatDateTime(b.trip.departAt) : undefined, href: `/p/bookings/${b.id}` }))}
          empty="Aucune réservation."
        />
        <MiniList
          title="En tant que conducteur"
          items={trips.slice(0, 5).map((t) => ({ label: `${t.fromCity} → ${t.toCity}`, meta: formatDateTime(t.departAt), href: `/d/trips/${t.id}/passengers` }))}
          empty="Aucun trajet publié."
        />
      </div>
    </PageShell>
  );
}
