import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import {type Role, useAuth } from "../../auth/AuthContext";

// Mock "base de données" locale pour pouvoir se reconnecter avec le bon rôle
const USERS_KEY = "covoitbuild_mock_users";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizePhoneBJ(phone: string) {
  // On garde + et chiffres
  return phone.replace(/[^\d+]/g, "");
}

function isValidBeninPhone(phone: string) {
  const p = normalizePhoneBJ(phone);
  // Souple: +229XXXXXXXX ou +229XXXXXXXXX (formats peuvent varier)
  return p.startsWith("+229") && p.length >= 12;
}

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [roleChoice, setRoleChoice] = useState<"PASSENGER" | "DRIVER" | "BOTH">("PASSENGER");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+229 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (fullName.trim().length < 2) e.push("Le nom doit contenir au moins 2 caractères.");
    if (!isValidEmail(email)) e.push("Email invalide.");
    if (!isValidBeninPhone(phone)) e.push("Téléphone invalide (ex: +229 01 90 00 00 00).");
    if (password.length < 6) e.push("Le mot de passe doit contenir au moins 6 caractères.");
    if (password !== confirmPassword) e.push("Les mots de passe ne correspondent pas.");
    if (!agree) e.push("Tu dois accepter les conditions d’utilisation.");
    return e;
  }, [fullName, email, phone, password, confirmPassword, agree]);

  const canSubmit = errors.length === 0;

  const roles: Role[] =
    roleChoice === "DRIVER"
      ? ["DRIVER"]
      : roleChoice === "BOTH"
      ? ["PASSENGER", "DRIVER"]
      : ["PASSENGER"];

  return (
    <PageShell
      title="Inscription"
      subtitle="Bénin • Téléphone +229 • Session mock avec rôles"
      actions={[{ label: "J’ai déjà un compte", href: "/login", variant: "secondary" }]}
      nextApi={["POST /auth/register", "POST /auth/send-otp", "GET /me"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Créer un compte">
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Je suis
              <select
                className="rounded-xl border px-3 py-2 bg-white"
                value={roleChoice}
                onChange={(e) => setRoleChoice(e.target.value as any)}
              >
                <option value="PASSENGER">Passager</option>
                <option value="DRIVER">Conducteur</option>
                <option value="BOTH">Passager + Conducteur</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Nom complet
              <input
                className="rounded-xl border px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Fouwad GBADAMASSI"
                autoComplete="name"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Email
              <input
                className="rounded-xl border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@mail.com"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Téléphone (Bénin)
              <input
                className="rounded-xl border px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 01 90 00 00 00"
                inputMode="tel"
                autoComplete="tel"
              />
              <span className="text-xs text-gray-500">
                Conseil : commence par <strong>+229</strong>.
              </span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                Mot de passe
                <div className="relative">
                  <input
                    className="w-full rounded-xl border px-3 py-2 pr-24"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

              <label className="grid gap-1 text-sm">
                Confirmer
                <div className="relative">
                  <input
                    className="w-full rounded-xl border px-3 py-2 pr-24"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-xs font-medium hover:bg-gray-50"
                  >
                    {showConfirmPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </label>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                J’accepte les{" "}
                <Link className="underline" to="/terms">
                  Conditions d’utilisation
                </Link>{" "}
                et la{" "}
                <Link className="underline" to="/privacy">
                  Politique de confidentialité
                </Link>
                .
              </span>
            </label>

            <button
              disabled={!canSubmit}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                // MOCK : en vrai => POST /auth/register + OTP
                const u = {
                  id: "u_" + Date.now(),
                  fullName: fullName.trim(),
                  email: email.trim(),
                  phone: normalizePhoneBJ(phone),
                  roles,
                  emailVerified: false,
                };

                // ✅ Persiste l'utilisateur dans une liste locale pour pouvoir se reconnecter ensuite
                try {
                  const raw = localStorage.getItem(USERS_KEY);
                  const list = raw ? (JSON.parse(raw) as any[]) : [];
                  const next = Array.isArray(list) ? list : [];
                  const idx = next.findIndex(
                    (x) => x?.email === u.email || x?.phone === u.phone
                  );
                  if (idx >= 0) next[idx] = { ...next[idx], ...u };
                  else next.unshift(u);
                  localStorage.setItem(USERS_KEY, JSON.stringify(next));
                } catch {
                  // ignore
                }

                // ✅ Ouvre une session avec le bon rôle
                login(u);

                // ✅ Une seule redirection : la page email décidera ensuite du dashboard
                nav("/verify-email");
              }}
            >
              Créer mon compte (mock)
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
          </div>
        </Section>

        <Section title="Déjà inscrit ?">
          <p className="text-sm text-gray-600">
            Connecte-toi pour accéder à ton tableau de bord.
          </p>

          <Link
            to="/login"
            className="mt-4 inline-flex w-full justify-center rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
          >
            Aller à la connexion
          </Link>

          <p className="mt-4 text-xs text-gray-500">
            Prochaine étape : vérification téléphone (OTP) et email.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}