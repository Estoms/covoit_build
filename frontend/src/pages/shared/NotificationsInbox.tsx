import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { listNotifications, markNotificationRead } from "../../api/notifications";
import type { Notification } from "../../types";
import { formatDateTime } from "../../utils/format";

export default function NotificationsInbox() {
  const [items, setItems] = useState<Notification[]>([]);

  function reload() {
    listNotifications().then((r) => setItems(r.items)).catch(() => {});
  }
  useEffect(reload, []);

  async function handleRead(id: string) {
    await markNotificationRead(id);
    reload();
  }

  return (
    <PageShell title="Notifications" nextApi={["GET /notifications", "POST /notifications/:id/read"]}>
      <Section title="Toutes les notifications">
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">Rien à signaler pour le moment.</p>
        ) : (
          <div className="divide-y">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.readAt && handleRead(n.id)}
                className={`w-full text-left py-3 ${!n.readAt ? "bg-brand-yellow-50/60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{n.title}</div>
                  <div className="text-xs text-gray-500">{formatDateTime(n.createdAt)}</div>
                </div>
                <div className="text-sm text-gray-600 mt-0.5">{n.body}</div>
              </button>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
