import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { allTickets } from "../../api/support";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";
import StatusBadge, { ticketStatusTone } from "../../ui/StatusBadge";

export default function SupportTickets() {
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<SupportTicket[]>([]);

  useEffect(() => {
    allTickets(status || undefined).then((r) => setItems(r.items));
  }, [status]);

  return (
    <PageShell title="Tickets" subtitle="Gestion des demandes utilisateurs" actions={[{ label: "Console", href: "/support", variant: "secondary" }]} nextApi={["GET /support/tickets"]}>
      <Section title="Liste" action={
        <select className="rounded-xl border px-3 py-1.5 text-sm bg-white" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous</option>
          <option value="OPEN">Ouvert</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="RESOLVED">Résolu</option>
          <option value="CLOSED">Fermé</option>
        </select>
      }>
        {items.length === 0 ? <p className="text-sm text-gray-600">Aucun ticket.</p> : (
          <div className="space-y-2">
            {items.map((t) => (
              <Link key={t.id} to={`/support/tickets/${t.id}`} className="block rounded-2xl border bg-white p-4 shadow-sm hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{t.subject}</div>
                  <StatusBadge label={t.status} tone={ticketStatusTone(t.status)} />
                </div>
                <div className="text-sm text-gray-600">De : {t.createdBy?.fullName} • {formatDateTime(t.createdAt)}</div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
