import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function SupportTickets() {
  const tickets = [
    { id: "T-101", from: "Awa K.", subject: "Problème paiement", status: "Ouvert" },
    { id: "T-102", from: "Kossi D.", subject: "Litige réservation", status: "En cours" },
  ];

  return (
    <PageShell
      title="Tickets"
      subtitle="Gestion des tickets (mock)."
      actions={[{ label: "Console", href: "/support", variant: "secondary" }]}
    >
      <Section title="Liste">
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold">{t.id} — {t.subject}</div>
              <div className="text-sm text-gray-600">De : {t.from} • Statut : {t.status}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
