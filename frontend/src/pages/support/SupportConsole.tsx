import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import { MiniList, StatCard } from "../../ui/DashboardCards";
import { allTickets } from "../../api/support";
import { adminDisputes } from "../../api/admin";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";

export default function SupportConsole() {
  const [open, setOpen] = useState<SupportTicket[]>([]);
  const [inProgress, setInProgress] = useState<SupportTicket[]>([]);
  const [disputes, setDisputes] = useState<SupportTicket[]>([]);

  useEffect(() => {
    allTickets("OPEN").then((r) => setOpen(r.items));
    allTickets("IN_PROGRESS").then((r) => setInProgress(r.items));
    adminDisputes().then((r) => setDisputes(r.items));
  }, []);

  return (
    <PageShell
      title="Console support"
      subtitle="Tickets utilisateurs, médiation et outils internes."
      actions={[
        { label: "Tickets", href: "/support/tickets" },
        { label: "FAQ interne", href: "/support/internal-faq", variant: "secondary" },
      ]}
      nextApi={["GET /support/tickets", "GET /admin/disputes"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tickets ouverts" value={String(open.length)} href="/support/tickets" tone="success" />
        <StatCard title="En cours" value={String(inProgress.length)} href="/support/tickets" tone="warning" />
        <StatCard title="Cas médiation" value={String(disputes.length)} href="/support/mediation" tone="danger" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniList
          title="Derniers tickets ouverts"
          items={open.map((t) => ({ label: t.subject, meta: formatDateTime(t.createdAt), href: `/support/tickets/${t.id}` }))}
          empty="Aucun ticket ouvert."
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
