import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard } from "../../ui/DashboardCards";
import { adminGlobalStats } from "../../api/admin";
import { formatXof } from "../../utils/format";

export default function GlobalStats() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminGlobalStats>> | null>(null);

  useEffect(() => {
    adminGlobalStats().then(setStats);
  }, []);

  return (
    <PageShell title="Statistiques globales" nextApi={["GET /admin/stats/global"]}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Utilisateurs" value={stats ? String(stats.userCount) : "…"} tone="success" />
        <StatCard title="Conducteurs vérifiés" value={stats ? String(stats.verifiedDriverCount) : "…"} />
        <StatCard title="Trajets publiés" value={stats ? String(stats.tripCount) : "…"} />
        <StatCard title="Réservations" value={stats ? String(stats.bookingCount) : "…"} tone="warning" />
        <StatCard title="Réservations complétées" value={stats ? String(stats.completedBookings) : "…"} />
        <StatCard title="Volume total" value={stats ? formatXof(stats.totalVolumeXof) : "…"} />
      </div>
    </PageShell>
  );
}
