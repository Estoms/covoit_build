import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getBooking } from "../../api/bookings";
import { getPaymentIntent, initiatePayment } from "../../api/wallet";
import type { Booking } from "../../types";
import { formatXof } from "../../utils/format";
import { ApiClientError } from "../../api/client";

type PayState = "IDLE" | "PENDING" | "SUCCESS" | "FAILED";

export default function Payment() {
  const { bookingId } = useParams();
  const nav = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [provider, setProvider] = useState<"MTN" | "MOOV">("MTN");
  const [phone, setPhone] = useState("+229 ");
  const [state, setState] = useState<PayState>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    getBooking(bookingId).then((r) => setBooking(r.booking)).catch(() => setError("Réservation introuvable."));
    return () => { if (pollRef.current) window.clearInterval(pollRef.current); };
  }, [bookingId]);

  useEffect(() => {
    if (booking?.status === "CONFIRMED") {
      nav(`/p/booking/confirmation/${booking.id}`);
    }
  }, [booking, nav]);

  async function handlePay() {
    if (!booking) return;
    setError(null);
    setState("PENDING");
    try {
      const res = await initiatePayment(booking.id, provider, phone);
      pollRef.current = window.setInterval(async () => {
        try {
          const intent = await getPaymentIntent(res.reference);
          if (intent.intent.status === "SUCCESS") {
            window.clearInterval(pollRef.current!);
            setState("SUCCESS");
            nav(`/p/booking/confirmation/${booking.id}`);
          } else if (intent.intent.status === "FAILED") {
            window.clearInterval(pollRef.current!);
            setState("FAILED");
          }
        } catch {
          // ignore transient polling errors
        }
      }, 1500);
    } catch (err) {
      setState("FAILED");
      setError(err instanceof ApiClientError ? err.message : "Paiement impossible.");
    }
  }

  if (error && !booking) {
    return <PageShell title="Paiement" subtitle="Erreur"><Section title="Erreur"><p className="text-sm text-brand-red-600">{error}</p></Section></PageShell>;
  }
  if (!booking) return <PageShell title="Paiement" subtitle="Chargement…" />;

  return (
    <PageShell title="Paiement Mobile Money" subtitle={`Réservation ${booking.id}`} nextApi={["POST /wallet/payments/initiate", "GET /wallet/payments/:reference"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Choisis ton opérateur">
          <div className="grid gap-3">
            <div className="flex gap-3">
              {(["MTN", "MOOV"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`flex-1 rounded-xl border px-4 py-3 font-semibold ${provider === p ? "border-brand-green-500 bg-brand-green-50 text-brand-green-700" : "border-gray-300"}`}
                >
                  {p === "MTN" ? "MTN MoMo" : "Moov Money"}
                </button>
              ))}
            </div>
            <label className="grid gap-1 text-sm">
              Numéro Mobile Money
              <input className="rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>

            {state === "PENDING" && (
              <div className="rounded-xl border border-brand-yellow-200 bg-brand-yellow-50 p-3 text-sm text-brand-yellow-700">
                Confirme la transaction sur ton téléphone… en attente du webhook de paiement.
              </div>
            )}
            {state === "FAILED" && (
              <div className="rounded-xl border border-brand-red-200 bg-brand-red-50 p-3 text-sm text-brand-red-700">
                {error ?? "Le paiement a échoué. Réessaie."}
              </div>
            )}

            <button
              disabled={state === "PENDING"}
              onClick={handlePay}
              className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50"
            >
              {state === "PENDING" ? "En attente de confirmation…" : `Payer ${formatXof(booking.totalChargedXof)}`}
            </button>
          </div>
        </Section>

        <Section title="Détail du montant">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Montant du trajet</span><span>{formatXof(booking.tripAmountXof)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Ta part des frais de retrait</span><span>{formatXof(booking.passengerFeeShareXof)}</span></div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-extrabold">{formatXof(booking.totalChargedXof)}</span></div>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
