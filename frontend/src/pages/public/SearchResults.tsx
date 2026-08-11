import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { searchTrips } from "../../api/trips";
import type { Trip } from "../../types";
import { formatXof } from "../../utils/format";

export default function SearchResults() {
  const [params] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fromCity = params.get("fromCity") ?? undefined;
  const toCity = params.get("toCity") ?? undefined;
  const date = params.get("date") ?? undefined;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- recherche déclenchée à chaque changement de filtre
    setLoading(true);
    searchTrips({ fromCity, toCity, date })
      .then((res) => setTrips(res.items))
      .catch(() => setError("Impossible de charger les trajets."))
      .finally(() => setLoading(false));
  }, [fromCity, toCity, date]);

  return (
    <PageShell
      title="Résultats"
      subtitle={`${fromCity ?? "?"} → ${toCity ?? "?"}${date ? ` • ${date}` : ""}`}
      actions={[{ label: "Nouvelle recherche", href: "/search", variant: "secondary" }]}
      nextApi={["GET /trips"]}
    >
      {loading && <Section title="Chargement">…</Section>}
      {error && <Section title="Erreur"><p className="text-brand-red-600 text-sm">{error}</p></Section>}
      {!loading && !error && trips.length === 0 && (
        <Section title="Aucun trajet"><p className="text-sm text-gray-600">Aucun trajet disponible pour ces critères.</p></Section>
      )}
      <div className="grid gap-4">
        {trips.map((t) => (
          <Link key={t.id} to={`/trips/${t.id}`} className="block">
            <Section title={`${t.fromCity} → ${t.toCity}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="text-gray-600">
                  {new Date(t.departAt).toLocaleString("fr-FR")} • {t.driver.fullName}
                  {t.driver.avgRating ? ` • ★ ${t.driver.avgRating}` : ""}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{t.seatsAvailable} place(s)</span>
                  <span className="font-extrabold">{formatXof(t.pricePerSeatXof)}</span>
                </div>
              </div>
            </Section>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
