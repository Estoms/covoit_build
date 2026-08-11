import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard } from "../../ui/DashboardCards";
import Section from "../../ui/Section";
import { adminGlobalStats, adminListTransactions } from "../../api/admin";
import type { WalletTransaction } from "../../types";
import { formatXof } from "../../utils/format";

export default function FinanceReports() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminGlobalStats>> | null>(null);
  const [byType, setByType] = useState<Record<string, number>>({});

  useEffect(() => {
    adminGlobalStats().then(setStats);
    adminListTransactions().then((r) => {
      const acc: Record<string, number> = {};
      r.items.forEach((t: WalletTransaction) => { acc[t.type] = (acc[t.type] ?? 0) + t.amountXof; });
      setByType(acc);
    });
  }, []);

  return (
    <PageShell title="Rapports financiers" nextApi={["GET /admin/stats/global", "GET /admin/transactions"]}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Volume total déposé" value={stats ? formatXof(stats.totalVolumeXof) : "…"} tone="success" />
        <StatCard title="Réservations complétées" value={stats ? String(stats.completedBookings) : "…"} />
        <StatCard title="Trajets" value={stats ? String(stats.tripCount) : "…"} />
      </div>
      <div className="mt-6">
        <Section title="Répartition par type de transaction">
          <div className="divide-y">
            {Object.entries(byType).map(([type, amount]) => (
              <div key={type} className="flex justify-between py-2 text-sm"><span>{type}</span><span className="font-semibold">{formatXof(amount)}</span></div>
            ))}
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
