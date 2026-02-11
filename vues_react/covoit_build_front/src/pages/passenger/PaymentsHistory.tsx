import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

type PaymentRow = { id: string; label: string; amount: string; status: string; date: string };

export default function PaymentsHistory() {
  const rows: PaymentRow[] = [
    { id: "PAY-001", label: "Porto-Novo → Cotonou", amount: "2 000 XOF", status: "Payé", date: "2026-02-01" },
    { id: "PAY-002", label: "Cotonou → Ouidah", amount: "1 500 XOF", status: "Remboursé", date: "2026-01-25" },
  ];

  return (
    <PageShell
      title="Historique des paiements"
      subtitle="Suivi des paiements (mock)."
      actions={[{ label: "Dashboard", href: "/p", variant: "secondary" }]}
    >
      <Section title="Transactions">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr className="[&>th]:py-2 [&>th]:pr-4">
                <th>Référence</th>
                <th>Trajet</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {rows.map((r) => (
                <tr key={r.id} className="border-t [&>td]:py-2 [&>td]:pr-4">
                  <td className="font-semibold">{r.id}</td>
                  <td>{r.label}</td>
                  <td>{r.amount}</td>
                  <td>{r.status}</td>
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
