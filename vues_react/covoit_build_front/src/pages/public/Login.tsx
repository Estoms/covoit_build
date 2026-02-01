import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function looksLikeBeninPhone(value: string) {
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+229") && cleaned.length >= 12;
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const errors = useMemo(() => {
    const e: string[] = [];

    const okIdentifier =
      isValidEmail(identifier) || looksLikeBeninPhone(identifier);

    if (!okIdentifier) {
      e.push("Entre un email valide ou un téléphone du Bénin (+229…).");
    }

    if (password.length < 6) {
      e.push("Le mot de passe doit contenir au moins 6 caractères.");
    }

    return e;
  }, [identifier, password]);

  const canSubmit = errors.length === 0;

  const from = (location.state as any)?.from || "/p";

  return (
    <PageShell
      title="Connexion"
      subtitle="Email ou téléphone (+229) • Session mock"
      actions={[{ label: "Créer un compte", href: "/register", variant: "secondary" }]}
      nextApi={["POST /auth/login", "POST /auth/refresh", "GET /me"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Accéder à mon compte">
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Email ou téléphone
              <input
                className="rounded-xl border px-3 py-2"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="exemple@mail.com ou +229 01 90 00 00 00"
                autoComplete="username"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Mot de passe
              <input
                className="rounded-xl border px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Rester connecté
            </label>

            <button
              disabled={!canSubmit}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                // MOCK utilisateur
                login({
                  id: "u_" + Date.now(),
                  fullName: "Utilisateur",
                  email: identifier.includes("@") ? identifier : undefined,
                  phone: identifier.includes("+229") ? identifier : undefined,
                  roles: ["PASSENGER"], // rôle par défaut
                });

                nav(from, { replace: true });
              }}
            >
              Se connecter (mock)
            </button>

            {errors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-700">À corriger :</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-red-700 space-y-1">
                  {errors.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link to="/register" className="underline">
                Pas de compte ?
              </Link>
              <button
                className="underline text-gray-700"
                type="button"
                onClick={() => alert("Mock : mot de passe oublié")}
              >
                Mot de passe oublié
              </button>
            </div>
          </div>
        </Section>

        <Section title="Infos">
          <p className="text-sm text-gray-600">
            Cette connexion est en mode <strong>mock</strong>.
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>La session est stockée dans le navigateur (localStorage)</li>
            <li>Les rôles contrôlent l’accès aux pages protégées</li>
            <li>Prochaine étape : brancher une vraie API d’authentification</li>
          </ul>
        </Section>
      </div>
    </PageShell>
  );
}
