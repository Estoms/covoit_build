import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { MOCK_TRIPS } from "../../data/mockTrips";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SearchResults() {
  const [sp] = useSearchParams();
  const qFrom = sp.get("from") || "";
  const qTo = sp.get("to") || "";

  const [minSeats, setMinSeats] = useState(1);

  const results = useMemo(() => {
    return MOCK_TRIPS.filter((t) => {
      const okFrom = qFrom ? t.from.toLowerCase().includes(qFrom.toLowerCase()) : true;
      const okTo = qTo ? t.to.toLowerCase().includes(qTo.toLowerCase()) : true;
      const okSeats = t.seatsLeft >= minSeats;
      return okFrom && okTo && okSeats;
    });
  }, [qFrom, qTo, minSeats]);

  const subtitle =
    qFrom || qTo ? `Trajets : ${qFrom || "—"} → ${qTo || "—"}` : "Exemples de trajets au Bénin";

  return (
    <PageShell
      title="Résultats de recherche"
      subtitle={subtitle}
      actions={[
        { label: "Modifier la recherche", href: "/search", variant: "secondary" },
      ]}
    >
      <Section title="Filtres">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="text-sm flex items-center gap-2">
            Places minimum
            <input
              className="w-20 rounded-xl border px-3 py-2"
              type="number"
              min={1}
              value={minSeats}
              onChange={(e) => setMinSeats(Number(e.target.value))}
            />
          </label>
          <p className="text-sm text-gray-600">
            Prix affichés en FCFA (XOF)
          </p>
        </div>
      </Section>

      <Section title={`${results.length} trajet(s) trouvé(s)`}>
        {results.length === 0 ? (
          <p className="text-gray-600">Aucun trajet trouvé. Essaie un autre filtre.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((t) => (
              <div key={t.id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-600">Conducteur</div>
                    <div className="font-semibold">
                      {t.driverName} <span className="text-gray-500">• {t.driverRating}/5</span>
                    </div>
                  </div>
                  <div className="font-extrabold">{formatXof(t.priceXof)}</div>
                </div>

                <div className="mt-3 text-lg font-semibold">
                  {t.from} → {t.to}
                </div>
                <div className="text-sm text-gray-600">Départ : {t.dateTime}</div>

                <div className="mt-2 text-sm">
                  Places restantes : <span className="font-semibold">{t.seatsLeft}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/trips/${t.id}`}
                    className="inline-flex flex-1 justify-center rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800"
                  >
                    Voir le trajet
                  </Link>
                  <Link
                    to={`/p/trips/${t.id}`}
                    className="inline-flex flex-1 justify-center rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
                  >
                    Vue passager
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
