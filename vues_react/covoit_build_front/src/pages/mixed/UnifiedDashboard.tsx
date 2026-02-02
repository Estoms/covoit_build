import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

export default function UnifiedDashboard() {
  return (
    <PageShell
      title="Dashboard unifié"
      subtitle="Basculer entre passager et conducteur, historique global et statistiques."
      actions={[
        { label: "Mode passager", href: "/p", variant: "secondary" },
        { label: "Mode conducteur", href: "/d", variant: "primary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Réservations à venir" value="2" hint="Passager" href="/p/bookings/upcoming" />
        <StatCard title="Demandes en attente" value="2" hint="Conducteur" href="/d/requests" />
        <StatCard title="Historique total" value="12" hint="Trajets + réservations" href="/m/history" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList
          title="Dernières réservations"
          items={[
            { label: "Porto-Novo → Cotonou", meta: "14:30 • confirmée", href: "/p/bookings/upcoming" },
          ]}
          empty="Aucune réservation."
        />
        <MiniList
          title="Derniers trajets publiés"
          items={[
            { label: "Cotonou → Ouidah", meta: "09:00 • 3 places", href: "/d/trips" },
          ]}
          empty="Aucun trajet."
        />
      </div>
    </PageShell>
  );
}
