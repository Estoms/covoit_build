import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { createTicket, myTickets } from "../../api/support";
import type { SupportTicket } from "../../types";
import StatusBadge, { ticketStatusTone } from "../../ui/StatusBadge";
import { formatDateTime } from "../../utils/format";
import { ApiClientError } from "../../api/client";
import { Link } from "react-router-dom";

export default function SupportForm({ title }: { title: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function reload() {
    myTickets().then((r) => setTickets(r.items)).catch(() => {});
  }
  useEffect(reload, []);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await createTicket(subject, body);
      setSubject("");
      setBody("");
      reload();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Envoi impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title={title} subtitle="Une question, un souci ? Écris-nous." nextApi={["POST /support/tickets", "GET /support/tickets/mine"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Nouveau ticket">
          <div className="grid gap-3">
            <input className="rounded-xl border px-3 py-2" placeholder="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea className="rounded-xl border px-3 py-2" rows={4} placeholder="Décris ton problème" value={body} onChange={(e) => setBody(e.target.value)} />
            {error && <p className="text-sm text-brand-red-600">{error}</p>}
            <button disabled={submitting || !subject || !body} onClick={handleSubmit} className="rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50 w-fit">
              Envoyer
            </button>
          </div>
        </Section>
        <Section title="Mes tickets">
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-600">Aucun ticket pour le moment.</p>
          ) : (
            <div className="grid gap-2">
              {tickets.map((t) => (
                <Link key={t.id} to={`/support/tickets/${t.id}`} className="flex items-center justify-between rounded-xl border px-3 py-2 hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium">{t.subject}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(t.createdAt)}</div>
                  </div>
                  <StatusBadge label={t.status} tone={ticketStatusTone(t.status)} />
                </Link>
              ))}
            </div>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
