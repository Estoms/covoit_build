import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyWallet } from "../../api/wallet";
import type { WalletTransaction } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";

export default function PayoutDetails() {
  const { transactionId } = useParams();
  const [tx, setTx] = useState<WalletTransaction | null>(null);

  useEffect(() => {
    getMyWallet().then((r) => setTx(r.transactions.find((t) => t.id === transactionId) ?? null));
  }, [transactionId]);

  if (!tx) return <PageShell title="Détail du versement" subtitle="Introuvable" />;

  return (
    <PageShell title="Détail du versement" nextApi={["GET /wallet/me"]}>
      <Section title={tx.type}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Montant</span><span className="font-semibold">{formatXof(tx.amountXof)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Date</span><span>{formatDateTime(tx.createdAt)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Statut</span><span>{tx.status}</span></div>
        </div>
      </Section>
    </PageShell>
  );
}
