import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyWallet } from "../../api/wallet";
import type { WalletTransaction } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";

export default function WalletHistory({ title }: { title: string }) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getMyWallet().then((r) => { setTransactions(r.transactions); setBalance(r.wallet.balanceXof); });
  }, []);

  return (
    <PageShell title={title} subtitle={`Solde portefeuille : ${formatXof(balance)}`} nextApi={["GET /wallet/me"]}>
      <Section title="Transactions">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-600">Aucune transaction pour le moment.</p>
        ) : (
          <div className="divide-y">
            {transactions.map((t) => (
              <div key={t.id} className="flex justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{t.type}</div>
                  <div className="text-gray-500 text-xs">{formatDateTime(t.createdAt)}</div>
                </div>
                <div className="font-semibold">{formatXof(t.amountXof)}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
