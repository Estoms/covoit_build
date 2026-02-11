import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";

// "Base" locale mock (créée lors de l'inscription)
const USERS_KEY = "covoitbuild_mock_users";

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
  const [showPassword, setShowPassword] = useState(false);
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
                // ✅ MOCK login
                // Si l'utilisateur a déjà été créé via Register, on réutilise ses rôles.
                try {
                  const raw = localStorage.getItem(USERS_KEY);
                  const list = raw ? (JSON.parse(raw) as any[]) : [];
                  const users = Array.isArray(list) ? list : [];
                  const found = users.find((u) => {
                    const sameEmail = u?.email && identifier.includes("@") && u.email === identifier;
                    const samePhone = u?.phone && identifier.includes("+229") && u.phone === identifier;
                    return sameEmail || samePhone;
                  });

                  if (found && Array.isArray(found?.roles)) {
                    login({
                      id: found.id || "u_" + Date.now(),
                      fullName: found.fullName || "Utilisateur",
                      email: found.email,
                      phone: found.phone,
                      roles: found.roles,
                      // en test, on considère l'email vérifié si l'utilisateur passe par /verify-email
                      emailVerified: found.emailVerified ?? true,
                    });
                    nav(from, { replace: true });
                    return;
                  }
                } catch {
                  // ignore
                }

                // Sinon on crée un utilisateur passager par défaut
                login({
                  id: "u_" + Date.now(),
                  fullName: "Utilisateur",
                  email: identifier.includes("@") ? identifier : undefined,
                  phone: identifier.includes("+229") ? identifier : undefined,
                  roles: ["PASSENGER"],
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