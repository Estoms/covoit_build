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

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PublishTrip() {
  const nav = useNavigate();

  const [from, setFrom] = useState("Porto-Novo");
  const [to, setTo] = useState("Cotonou");
  const [date, setDate] = useState(""); // JJ/MM/AAAA
  const [time, setTime] = useState(""); // HH:mm
  const [meetingPoint, setMeetingPoint] = useState("Gare routière");
  const [dropPoint, setDropPoint] = useState("Centre-ville");
  const [seats, setSeats] = useState(3);
  const [priceXof, setPriceXof] = useState(1500);
  const [car, setCar] = useState("Toyota Corolla");

  const canPublish = useMemo(() => {
    return (
      from.trim() &&
      to.trim() &&
      from !== to &&
      date.trim().length >= 8 &&
      time.trim().length >= 4 &&
      meetingPoint.trim().length >= 3 &&
      dropPoint.trim().length >= 3 &&
      seats >= 1 &&
      seats <= 8 &&
      priceXof >= 0 &&
      car.trim().length >= 2
    );
  }, [from, to, date, time, meetingPoint, dropPoint, seats, priceXof, car]);

  const preview = useMemo(() => {
    return {
      route: `${from} → ${to}`,
      dt: date && time ? `${date} à ${time}` : "—",
      price: formatXof(priceXof),
      seats,
      meetingPoint,
      dropPoint,
      car,
    };
  }, [from, to, date, time, priceXof, seats, meetingPoint, dropPoint, car]);

  return (
    <PageShell
      title="Publier un trajet"
      subtitle="Conducteur • Bénin • Prix en FCFA • Responsive"
      actions={[{ label: "Mes trajets", href: "/d/trips", variant: "secondary" }]}
      nextApi={[
        "POST /trips",
        "PUT /trips/{id}",
        "GET /trips/me",
        "GET /vehicles/me",
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Formulaire">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                Date (JJ/MM/AAAA)
                <input
                  className="rounded-xl border px-3 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="23/01/2026"
                />
              </label>

              <label className="grid gap-1 text-sm">
                Heure (HH:mm)
                <input
                  className="rounded-xl border px-3 py-2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="14:30"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm">
              Point de rendez-vous
              <input
                className="rounded-xl border px-3 py-2"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder="Ex: Gare routière de Porto-Novo"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Point d’arrivée
              <input
                className="rounded-xl border px-3 py-2"
                value={dropPoint}
                onChange={(e) => setDropPoint(e.target.value)}
                placeholder="Ex: Dantokpa (Cotonou)"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-1 text-sm">
                Places
                <input
                  className="rounded-xl border px-3 py-2"
                  type="number"
                  min={1}
                  max={8}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                />
              </label>

              <label className="grid gap-1 text-sm">
                Prix (FCFA)
                <input
                  className="rounded-xl border px-3 py-2"
                  type="number"
                  min={0}
                  value={priceXof}
                  onChange={(e) => setPriceXof(Number(e.target.value))}
                />
              </label>

              <label className="grid gap-1 text-sm">
                Véhicule
                <input
                  className="rounded-xl border px-3 py-2"
                  value={car}
                  onChange={(e) => setCar(e.target.value)}
                  placeholder="Ex: Toyota Corolla"
                />
              </label>
            </div>

            <button
              disabled={!canPublish}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                // Mock : en vrai => POST /trips
                nav("/d/trips");
              }}
            >
              Publier (mock)
            </button>

            {!canPublish && (
              <p className="text-sm text-gray-600">
                Vérifie : villes différentes, date/heure, points, places, prix, véhicule.
              </p>
            )}
          </div>
        </Section>

        <Section title="Aperçu">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Trajet :</span>{" "}
              <span className="font-semibold">{preview.route}</span>
            </div>
            <div>
              <span className="text-gray-600">Départ :</span>{" "}
              <span className="font-semibold">{preview.dt}</span>
            </div>
            <div>
              <span className="text-gray-600">Prix :</span>{" "}
              <span className="font-semibold">{preview.price}</span>
            </div>
            <div>
              <span className="text-gray-600">Places :</span>{" "}
              <span className="font-semibold">{preview.seats}</span>
            </div>
            <div>
              <span className="text-gray-600">Rendez-vous :</span>{" "}
              <span className="font-semibold">{preview.meetingPoint}</span>
            </div>
            <div>
              <span className="text-gray-600">Arrivée :</span>{" "}
              <span className="font-semibold">{preview.dropPoint}</span>
            </div>
            <div>
              <span className="text-gray-600">Véhicule :</span>{" "}
              <span className="font-semibold">{preview.car}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Prochaine étape : publier vers l’API Trajets et gérer les véhicules.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
