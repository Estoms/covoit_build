import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
];

type PopularTrip = {
  from: string;
  to: string;
  priceXof: number;
  duration: string;
};

const POPULAR: PopularTrip[] = [
  { from: "Porto-Novo", to: "Cotonou", priceXof: 1500, duration: "≈ 45 min" },
  { from: "Cotonou", to: "Ouidah", priceXof: 1200, duration: "≈ 1h" },
  { from: "Abomey-Calavi", to: "Cotonou", priceXof: 800, duration: "≈ 30 min" },
  { from: "Parakou", to: "Bohicon", priceXof: 6000, duration: "≈ 4h" },
];

function formatXof(amount: number) {
  return new Intl.NumberFormat("fr-BJ", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Badge({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-sm">
      <span className="h-2 w-2 rounded-full bg-gray-900" />
      {children}
    </div>
  );
}

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">
          {n}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function PopularCard({ t }: { t: PopularTrip }) {
  return (
    <Link
      to={`/search/results?from=${encodeURIComponent(t.from)}&to=${encodeURIComponent(t.to)}`}
      className="group rounded-2xl border bg-white p-5 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-600">Trajet populaire</div>
          <div className="mt-1 text-lg font-semibold">
            {t.from} → {t.to}
          </div>
          <div className="mt-1 text-sm text-gray-600">{t.duration}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">À partir de</div>
          <div className="text-lg font-extrabold">{formatXof(t.priceXof)}</div>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 group-hover:underline">
        Voir les trajets →
      </div>
    </Link>
  );
}

export default function Home() {
  const nav = useNavigate();

  const [from, setFrom] = useState("Porto-Novo");
  const [to, setTo] = useState("Cotonou");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const canSearch = useMemo(
    () => from.trim() && to.trim() && from !== to && passengers >= 1,
    [from, to, passengers]
  );

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="rounded-3xl border bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="px-5 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Le covoiturage simple au Bénin
              </h1>
              <p className="mt-3 text-white/80">
                Trouve un trajet, réserve, et voyage en toute confiance.
                Prix en <strong>FCFA</strong> • Fuseau <strong>Africa/Porto-Novo</strong>.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>Profils & avis</Badge>
                <Badge>Paiement sécurisé (à intégrer)</Badge>
                <Badge>Support & modération</Badge>
              </div>
            </div>

            {/* SEARCH CARD */}
            <div className="rounded-2xl bg-white text-gray-900 p-5 md:p-6 shadow-sm">
              <div className="text-base font-semibold">Rechercher un trajet</div>
              <p className="mt-1 text-sm text-gray-600">
                Départ, destination, date et nombre de passagers.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
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

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    Date (optionnel)
                    <input
                      className="rounded-xl border px-3 py-2"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="JJ/MM/AAAA"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    Passagers
                    <input
                      className="rounded-xl border px-3 py-2"
                      type="number"
                      min={1}
                      max={8}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                    />
                  </label>
                </div>

                <button
                  disabled={!canSearch}
                  className="mt-1 rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    nav(
                      `/search/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
                        to
                      )}&date=${encodeURIComponent(date)}&p=${passengers}`
                    )
                  }
                >
                  Rechercher
                </button>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/register"
                    className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 text-center"
                  >
                    Créer un compte
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 text-center"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          Pourquoi choisir CovoitBuild ?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature
            title="Moins cher"
            desc="Partage les frais : des trajets accessibles en FCFA."
          />
          <Feature
            title="Plus simple"
            desc="Recherche rapide, réservation en quelques clics."
          />
          <Feature
            title="Confiance"
            desc="Avis, vérifications et support (à intégrer progressivement)."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          Comment ça marche
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Step n="1" title="Recherche" desc="Choisis départ/destination et trouve un trajet." />
          <Step n="2" title="Réservation" desc="Réserve ta place et reçois la confirmation." />
          <Step n="3" title="Voyage" desc="Rencontre ton conducteur et voyage sereinement." />
        </div>
      </section>

      {/* POPULAR */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Trajets populaires au Bénin
          </h2>
          <Link to="/search" className="text-sm font-medium underline">
            Tout voir
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {POPULAR.map((t) => (
            <PopularCard key={`${t.from}-${t.to}`} t={t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border bg-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold">Tu es conducteur ?</div>
            <p className="mt-1 text-sm text-gray-600">
              Publie ton trajet et commence à recevoir des demandes.
            </p>
          </div>
          <Link
            to="/d/trips/publish"
            className="inline-flex justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-white font-semibold hover:bg-gray-800"
          >
            Publier un trajet
          </Link>
        </div>
      </section>
    </div>
  );
}
