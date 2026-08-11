import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard } from "../../ui/DashboardCards";
import { myBookings } from "../../api/bookings";
import { myTrips } from "../../api/trips";
import type { AdminTrip, Booking } from "../../types";
import { getMyLoyalty } from "../../api/loyalty";
import { formatXof } from "../../utils/format";

export default function PersonalStats() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    myBookings().then((r) => setBookings(r.items));
    myTrips().then((r) => setTrips(r.items));
    getMyLoyalty().then((r) => setPoints(r.account.points));
  }, []);

  const totalSpent = bookings.reduce((s, b) => s + (b.status === "COMPLETED" ? b.totalChargedXof : 0), 0);
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;

  return (
    <PageShell title="Mes statistiques" nextApi={["GET /bookings/mine", "GET /trips/mine/list", "GET /loyalty/me"]}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Trajets pris" value={String(bookings.length)} tone="success" />
        <StatCard title="Trajets conduits" value={String(completedTrips)} tone="warning" />
        <StatCard title="Total dépensé" value={formatXof(totalSpent)} />
        <StatCard title="Points fidélité" value={String(points)} href="/p/loyalty" />
      </div>
    </PageShell>
  );
}
