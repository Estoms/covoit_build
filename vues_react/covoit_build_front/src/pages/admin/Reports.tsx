import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function AdminReports() {
  const reports = [
    { id: "R-001", subject: "Retard conducteur", status: "Ouvert" },
    { id: "R-002", subject: "Annulation tardive", status: "En cours" },
  ];

  return (
    <PageShell
      title="Signalements"
      subtitle="Modération et traitement (mock)."
      actions={[{ label: "Dashboard", href: "/admin", variant: "secondary" }]}
    >
      <Section title="Liste">
        <div className="space-y-2">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="font-semibold">{r.id} — {r.subject}</div>
              <div className="text-sm text-gray-600">Statut : {r.status}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
