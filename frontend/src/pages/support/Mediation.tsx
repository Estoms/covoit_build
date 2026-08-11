import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminDisputes } from "../../api/admin";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";
import StatusBadge, { ticketStatusTone } from "../../ui/StatusBadge";

export default function SupportMediation() {
  const [items, setItems] = useState<SupportTicket[]>([]);

  useEffect(() => {
    adminDisputes().then((r) => setItems(r.items));
  }, []);

  return (
    <PageShell title="Médiation" subtitle="Litiges nécessitant une intervention" actions={[{ label: "Console", href: "/support", variant: "secondary" }]} nextApi={["GET /admin/disputes"]}>
      <Section title="Cas en cours">
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">Aucun cas en cours pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {items.map((d) => (
              <Link key={d.id} to={`/support/mediation/${d.id}/tools`} className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm hover:bg-gray-50">
                <div>
                  <div className="font-semibold">{d.subject}</div>
                  <div className="text-sm text-gray-600">{d.createdBy?.fullName} • {formatDateTime(d.createdAt)}</div>
                </div>
                <StatusBadge label={d.status} tone={ticketStatusTone(d.status)} />
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
