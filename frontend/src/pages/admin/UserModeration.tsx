import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminDecideVerification, adminVerificationQueue } from "../../api/verifications";
import type { DriverProfileDTO } from "../../types";
import { formatDateTime } from "../../utils/format";

export default function UserModeration() {
  const [items, setItems] = useState<DriverProfileDTO[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});

  function reload() {
    adminVerificationQueue().then((r) => setItems(r.items));
  }
  useEffect(reload, []);

  async function decide(driverUserId: string, approve: boolean) {
    await adminDecideVerification(driverUserId, approve, reason[driverUserId]);
    reload();
  }

  return (
    <PageShell title="Modération des dossiers conducteurs" nextApi={["GET /verifications/admin/queue", "POST /verifications/admin/:id/decision"]}>
      {items.length === 0 ? (
        <Section title="File vide"><p className="text-sm text-gray-600">Aucun dossier en attente.</p></Section>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <Section key={p.id} title={p.user?.fullName ?? "Conducteur"}>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Téléphone : {p.user?.phone ?? "—"}</div>
                <div>Véhicule : {p.vehicleType ?? "—"} ({p.vehiclePlate ?? "—"})</div>
                <div>Casier judiciaire : {p.criminalRecordSubmittedAt ? `soumis le ${formatDateTime(p.criminalRecordSubmittedAt)}` : "non soumis"}</div>
                <div>Échéance : {formatDateTime(p.criminalRecordDueAt)}</div>
              </div>
              <input
                className="mt-3 w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Motif en cas de refus"
                value={reason[p.userId] ?? ""}
                onChange={(e) => setReason((r) => ({ ...r, [p.userId]: e.target.value }))}
              />
              <div className="mt-3 flex gap-2">
                <button onClick={() => decide(p.userId, true)} className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">Approuver</button>
                <button onClick={() => decide(p.userId, false)} className="rounded-xl bg-brand-red-500 px-4 py-2 text-white font-semibold hover:bg-brand-red-600">Refuser</button>
              </div>
            </Section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
