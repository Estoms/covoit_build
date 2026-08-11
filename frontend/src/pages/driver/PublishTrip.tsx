import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { createTrip } from "../../api/trips";
import { useAuth } from "../../auth/AuthContext";
import { ApiClientError } from "../../api/client";

export default function PublishTrip() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [fromCity, setFromCity] = useState("Cotonou");
  const [fromPoint, setFromPoint] = useState("");
  const [toCity, setToCity] = useState("Parakou");
  const [toPoint, setToPoint] = useState("");
  const [departAt, setDepartAt] = useState("");
  const [pricePerSeatXof, setPricePerSeatXof] = useState(5000);
  const [seatsTotal, setSeatsTotal] = useState(3);
  const [vehicleLabel, setVehicleLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isVerified = user?.driverVerification?.status === "APPROVED";

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const { trip } = await createTrip({ fromCity, fromPoint, toCity, toPoint, departAt, pricePerSeatXof, seatsTotal, vehicleLabel: vehicleLabel || undefined });
      nav(`/d/trips/${trip.id}/passengers`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Publication impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isVerified) {
    return (
      <PageShell title="Publier un trajet" subtitle="Vérification requise">
        <Section title="Dossier non validé">
          <p className="text-sm text-gray-600">
            Ton dossier conducteur doit être validé par un administrateur avant de publier un trajet.
          </p>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell title="Publier un trajet" nextApi={["POST /trips"]}>
      <Section title="Détails du trajet">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">Ville de départ<input className="rounded-xl border px-3 py-2" value={fromCity} onChange={(e) => setFromCity(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Point de départ précis<input className="rounded-xl border px-3 py-2" value={fromPoint} onChange={(e) => setFromPoint(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Ville d'arrivée<input className="rounded-xl border px-3 py-2" value={toCity} onChange={(e) => setToCity(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Point d'arrivée précis<input className="rounded-xl border px-3 py-2" value={toPoint} onChange={(e) => setToPoint(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Date et heure de départ<input type="datetime-local" className="rounded-xl border px-3 py-2" value={departAt} onChange={(e) => setDepartAt(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Véhicule<input className="rounded-xl border px-3 py-2" value={vehicleLabel} onChange={(e) => setVehicleLabel(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Prix par place (XOF)<input type="number" className="rounded-xl border px-3 py-2" value={pricePerSeatXof} onChange={(e) => setPricePerSeatXof(Number(e.target.value))} /></label>
          <label className="grid gap-1 text-sm">Nombre de places<input type="number" min={1} max={8} className="rounded-xl border px-3 py-2" value={seatsTotal} onChange={(e) => setSeatsTotal(Number(e.target.value))} /></label>
        </div>
        {error && <p className="mt-3 text-sm text-brand-red-600">{error}</p>}
        <button disabled={submitting} onClick={handleSubmit} className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50">
          {submitting ? "Publication…" : "Publier le trajet"}
        </button>
      </Section>
    </PageShell>
  );
}
