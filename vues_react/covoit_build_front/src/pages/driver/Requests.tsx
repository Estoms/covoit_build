import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

export default function Requests() {
  const items = [
    { label: "Porto-Novo → Cotonou", meta: "1 passager • En attente", href: "/d/requests" },
    { label: "Cotonou → Ouidah", meta: "2 passagers • En attente", href: "/d/requests" },
  ];

  return (
    <PageShell
      title="Demandes de réservation"
      subtitle="Gérer les demandes (mock)."
      actions={[
        { label: "Mes trajets", href: "/d/trips", variant: "secondary" },
        { label: "Publier", href: "/d/trips/publish", variant: "primary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="En attente" value="2" hint="Mock" />
        <StatCard title="Acceptées" value="0" hint="Mock" />
        <StatCard title="Refusées" value="0" hint="Mock" />
      </div>

      <div className="mt-6">
        <MiniList title="Dernières demandes" items={items} />
      </div>
    </PageShell>
  );
}
