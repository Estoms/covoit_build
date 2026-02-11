import PageShell from "../../ui/PageShell";
import { getAllTrips } from "../../data/tripsStore";
import Section from "../../ui/Section";

export default function AdminTrips() {
  const trips = getAllTrips();

  return (
    <PageShell
      title="Trajets"
      subtitle="Vue admin des trajets publiés (mock + localStorage)."
      actions={[{ label: "Dashboard", href: "/admin", variant: "secondary" }]}
    >
      <Section title="Trajets">
        {trips.length === 0 ? (
          <div className="text-gray-600">Aucun trajet publié pour le moment.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-600">
                <tr className="[&>th]:py-2 [&>th]:pr-4">
                  <th>Trajet</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Places</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {trips.map((t) => (
                  <tr key={t.id} className="border-t [&>td]:py-2 [&>td]:pr-4">
                    <td className="font-semibold">{t.from} → {t.to}</td>
                    <td>{t.date}</td>
                    <td>{t.time}</td>
                    <td>{t.seats}</td>
                    <td>{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
