import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getTicket, replyTicket, updateTicketStatus } from "../../api/support";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/format";

export default function MediationTools() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [note, setNote] = useState("");

  function reload() {
    if (id) getTicket(id).then((r) => setTicket(r.ticket));
  }
  useEffect(reload, [id]);

  async function handleResolve(status: "RESOLVED" | "CLOSED") {
    if (!id) return;
    if (note.trim()) await replyTicket(id, note);
    await updateTicketStatus(id, status);
    reload();
  }

  if (!ticket) return <PageShell title="Outils de médiation" subtitle="Chargement…" />;

  return (
    <PageShell title={`Médiation — ${ticket.subject}`} actions={[{ label: "Retour", href: "/support/mediation", variant: "secondary" }]} nextApi={["GET /support/tickets/:id", "PATCH /support/tickets/:id/status"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Historique">
          <div className="space-y-2 text-sm">
            {ticket.messages.map((m) => (
              <div key={m.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-500 mb-1">{formatDateTime(m.createdAt)}</div>
                {m.body}
              </div>
            ))}
          </div>
        </Section>
        <Section title="Décision de médiation">
          <textarea className="w-full rounded-xl border px-3 py-2 text-sm" rows={4} placeholder="Note de résolution (remboursement partiel, avertissement, etc.)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-3 flex gap-2">
            <button onClick={() => handleResolve("RESOLVED")} className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">Marquer résolu</button>
            <button onClick={() => handleResolve("CLOSED")} className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50">Clore sans action</button>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
