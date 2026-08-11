import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { login as loginApi } from "../../api/auth";
import { ApiClientError } from "../../api/client";

function normalizePhoneBJ(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function looksLikeBeninPhone(value: string) {
  const cleaned = normalizePhoneBJ(value);
  return cleaned.startsWith("+229") && cleaned.length >= 12;
}

export default function Login() {
  const { loginWithToken } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState("+229 ");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!looksLikeBeninPhone(phone)) e.push("Entre un numéro de téléphone du Bénin valide (+229…).");
    if (password.length < 6) e.push("Le mot de passe doit contenir au moins 6 caractères.");
    return e;
  }, [phone, password]);

  const canSubmit = errors.length === 0 && !submitting;
  const from = (location.state as { from?: string } | null)?.from;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await loginApi(normalizePhoneBJ(phone), password);
      loginWithToken(result.user, result.accessToken);

      if (from) return nav(from, { replace: true });
      if (result.user.roles.includes("ADMIN")) return nav("/admin", { replace: true });
      if (result.user.roles.includes("SUPPORT")) return nav("/support", { replace: true });
      if (result.user.roles.includes("PASSENGER_DRIVER")) return nav("/m", { replace: true });
      if (result.user.roles.includes("DRIVER")) return nav("/d", { replace: true });
      return nav("/p", { replace: true });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Connexion"
      subtitle="Téléphone +229 • Mot de passe"
      actions={[{ label: "Créer un compte", href: "/register", variant: "secondary" }]}
      nextApi={["POST /auth/login", "POST /auth/refresh", "GET /users/me"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Accéder à mon compte">
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Téléphone
              <input
                className="rounded-xl border px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 01 90 00 00 00"
                autoComplete="username"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Mot de passe
              <div className="relative">
                <input
                  className="w-full rounded-xl border px-3 py-2 pr-24"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-xs font-medium hover:bg-gray-50"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </label>

            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Connexion…" : "Se connecter"}
            </button>

            {(errors.length > 0 || error) && (
              <div className="rounded-xl border border-brand-red-200 bg-brand-red-50 p-3">
                <p className="text-sm font-semibold text-brand-red-700">À corriger :</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-brand-red-700 space-y-1">
                  {errors.map((x) => <li key={x}>{x}</li>)}
                  {error && <li>{error}</li>}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link to="/register" className="underline">Pas de compte ?</Link>
              <span className="text-gray-400">Mot de passe oublié : contacte le support</span>
            </div>
          </div>
        </Section>

        <Section title="Comptes de démonstration">
          <p className="text-sm text-gray-600">Si le backend a été initialisé avec <code>npm run seed</code> :</p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Admin : <code>+22900000001</code></li>
            <li>Conducteur vérifié : <code>+22997000001</code></li>
            <li>Passager : <code>+22996000002</code></li>
            <li>Mot de passe : <code>password123</code></li>
          </ul>
        </Section>
      </div>
    </PageShell>
  );
}
