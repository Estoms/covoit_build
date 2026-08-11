import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatXof } from "../../utils/format";

const BENIN_CITIES = ["Porto-Novo", "Cotonou", "Abomey-Calavi", "Ouidah", "Allada", "Bohicon", "Abomey", "Parakou", "Natitingou", "Djougou", "Lokossa", "Comè", "Kandi", "Malanville"];

type PopularTrip = { from: string; to: string; priceXof: number; duration: string };
const POPULAR: PopularTrip[] = [
  { from: "Cotonou", to: "Parakou", priceXof: 6000, duration: "≈ 6h" },
  { from: "Porto-Novo", to: "Cotonou", priceXof: 1500, duration: "≈ 45 min" },
  { from: "Cotonou", to: "Ouidah", priceXof: 1200, duration: "≈ 1h" },
  { from: "Abomey-Calavi", to: "Cotonou", priceXof: 800, duration: "≈ 30 min" },
];

function Badge({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white">
      <span className="h-2 w-2 rounded-full bg-brand-yellow-500" />
      {children}
    </div>
  );
}

function Feature({ title, desc, tone }: { title: string; desc: string; tone: "green" | "yellow" | "red" }) {
  const bar = { green: "bg-brand-green-500", yellow: "bg-brand-yellow-500", red: "bg-brand-red-500" }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
      <span className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-600 text-white text-sm font-bold">{n}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function PopularCard({ t }: { t: PopularTrip }) {
  return (
    <Link to={`/search/results?fromCity=${encodeURIComponent(t.from)}&toCity=${encodeURIComponent(t.to)}`} className="group rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-600">Trajet populaire</div>
          <div className="mt-1 text-lg font-semibold">{t.from} → {t.to}</div>
          <div className="mt-1 text-sm text-gray-600">{t.duration}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">À partir de</div>
          <div className="text-lg font-extrabold">{formatXof(t.priceXof)}</div>
        </div>
      </div>
      <div className="mt-4 inline-flex items-center text-sm font-medium text-brand-green-700 group-hover:underline">Voir les trajets →</div>
    </Link>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [fromCity, setFromCity] = useState("Cotonou");
  const [toCity, setToCity] = useState("Parakou");
  const [date, setDate] = useState("");

  const canSearch = useMemo(() => fromCity.trim() && toCity.trim() && fromCity !== toCity, [fromCity, toCity]);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#086b3a 0%,#0b8a4a 55%,#0b8a4a 55%,#f2b705 55%,#f2b705 78%,#e8112d 78%)" }}>
        <div className="px-5 py-10 md:px-10 md:py-14 bg-black/25">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Le covoiturage interurbain du Bénin</h1>
              <p className="mt-3 text-white/90">
                Cotonou ↔ Parakou et au-delà. Réserve, paye en Mobile Money, voyage en confiance.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>Conducteurs vérifiés</Badge>
                <Badge>Paiement Mobile Money</Badge>
                <Badge>Messagerie privée intégrée</Badge>
              </div>
            </div>

            <div className="rounded-2xl bg-white text-gray-900 p-5 md:p-6 shadow-lg">
              <div className="text-base font-semibold">Rechercher un trajet</div>
              <p className="mt-1 text-sm text-gray-600">Départ, destination et date.</p>
              <div className="mt-4 grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">Départ
                    <select className="rounded-xl border px-3 py-2 bg-white" value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
                      {BENIN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">Destination
                    <select className="rounded-xl border px-3 py-2 bg-white" value={toCity} onChange={(e) => setToCity(e.target.value)}>
                      {BENIN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label className="grid gap-1 text-sm">Date (optionnel)
                  <input className="rounded-xl border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} type="date" />
                </label>
                <button
                  disabled={!canSearch}
                  className="mt-1 rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => nav(`/search/results?fromCity=${encodeURIComponent(fromCity)}&toCity=${encodeURIComponent(toCity)}&date=${encodeURIComponent(date)}`)}
                >
                  Rechercher
                </button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/register" className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 text-center">Créer un compte</Link>
                  <Link to="/login" className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 text-center">Se connecter</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Pourquoi choisir MobiBenin ?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature tone="green" title="Moins cher" desc="Partage les frais : des trajets accessibles en FCFA, moins chers que le bus classique." />
          <Feature tone="yellow" title="Plus simple" desc="Recherche rapide, réservation et paiement Mobile Money en quelques clics." />
          <Feature tone="red" title="Confiance" desc="Conducteurs vérifiés (permis, casier judiciaire), avis et messagerie privée." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Comment ça marche</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Step n="1" title="Recherche" desc="Choisis départ/destination et trouve un trajet." />
          <Step n="2" title="Réservation & paiement" desc="Réserve ta place, paie via MTN MoMo ou Moov Money." />
          <Step n="3" title="Voyage" desc="Coordonne-toi avec ton conducteur via la messagerie, puis voyage sereinement." />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Trajets populaires au Bénin</h2>
          <Link to="/search" className="text-sm font-medium underline">Tout voir</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {POPULAR.map((t) => <PopularCard key={`${t.from}-${t.to}`} t={t} />)}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold">Tu es conducteur ?</div>
            <p className="mt-1 text-sm text-gray-600">Publie ton trajet, garde plus de tes gains grâce à la commission dégressive.</p>
          </div>
          <Link to="/register" className="inline-flex justify-center rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700">
            Devenir conducteur
          </Link>
        </div>
      </section>
    </div>
  );
}
