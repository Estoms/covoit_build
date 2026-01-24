import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function Payment() {
  const { bookingId } = useParams();
  const nav = useNavigate();

  const [method, setMethod] = useState<"MOBILE_MONEY" | "CARD">("MOBILE_MONEY");
  const [phone, setPhone] = useState("+229 ");
  const [name, setName] = useState("");

  const canPay =
    bookingId &&
    (method === "CARD" ? name.trim().length >= 2 : phone.replace(/\s/g, "").startsWith("+229"));

  return (
    <PageShell
      title="Paiement"
      subtitle={`Réservation : ${bookingId}`}
      actions={[{ label: "Retour", href: "/p/bookings/upcoming", variant: "secondary" }]}
      nextApi={["POST /payments", "POST /payments/confirm", "GET /payments/{id}"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Méthode de paiement">
          <div className="grid gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "MOBILE_MONEY"}
                onChange={() => setMethod("MOBILE_MONEY")}
              />
              Mobile Money (Bénin)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "CARD"}
                onChange={() => setMethod("CARD")}
              />
              Carte bancaire
            </label>
          </div>

          {method === "MOBILE_MONEY" ? (
            <div className="mt-4 grid gap-2">
              <label className="grid gap-1 text-sm">
                Numéro (ex: +229 01 90 00 00 00)
                <input
                  className="rounded-xl border px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <p className="text-xs text-gray-500">
                (Mock) On vérifiera le paiement côté serveur.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-2">
              <label className="grid gap-1 text-sm">
                Nom sur la carte
                <input
                  className="rounded-xl border px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fouwad GBADAMASSI"
                />
              </label>
              <p className="text-xs text-gray-500">
                (Mock) Les infos de carte ne sont pas gérées ici.
              </p>
            </div>
          )}
        </Section>

        <Section title="Confirmation">
          <p className="text-sm text-gray-600">
            Clique sur “Payer” pour simuler un paiement réussi.
          </p>

          <button
            disabled={!canPay}
            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => nav(`/p/booking/confirmation/${bookingId}`)}
          >
            Payer (mock)
          </button>

          {!canPay && (
            <p className="mt-2 text-sm text-red-600">
              Vérifie les informations du moyen de paiement.
            </p>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
