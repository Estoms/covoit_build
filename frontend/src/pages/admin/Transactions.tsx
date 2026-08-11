import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminListTransactions } from "../../api/admin";
import type { WalletTransaction } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";

export default function Transactions() {
  const [items, setItems] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    adminListTransactions().then((r) => setItems(r.items));
  }, []);

  return (
    <PageShell title="Transactions" nextApi={["GET /admin/transactions"]}>
      <Section title="Toutes les transactions">
        {items.length === 0 ? <p className="text-sm text-gray-600">Aucune transaction.</p> : (
          <div className="divide-y">
            {items.map((t) => (
              <div key={t.id} className="flex justify-between py-2 text-sm">
                <div><div className="font-medium">{t.type}</div><div className="text-xs text-gray-500">{formatDateTime(t.createdAt)}</div></div>
                <div className="font-semibold">{formatXof(t.amountXof)}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
