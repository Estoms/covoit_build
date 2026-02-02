import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";

export default function AdminDashboard() {
  return (
    <PageShell
      title="Dashboard administrateur"
      subtitle="Supervision, modération, finance et configuration."
      actions={[
        { label: "Utilisateurs", href: "/admin/users", variant: "secondary" },
        { label: "Statistiques", href: "/admin/stats", variant: "primary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Utilisateurs actifs" value="12 450" hint="Mock" href="/admin/users" />
        <StatCard title="Trajets aujourd’hui" value="1 280" hint="Mock" href="/admin/trips" />
        <StatCard title="Signalements" value="7" hint="À traiter" href="/admin/reports" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList
          title="Derniers signalements"
          items={[
            { label: "Litige paiement", meta: "il y a 10 min", href: "/admin/reports" },
            { label: "Comportement abusif", meta: "il y a 1 h", href: "/admin/reports" },
          ]}
          empty="Aucun signalement."
        />
        <MiniList
          title="Actions rapides"
          items={[
            { label: "Configurer règles métier", meta: "pricing, limites, etc.", href: "/admin/rules" },
            { label: "Contenus statiques", meta: "FAQ, pages légales", href: "/admin/content" },
          ]}
          empty=""
        />
      </div>
    </PageShell>
  );
}
