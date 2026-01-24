import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const BENIN_CITIES = [
  "Porto-Novo",
  "Cotonou",
  "Abomey-Calavi",
  "Ouidah",
  "Allada",
  "Bohicon",
  "Abomey",
  "Parakou",
  "Natitingou",
  "Djougou",
  "Lokossa",
  "Comè",
  "Kandi",
  "Malanville",
  "Savalou",
  "Savè",
];

export default function Search() {
  const nav = useNavigate();

  const [from, setFrom] = useState("Porto-Novo");
  const [to, setTo] = useState("Cotonou");
  const [date, setDate] = useState("");

  const canSearch = useMemo(() => from.trim() && to.trim() && from !== to, [from, to]);

  return (
    <PageShell
      title="Rechercher un trajet"
      subtitle="Bénin • Devise : FCFA • Fuseau : Africa/Porto-Novo"
      actions={[{ label: "Voir des exemples", href: "/search/results", variant: "secondary" }]}
    >
      <Section title="Critères de recherche">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm">
            Départ
            <select
              className="rounded-xl border px-3 py-2 bg-white"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {BENIN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Destination
            <select
              className="rounded-xl border px-3 py-2 bg-white"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {BENIN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Date (optionnel)
            <input
              className="rounded-xl border px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="JJ/MM/AAAA"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            disabled={!canSearch}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              nav(
                `/search/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
                  to
                )}&date=${encodeURIComponent(date)}`
              )
            }
          >
            Rechercher
          </button>

          <button
            className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
            onClick={() => {
              setFrom("Porto-Novo");
              setTo("Cotonou");
              setDate("");
            }}
          >
            Réinitialiser
          </button>
        </div>

        {!canSearch && (
          <p className="mt-3 text-sm text-gray-600">
            Choisis un départ et une destination différents.
          </p>
        )}
      </Section>
    </PageShell>
  );
}
