import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DriverDashboard() {
  const requests = [
    { label: "Demande : Porto-Novo → Cotonou", meta: "1 passager • à confirmer", href: "/d/requests" },
    { label: "Demande : Cotonou → Ouidah", meta: "2 passagers • à confirmer", href: "/d/requests" },
  ];

  const myTrips = [
    { label: "Porto-Novo → Cotonou", meta: "Aujourd’hui • 14:30 • 2 places restantes", href: "/d/trips" },
    { label: "Parakou → Bohicon", meta: "Dimanche • 06:00 • complet", href: "/d/trips" },
  ];

  return (
    <PageShell
      title="Tableau de bord conducteur"
      subtitle="Publier, gérer les trajets, demandes et revenus."
      actions={[
        { label: "Publier un trajet", href: "/d/trips/publish", variant: "primary" },
        { label: "Mes trajets", href: "/d/trips", variant: "secondary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Demandes en attente" value="2" hint="À valider" href="/d/requests" />
        <StatCard title="Trajets publiés" value="3" hint="Cette semaine" href="/d/trips" />
        <StatCard title="Gains du mois" value={formatXof(18500)} hint="Mock" href="/d/earnings" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList title="Demandes de réservation" items={requests} empty="Aucune demande." />
        <MiniList title="Mes trajets" items={myTrips} empty="Aucun trajet publié." />
      </div>
    </PageShell>
  );
}
