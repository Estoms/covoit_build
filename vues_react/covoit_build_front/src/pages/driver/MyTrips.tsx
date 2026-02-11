import React, { useMemo } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { getStoredTrips } from "../../data/tripsStore";

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MyTrips() {
  const { user } = useAuth();

  const myTrips = useMemo(() => {
    const all = getStoredTrips();
    // En mock, on filtre par nom (à remplacer par driverId quand le backend sera branché)
    return all.filter((t) => (user?.fullName ? t.driverName === user.fullName : true));
  }, [user?.fullName]);

  return (
    <PageShell
      title="Mes trajets proposés"
      subtitle="Conducteur • Gestion des trajets (mock localStorage)"
      actions={[{ label: "Publier un trajet", href: "/d/trips/publish", variant: "primary" }]}
      nextApi={["GET /trips/me", "PUT /trips/{id}", "DELETE /trips/{id}"]}
    >
      <Section title="Liste">
        {myTrips.length === 0 ? (
          <p className="text-gray-600">
            Aucun trajet publié pour l’instant. Clique sur <strong>Publier un trajet</strong>.
          </p>
        ) : (
          <div className="grid gap-3">
            {myTrips.map((t) => (
              <div key={t.id} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="font-semibold">
                      {t.from} → {t.to}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t.dateTime} • Places: {t.seatsLeft} • {formatXof(t.priceXof)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">Publié</div>
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
        )}
      </Section>
    </PageShell>
  );
}
