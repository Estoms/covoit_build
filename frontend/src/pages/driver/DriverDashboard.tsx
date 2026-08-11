import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard, MiniList } from "../../ui/DashboardCards";
import { myTrips } from "../../api/trips";
import type { AdminTrip } from "../../types";
import { getMyWallet } from "../../api/wallet";
import { useAuth } from "../../auth/AuthContext";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { verificationStatusTone } from "../../ui/StatusBadge";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    myTrips().then((r) => setTrips(r.items)).catch(() => {});
    getMyWallet().then((r) => setBalance(r.wallet.balanceXof)).catch(() => {});
  }, []);

  const verification = user?.driverVerification;
  const upcoming = trips.filter((t) => t.status === "PUBLISHED" || t.status === "IN_PROGRESS");

  return (
    <PageShell title={`Bonjour ${user?.fullName ?? ""}`} subtitle="Ton espace conducteur MobiBenin" showBack={false} nextApi={["GET /trips/mine/list", "GET /wallet/me"]}>
      {verification && verification.status !== "APPROVED" && (
        <div className="mb-6 rounded-2xl border border-brand-yellow-200 bg-brand-yellow-50 p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-brand-yellow-800">Dossier en attente de validation</div>
            <div className="text-sm text-brand-yellow-700">Un administrateur doit valider ton dossier avant que tu puisses publier des trajets.</div>
          </div>
          <StatusBadge label={verification.status} tone={verificationStatusTone(verification.status)} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Trajets actifs" value={String(upcoming.length)} href="/d/trips" tone="success" />
        <StatCard title="Solde portefeuille" value={formatXof(balance)} href="/d/earnings" tone="warning" />
        <StatCard title="Récompenses" value="4 leviers" href="/d/rewards" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MiniList
          title="Mes prochains trajets"
          items={upcoming.map((t) => ({ label: `${t.fromCity} → ${t.toCity}`, meta: formatDateTime(t.departAt), href: `/d/trips/${t.id}/passengers` }))}
          empty="Aucun trajet publié."
        />
        <MiniList
          title="Actions rapides"
          items={[
            { label: "Publier un trajet", href: "/d/trips/publish" },
            { label: "Mes vérifications", href: "/profile/verifications" },
            { label: "Messagerie", href: "/messages" },
          ]}
        />
      </div>
    </PageShell>
  );
}
