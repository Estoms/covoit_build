import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyVerifications, setPayoutMode } from "../../api/verifications";

export default function PayoutSettings() {
  const [mode, setMode] = useState<"ADVANCE_THEN_FINAL" | "FULL_AT_END">("ADVANCE_THEN_FINAL");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyVerifications().then((d) => {
      if (d.driver?.payoutModePreference) setMode(d.driver.payoutModePreference);
    });
  }, []);

  async function handleChange(next: "ADVANCE_THEN_FINAL" | "FULL_AT_END") {
    setMode(next);
    setSaving(true);
    try {
      await setPayoutMode(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="Préférences de versement" nextApi={["GET /verifications/me", "PATCH /verifications/driver/payout-mode"]}>
      <Section title="Comment veux-tu être payé ?">
        <div className="grid gap-3">
          <button
            onClick={() => handleChange("ADVANCE_THEN_FINAL")}
            className={`text-left rounded-xl border p-4 ${mode === "ADVANCE_THEN_FINAL" ? "border-brand-green-500 bg-brand-green-50" : "border-gray-200"}`}
          >
            <div className="font-semibold">Acompte au départ + solde en fin de course</div>
            <div className="text-sm text-gray-600 mt-1">Tu reçois une partie du montant au moment du départ pour couvrir tes frais (essence, péage), puis le reste à la fin.</div>
          </button>
          <button
            onClick={() => handleChange("FULL_AT_END")}
            className={`text-left rounded-xl border p-4 ${mode === "FULL_AT_END" ? "border-brand-green-500 bg-brand-green-50" : "border-gray-200"}`}
          >
            <div className="font-semibold">Totalité en fin de course</div>
            <div className="text-sm text-gray-600 mt-1">Tu reçois l'intégralité du montant une fois le trajet terminé.</div>
          </button>
        </div>
        {saving && <p className="mt-3 text-sm text-gray-500">Enregistrement…</p>}
      </Section>
    </PageShell>
  );
}
