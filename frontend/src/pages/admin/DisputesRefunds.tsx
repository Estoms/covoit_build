import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminDisputes } from "../../api/admin";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";
import StatusBadge, { ticketStatusTone } from "../../ui/StatusBadge";

export default function DisputesRefunds() {
  const [items, setItems] = useState<SupportTicket[]>([]);

  useEffect(() => {
    adminDisputes().then((r) => setItems(r.items));
  }, []);

  return (
    <PageShell title="Litiges & remboursements" subtitle="Tickets de support liés à des réservations, non résolus" nextApi={["GET /admin/disputes"]}>
      {items.length === 0 ? (
        <Section title="Rien à traiter"><p className="text-sm text-gray-600">Aucun litige ouvert.</p></Section>
      ) : (
        <div className="grid gap-3">
          {items.map((d) => (
            <Link key={d.id} to={`/support/tickets/${d.id}`}>
              <Section title={d.subject} action={<StatusBadge label={d.status} tone={ticketStatusTone(d.status)} />}>
                <div className="text-sm text-gray-600">{d.createdBy?.fullName} • {formatDateTime(d.createdAt)}</div>
              </Section>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
