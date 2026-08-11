import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard, MiniList } from "../../ui/DashboardCards";
import { adminDisputes, adminGlobalStats } from "../../api/admin";
import { adminVerificationQueue } from "../../api/verifications";
import type { DriverProfileDTO, SupportTicket } from "../../types";
import { formatXof } from "../../utils/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminGlobalStats>> | null>(null);
  const [queue, setQueue] = useState<DriverProfileDTO[]>([]);
  const [disputes, setDisputes] = useState<SupportTicket[]>([]);

  useEffect(() => {
    adminGlobalStats().then(setStats);
    adminVerificationQueue().then((r) => setQueue(r.items));
    adminDisputes().then((r) => setDisputes(r.items));
  }, []);

  return (
    <PageShell title="Console d'administration" showBack={false} nextApi={["GET /admin/stats/global", "GET /verifications/admin/queue", "GET /admin/disputes"]}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Utilisateurs" value={stats ? String(stats.userCount) : "…"} href="/admin/users" tone="success" />
        <StatCard title="Conducteurs vérifiés" value={stats ? String(stats.verifiedDriverCount) : "…"} href="/admin/user-moderation" />
        <StatCard title="Trajets" value={stats ? String(stats.tripCount) : "…"} href="/admin/trips" />
        <StatCard title="Volume total" value={stats ? formatXof(stats.totalVolumeXof) : "…"} href="/admin/finance-reports" tone="warning" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MiniList
          title="Dossiers conducteurs à valider"
          items={queue.map((q) => ({ label: q.user?.fullName ?? "Conducteur", meta: q.vehicleType ?? undefined, href: "/admin/user-moderation" }))}
          empty="Aucun dossier en attente."
        />
        <MiniList
          title="Litiges ouverts"
          items={disputes.map((d) => ({ label: d.subject, meta: d.createdBy?.fullName, href: `/support/tickets/${d.id}` }))}
          empty="Aucun litige ouvert."
        />
      </div>
    </PageShell>
  );
}
