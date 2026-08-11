import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyLoyalty } from "../../api/loyalty";

export default function Loyalty() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyLoyalty>> | null>(null);

  useEffect(() => {
    getMyLoyalty().then(setData);
  }, []);

  if (!data) return <PageShell title="Fidélité" subtitle="Chargement…" />;

  const { account, tiers, nextTier } = data;

  return (
    <PageShell title="Programme de fidélité" subtitle="Cumule des points à chaque trajet complété" nextApi={["GET /loyalty/me"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Mon solde">
          <div className="text-4xl font-extrabold text-brand-green-700">{account.points} pts</div>
          <p className="mt-2 text-sm text-gray-600">{account.completedTrips} trajet(s) complété(s) via MobiBenin.</p>
          {nextTier && (
            <div className="mt-4 rounded-xl border border-brand-yellow-200 bg-brand-yellow-50 p-3 text-sm text-brand-yellow-700">
              Encore {Math.max(nextTier.threshold - account.points, 0)} points avant : <strong>{nextTier.label}</strong>
            </div>
          )}
        </Section>
        <Section title="Paliers de récompense">
          <ul className="space-y-2">
            {tiers.map((t) => (
              <li key={t.label} className={`flex justify-between rounded-xl border px-3 py-2 text-sm ${account.points >= t.threshold ? "border-brand-green-200 bg-brand-green-50" : "border-gray-200"}`}>
                <span>{t.label}</span>
                <span className="font-semibold">{t.threshold} pts</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Trajet gratuit ou tickets valeur chez nos futurs partenaires, comme prévu par le programme de gratification MobiBenin.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
