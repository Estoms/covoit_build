import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getAllTrips } from "../../data/tripsStore";

export default function MixedHistory() {
  const trips = getAllTrips().slice(0, 10);

  return (
    <PageShell
      title="Historique"
      subtitle="Historique global (mock + localStorage)."
      actions={[
        { label: "Dashboard unifié", href: "/m", variant: "secondary" },
        { label: "Rechercher", href: "/search", variant: "primary" },
      ]}
    >
      <Section title="Derniers trajets publiés">
        {trips.length === 0 ? (
          <div className="text-gray-600">Aucun trajet publié pour le moment.</div>
        ) : (
          <div className="space-y-2">
            {trips.map((t) => (
              <div key={t.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="font-semibold">{t.from} → {t.to}</div>
                <div className="text-sm text-gray-600">{t.date} • {t.time} • {t.seats} places • {t.price}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
