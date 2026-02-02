import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

export default function SupportConsole() {
  return (
    <PageShell
      title="Console support"
      subtitle="Tickets utilisateurs, médiation et outils internes."
      actions={[
        { label: "Tickets", href: "/support/tickets", variant: "primary" },
        { label: "FAQ interne", href: "/support/internal-faq", variant: "secondary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tickets ouverts" value="18" hint="Mock" href="/support/tickets" />
        <StatCard title="En attente réponse" value="6" hint="Mock" href="/support/tickets" />
        <StatCard title="Cas médiation" value="2" hint="Mock" href="/support/mediation" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList
          title="Derniers tickets"
          items={[
            { label: "Paiement non confirmé", meta: "Utilisateur: u_123", href: "/support/tickets" },
            { label: "Annulation trajet", meta: "Utilisateur: u_987", href: "/support/tickets" },
          ]}
          empty="Aucun ticket."
        />
        <MiniList
          title="Outils"
          items={[
            { label: "Médiation", meta: "gestion litiges", href: "/support/mediation" },
            { label: "FAQ interne", meta: "procédures", href: "/support/internal-faq" },
          ]}
          empty=""
        />
      </div>
    </PageShell>
  );
}
