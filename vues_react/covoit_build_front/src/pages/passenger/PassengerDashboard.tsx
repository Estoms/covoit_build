import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PassengerDashboard() {
  const upcoming = [
    {
      label: "Porto-Novo → Cotonou",
      meta: "Aujourd’hui • 14:30 • 1 place",
      href: "/p/bookings/upcoming",
    },
    {
      label: "Cotonou → Ouidah",
      meta: "Demain • 09:00 • 2 places",
      href: "/p/bookings/upcoming",
    },
  ];

  const messages = [
    { label: "Kossi : “Je suis à la gare”", meta: "il y a 5 min", href: "/p/messages" },
    { label: "Awa : “Départ à 9h”", meta: "hier", href: "/p/messages" },
  ];

  return (
    <PageShell
      title="Tableau de bord passager"
      subtitle="Rechercher, réserver, payer, voyager et laisser un avis."
      actions={[
        { label: "Rechercher", href: "/search", variant: "primary" },
        { label: "Messages", href: "/p/messages", variant: "secondary" },
      ]}
      nextApi={["POST /bookings", "GET /bookings/me", "POST /payments", "POST /reviews"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Réservations à venir"
          value="2"
          hint="Cette semaine"
          href="/p/bookings/upcoming"
        />
        <StatCard
          title="Dépenses du mois"
          value={formatXof(3500)}
          hint="Mock"
          href="/p/payments/history"
        />
        <StatCard
          title="Avis à laisser"
          value="1"
          hint="Après un trajet"
          href="/p/review"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList title="Prochains trajets" items={upcoming} empty="Aucune réservation à venir." />
        <MiniList title="Messages récents" items={messages} empty="Aucun message." />
      </div>
    </PageShell>
  );
}
