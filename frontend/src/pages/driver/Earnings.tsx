import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { StatCard } from "../../ui/DashboardCards";
import Section from "../../ui/Section";
import { getMyWallet } from "../../api/wallet";
import { getMyDriverRewards } from "../../api/driverRewards";
import { formatXof } from "../../utils/format";
import { Link } from "react-router-dom";

export default function Earnings() {
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<Awaited<ReturnType<typeof getMyDriverRewards>> | null>(null);

  useEffect(() => {
    getMyWallet().then((r) => setBalance(r.wallet.balanceXof));
    getMyDriverRewards().then(setRewards);
  }, []);

  return (
    <PageShell title="Mes gains" actions={[{ label: "Historique complet", href: "/d/earnings/history", variant: "secondary" }]} nextApi={["GET /wallet/me", "GET /driver-rewards/me"]}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Solde disponible" value={formatXof(balance)} tone="success" />
        <StatCard title="Trajets ce mois" value={rewards ? String(rewards.tripsThisMonth) : "…"} />
        <StatCard title="Commission actuelle" value={rewards ? `${rewards.commissionRatePercent}%` : "…"} tone="warning" />
      </div>
      <div className="mt-6">
        <Section title="Astuce">
          <p className="text-sm text-gray-600">
            Plus tu roules avec MobiBenin, plus ta commission baisse et plus tu débloques d'avantages. Consulte le
            détail dans <Link className="underline" to="/d/rewards">mes récompenses</Link>.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
