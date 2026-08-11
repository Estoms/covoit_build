import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getTicket, replyTicket, updateTicketStatus } from "../../api/support";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";
import StatusBadge, { ticketStatusTone } from "../../ui/StatusBadge";
import { useAuth } from "../../auth/AuthContext";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");

  function reload() {
    if (id) getTicket(id).then((r) => setTicket(r.ticket));
  }
  useEffect(reload, [id]);

  const isStaff = user?.roles.includes("SUPPORT") || user?.roles.includes("ADMIN");

  async function handleReply() {
    if (!id || !reply.trim()) return;
    await replyTicket(id, reply);
    setReply("");
    reload();
  }

  async function handleStatus(status: string) {
    if (!id) return;
    await updateTicketStatus(id, status);
    reload();
  }

  if (!ticket) return <PageShell title="Ticket" subtitle="Chargement…" />;

  return (
    <PageShell
      title={ticket.subject}
      subtitle={`Ouvert par ${ticket.createdBy?.fullName} le ${formatDateTime(ticket.createdAt)}`}
      actions={isStaff ? [
        { label: "Marquer en cours", onClick: () => handleStatus("IN_PROGRESS"), variant: "secondary" as const },
        { label: "Résoudre", onClick: () => handleStatus("RESOLVED") },
      ] : []}
      nextApi={["GET /support/tickets/:id", "POST /support/tickets/:id/messages", "PATCH /support/tickets/:id/status"]}
    >
      <Section title="Conversation" action={<StatusBadge label={ticket.status} tone={ticketStatusTone(ticket.status)} />}>
        <div className="space-y-3">
          {ticket.messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="text-xs text-gray-500 mb-1">{formatDateTime(m.createdAt)}</div>
              {m.body}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 rounded-xl border px-3 py-2 text-sm" placeholder="Répondre…" value={reply} onChange={(e) => setReply(e.target.value)} />
          <button onClick={handleReply} className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">Envoyer</button>
        </div>
      </Section>
    </PageShell>
  );
}
