import { useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const PREF_KEY = "mobibenin_preferred_momo";

export default function PaymentMethods() {
  const [provider, setProvider] = useState<"MTN" | "MOOV">(() => (localStorage.getItem(`${PREF_KEY}_provider`) as "MTN" | "MOOV" | null) || "MTN");
  const [phone, setPhone] = useState(() => localStorage.getItem(`${PREF_KEY}_phone`) || "+229 ");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem(`${PREF_KEY}_provider`, provider);
    localStorage.setItem(`${PREF_KEY}_phone`, phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageShell title="Moyens de paiement" subtitle="MobiBenin fonctionne uniquement en Mobile Money (MTN / Moov)">
      <Section title="Numéro préféré">
        <p className="text-sm text-gray-600 mb-4">
          Ce numéro sera pré-rempli lors de tes prochains paiements. Aucune donnée bancaire n'est stockée par
          MobiBenin : chaque paiement passe par une confirmation Mobile Money sur ton téléphone.
        </p>
        <div className="flex gap-3 mb-4">
          {(["MTN", "MOOV"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`flex-1 rounded-xl border px-4 py-3 font-semibold ${provider === p ? "border-brand-green-500 bg-brand-green-50 text-brand-green-700" : "border-gray-300"}`}
            >
              {p === "MTN" ? "MTN MoMo" : "Moov Money"}
            </button>
          ))}
        </div>
        <label className="grid gap-1 text-sm">
          Numéro
          <input className="rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <button onClick={handleSave} className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700">
          Enregistrer
        </button>
        {saved && <p className="mt-2 text-sm text-brand-green-700">Préférence enregistrée.</p>}
      </Section>
    </PageShell>
  );
}
