import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";

export default function VerifyEmail() {
  const { user, updateUser } = useAuth();
  const nav = useNavigate();

  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  const email = user?.email;

  const canContinue = useMemo(() => {
    return !!email;
  }, [email]);

  return (
    <PageShell
      title="Confirme ton email"
      subtitle="On t’a envoyé un lien de confirmation. Vérifie ta boîte mail (et les spams)."
      actions={[
        { label: "Retour accueil", href: "/", variant: "secondary" },
      ]}
      nextApi={[
        "POST /auth/send-verification-email",
        "GET /auth/verify-email?token=...",
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Étape 1 — Vérifie ta boîte mail">
          {email ? (
            <p className="text-sm text-gray-700">
              Email : <span className="font-semibold">{email}</span>
            </p>
          ) : (
            <p className="text-sm text-red-600">
              Aucun email trouvé. Reviens à l’inscription.
            </p>
          )}

          <button
            disabled={!canContinue}
            className="mt-4 w-full rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // MOCK : ici -> POST /auth/send-verification-email
              setSent(true);
              setTimeout(() => setSent(false), 2500);
            }}
          >
            Renvoyer l’email
          </button>

          {sent && (
            <p className="mt-3 text-sm text-green-700">
              Email de confirmation renvoyé (mock).
            </p>
          )}

          <p className="mt-4 text-xs text-gray-500">
            Plus tard : vraie vérification via un lien avec token.
          </p>
        </Section>

        <Section title="Étape 2 — J’ai confirmé">
          <p className="text-sm text-gray-600">
            Quand tu as cliqué sur le lien reçu par email, reviens ici et clique sur “Continuer”.
          </p>

          <button
            disabled={!canContinue || checking}
            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // MOCK : ici -> GET /auth/verify-email?token=...
              setChecking(true);
              setTimeout(() => {
                updateUser({ emailVerified: true });
                setChecking(false);
                nav("/p"); // ou redirection selon rôle (on le fera après si tu veux)
              }, 600);
            }}
          >
            {checking ? "Vérification..." : "Continuer"}
          </button>

          <div className="mt-4 text-sm text-gray-600">
            Besoin d’aide ?{" "}
            <Link className="underline" to="/help">
              FAQ
            </Link>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
