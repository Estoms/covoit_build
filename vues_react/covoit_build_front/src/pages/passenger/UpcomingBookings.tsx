import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

export default function UpcomingBookings() {
  const items = [
    { label: "Porto-Novo → Cotonou", meta: "Aujourd’hui • 14:30 • Confirmée", href: "/p" },
    { label: "Cotonou → Ouidah", meta: "Demain • 09:00 • En attente", href: "/p" },
  ];

  return (
    <PageShell
      title="Mes réservations"
      subtitle="Réservations à venir (mock)."
      actions={[
        { label: "Rechercher un trajet", href: "/search", variant: "primary" },
        { label: "Dashboard", href: "/p", variant: "secondary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="À venir" value="2" hint="Mock" />
        <StatCard title="En attente" value="1" hint="Mock" />
        <StatCard title="Annulées" value="0" hint="Mock" />
      </div>

      <div className="mt-6">
        <MiniList title="Prochaines réservations" items={items} />
      </div>
    </PageShell>
  );
}
