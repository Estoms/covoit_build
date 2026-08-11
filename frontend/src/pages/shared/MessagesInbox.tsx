import { useEffect, useRef, useState } from "react";
import PageShell from "../../ui/PageShell";
import { listConversations, getConversationMessages, sendMessage } from "../../api/messaging";
import type { Conversation, Message } from "../../types";
import { useAuth } from "../../auth/AuthContext";
import { formatDateTime } from "../../utils/format";

export default function MessagesInbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  function reloadList() {
    listConversations().then((r) => {
      setConversations(r.items);
      if (!activeId && r.items[0]) setActiveId(r.items[0].id);
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ne doit s'exécuter qu'au montage
  useEffect(reloadList, []);

  useEffect(() => {
    if (!activeId) return;
    getConversationMessages(activeId).then((r) => setMessages(r.messages));
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!activeId || !draft.trim()) return;
    const body = draft;
    setDraft("");
    const { message } = await sendMessage(activeId, body);
    setMessages((m) => [...m, message]);
  }

  const active = conversations.find((c) => c.id === activeId);
  const otherName = active ? (active.passengerId === user?.id ? active.driver.fullName : active.passenger.fullName) : "";

  return (
    <PageShell title="Messagerie" subtitle="Coordonne tes trajets sans partager ton numéro" nextApi={["GET /messaging/conversations", "GET /messaging/conversations/:id/messages", "POST /messaging/conversations/:id/messages"]}>
      <div className="grid gap-4 md:grid-cols-[280px_1fr] rounded-2xl border border-gray-200 bg-white overflow-hidden" style={{ minHeight: 420 }}>
        <div className="border-r border-gray-200 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-600">Aucune conversation. Elle apparaît dès qu'une réservation est confirmée.</p>
          ) : (
            conversations.map((c) => {
              const name = c.passengerId === user?.id ? c.driver.fullName : c.passenger.fullName;
              const last = c.messages[0];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${activeId === c.id ? "bg-brand-green-50" : ""}`}
                >
                  <div className="font-medium text-sm">{name}</div>
                  {last && <div className="text-xs text-gray-500 truncate">{last.body}</div>}
                </button>
              );
            })
          )}
        </div>

        <div className="flex flex-col">
          {active ? (
            <>
              <div className="border-b border-gray-200 px-4 py-3 font-semibold text-sm">{otherName}</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.senderId === user?.id ? "ml-auto bg-brand-green-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {m.body}
                    <div className={`mt-1 text-[10px] ${m.senderId === user?.id ? "text-brand-green-100" : "text-gray-400"}`}>{formatDateTime(m.createdAt)}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-200 p-3 flex gap-2">
                <input
                  className="flex-1 rounded-xl border px-3 py-2 text-sm"
                  placeholder="Écrire un message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">
                  Envoyer
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Sélectionne une conversation.</div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
