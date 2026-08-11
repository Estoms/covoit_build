import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyDriverRewards } from "../../api/driverRewards";
import StatusBadge from "../../ui/StatusBadge";

export default function Rewards() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyDriverRewards>> | null>(null);

  useEffect(() => {
    getMyDriverRewards().then(setData);
  }, []);

  if (!data) return <PageShell title="Mes récompenses" subtitle="Chargement…" />;

  return (
    <PageShell title="Mes récompenses conducteur" subtitle={`${data.tripsThisMonth} trajet(s) ce mois-ci`} nextApi={["GET /driver-rewards/me"]}>
      <div className="grid gap-4 md:grid-cols-2">
        <Section title="1. Commission dégressive">
          <div className="text-3xl font-extrabold text-brand-green-700">{data.commissionRatePercent}%</div>
          <p className="mt-1 text-sm text-gray-600">
            Prochain palier si tu continues ce mois : <strong>{data.projectedNextCommissionRatePercent}%</strong>. Plus tu roules, moins tu payes de commission (toujours sous le taux standard du marché).
          </p>
        </Section>

        <Section title="2. Priorité dans l'algorithme">
          <div className="text-3xl font-extrabold text-brand-green-700">{data.algoPriorityScore} pts</div>
          <p className="mt-1 text-sm text-gray-600">
            Ton score combine ta note moyenne, ta régularité et ta certification. Un score élevé fait remonter tes
            trajets en tête des résultats de recherche des passagers.
          </p>
        </Section>

        <Section title="3. Zéro frais Cash-Out" action={<StatusBadge label={data.operationalPack.cashoutFeeWaiverActive ? "Actif" : "Inactif"} tone={data.operationalPack.cashoutFeeWaiverActive ? "success" : "neutral"} />}>
          <p className="text-sm text-gray-600">
            Quand ce statut est actif, MobiBenin prend en charge la part restante des frais de retrait Mobile Money
            sur tes courses : tu récupères l'intégralité de tes gains.
          </p>
        </Section>

        <Section title="4. Pass Data & Recharge" action={<StatusBadge label={data.operationalPack.dataPassEligible ? "Éligible" : "Non éligible"} tone={data.operationalPack.dataPassEligible ? "success" : "neutral"} />}>
          <p className="text-sm text-gray-600">
            Dès que tu es éligible, un pass data / recharge te sera crédité (ex: 2 allers-retours Cotonou-Parakou
            dans le mois) pour couvrir ta connexion pendant que tu conduis.
          </p>
        </Section>
      </div>

      <div className="mt-4 rounded-2xl border border-brand-yellow-200 bg-brand-yellow-50 p-4 text-sm text-brand-yellow-700">
        {data.operationalPack.note}
      </div>
    </PageShell>
  );
}
