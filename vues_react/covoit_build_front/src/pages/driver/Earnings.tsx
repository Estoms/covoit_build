import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function Earnings() {
  const rows = [
    { trip: "Porto-Novo → Cotonou", amount: "4 000 XOF", date: "2026-02-02" },
    { trip: "Cotonou → Ouidah", amount: "3 000 XOF", date: "2026-01-29" },
  ];

  return (
    <PageShell
      title="Gains"
      subtitle="Suivi des gains conducteur (mock)."
      actions={[{ label: "Dashboard", href: "/d", variant: "secondary" }]}
    >
      <Section title="Résumé">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm border">
            <div className="text-sm text-gray-600">Ce mois</div>
            <div className="text-2xl font-extrabold">7 000 XOF</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border">
            <div className="text-sm text-gray-600">En attente</div>
            <div className="text-2xl font-extrabold">0 XOF</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-extrabold">52 000 XOF</div>
          </div>
        </div>
      </Section>

      <Section title="Historique">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr className="[&>th]:py-2 [&>th]:pr-4">
                <th>Trajet</th>
                <th>Montant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t [&>td]:py-2 [&>td]:pr-4">
                  <td>{r.trip}</td>
                  <td className="font-semibold">{r.amount}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
