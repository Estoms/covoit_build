import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const CITIES = ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Ouidah", "Bohicon", "Natitingou"];

export default function Search() {
  const nav = useNavigate();
  const [fromCity, setFromCity] = useState("Cotonou");
  const [toCity, setToCity] = useState("Parakou");
  const [date, setDate] = useState("");

  function handleSearch() {
    const qs = new URLSearchParams();
    if (fromCity) qs.set("fromCity", fromCity);
    if (toCity) qs.set("toCity", toCity);
    if (date) qs.set("date", date);
    nav(`/search/results?${qs.toString()}`);
  }

  return (
    <PageShell
      title="Rechercher un trajet"
      subtitle="Entre les grandes villes du Bénin, en particulier Cotonou ↔ Parakou."
      nextApi={["GET /trips?fromCity=&toCity=&date="]}
      showBack={false}
    >
      <Section title="Critères">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">
            Départ
            <select className="rounded-xl border px-3 py-2 bg-white" value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Arrivée
            <select className="rounded-xl border px-3 py-2 bg-white" value={toCity} onChange={(e) => setToCity(e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Date (optionnel)
            <input type="date" className="rounded-xl border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700"
        >
          Rechercher
        </button>
      </Section>
    </PageShell>
  );
}
