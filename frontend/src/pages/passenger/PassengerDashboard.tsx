import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard, MiniList } from "../../ui/DashboardCards";
import { myBookings } from "../../api/bookings";
import { getMyLoyalty } from "../../api/loyalty";
import type { Booking } from "../../types";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../../auth/AuthContext";

export default function PassengerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    myBookings().then((r) => setBookings(r.items)).catch(() => {});
    getMyLoyalty().then((r) => setPoints(r.account.points)).catch(() => {});
  }, []);

  const upcoming = bookings.filter((b) => ["PENDING_PAYMENT", "CONFIRMED", "IN_PROGRESS"].includes(b.status));

  return (
    <PageShell title={`Bonjour ${user?.fullName ?? ""}`} subtitle="Ton espace passager MobiBenin" showBack={false} nextApi={["GET /bookings/mine", "GET /loyalty/me"]}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Réservations à venir" value={String(upcoming.length)} href="/p/bookings/upcoming" tone="success" />
        <StatCard title="Points fidélité" value={points != null ? String(points) : "…"} href="/p/loyalty" tone="warning" />
        <StatCard title="Historique paiements" value={String(bookings.length)} href="/p/payments/history" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MiniList
          title="Prochains trajets"
          items={upcoming.map((b) => ({
            label: `${b.trip?.fromCity} → ${b.trip?.toCity}`,
            meta: b.trip?.departAt ? formatDateTime(b.trip.departAt) : undefined,
            href: `/p/bookings/${b.id}`,
          }))}
          empty="Aucune réservation à venir."
        />
        <MiniList
          title="Actions rapides"
          items={[
            { label: "Rechercher un trajet", href: "/search" },
            { label: "Mes vérifications", href: "/profile/verifications" },
            { label: "Messagerie", href: "/messages" },
          ]}
        />
      </div>
    </PageShell>
  );
}
