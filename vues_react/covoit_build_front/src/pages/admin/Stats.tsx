import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function AdminStats() {
  return (
    <PageShell
      title="Statistiques"
      subtitle="KPIs plateforme (mock)."
      actions={[{ label: "Dashboard", href: "/admin", variant: "secondary" }]}
    >
      <Section title="KPIs">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">Taux conversion</div>
            <div className="text-2xl font-extrabold">12%</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">NPS</div>
            <div className="text-2xl font-extrabold">47</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">Trajets / jour</div>
            <div className="text-2xl font-extrabold">1 280</div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
