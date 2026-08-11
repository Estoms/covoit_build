import { useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const KEY = "mobibenin_driving_preferences";

export default function DrivingPreferences() {
  const initial = (() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  })();

  const [music, setMusic] = useState<boolean>(initial.music ?? true);
  const [smoking, setSmoking] = useState<boolean>(initial.smoking ?? false);
  const [pets, setPets] = useState<boolean>(initial.pets ?? false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem(KEY, JSON.stringify({ music, smoking, pets }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <PageShell title="Préférences de conduite" subtitle="Affichées sur ton profil conducteur">
      <Section title="Ambiance à bord">
        <div className="grid gap-3 max-w-sm">
          <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">Musique acceptée<input type="checkbox" checked={music} onChange={(e) => setMusic(e.target.checked)} /></label>
          <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">Fumeurs acceptés<input type="checkbox" checked={smoking} onChange={(e) => setSmoking(e.target.checked)} /></label>
          <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">Animaux acceptés<input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} /></label>
        </div>
        <button onClick={handleSave} className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700">Enregistrer</button>
        {saved && <p className="mt-2 text-sm text-brand-green-700">Préférences enregistrées.</p>}
      </Section>
    </PageShell>
  );
}
