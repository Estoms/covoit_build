import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

const MY_TRIPS = [
  { id: "d1", route: "Porto-Novo → Cotonou", date: "23/01/2026 14:30", seats: 3, price: 1500, status: "Publié" },
  { id: "d2", route: "Cotonou → Ouidah", date: "24/01/2026 09:00", seats: 2, price: 1200, status: "Publié" },
  { id: "d3", route: "Parakou → Bohicon", date: "25/01/2026 06:00", seats: 0, price: 6000, status: "Complet" },
];

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MyTrips() {
  return (
    <PageShell
      title="Mes trajets proposés"
      subtitle="Conducteur • Gestion des trajets (mock)"
      actions={[{ label: "Publier un trajet", href: "/d/trips/publish", variant: "primary" }]}
      nextApi={["GET /trips/me", "PUT /trips/{id}", "DELETE /trips/{id}"]}
    >
      <Section title="Liste">
        <div className="grid gap-3">
          {MY_TRIPS.map((t) => (
            <div key={t.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-semibold">{t.route}</div>
                  <div className="text-sm text-gray-600">
                    {t.date} • Places: {t.seats} • {formatXof(t.price)}
                  </div>
                </div>
                <div className="text-sm font-semibold">{t.status}</div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <a
                  className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 text-center"
                  href={`/d/trips/${t.id}/edit`}
                >
                  Modifier
                </a>
                <button className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800">
                  Annuler (mock)
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
