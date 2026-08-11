import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { register, requestOtp } from "../../api/auth";
import { ApiClientError } from "../../api/client";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizePhoneBJ(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function isValidBeninPhone(phone: string) {
  const p = normalizePhoneBJ(phone);
  return p.startsWith("+229") && p.length >= 12;
}

function isStrongPassword(password: string) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

export default function Register() {
  const { loginWithToken } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [roleChoice, setRoleChoice] = useState<"PASSENGER" | "DRIVER" | "BOTH">("PASSENGER");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+229 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  // Passager
  const [npi, setNpi] = useState("");
  const [address, setAddress] = useState("");

  // Conducteur
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [nip, setNip] = useState("");

  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isDriver = roleChoice === "DRIVER" || roleChoice === "BOTH";
  const isPassenger = roleChoice === "PASSENGER" || roleChoice === "BOTH";

  const errors = useMemo(() => {
    const e: string[] = [];
    if (fullName.trim().length < 2) e.push("Le nom doit contenir au moins 2 caractères.");
    if (email && !isValidEmail(email)) e.push("Email invalide.");
    if (!isValidBeninPhone(phone)) e.push("Téléphone invalide (ex: +229 01 90 00 00 00).");
    if (!isStrongPassword(password)) e.push("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.");
    if (password !== confirmPassword) e.push("Les mots de passe ne correspondent pas.");
    if (!agree) e.push("Tu dois accepter les conditions d'utilisation.");
    if (isPassenger && !npi.trim()) e.push("Le NPI (numéro personnel d'identification) est requis pour les passagers.");
    if (isDriver && !vehicleType.trim()) e.push("Le type de véhicule est requis pour les conducteurs.");
    return e;
  }, [fullName, email, phone, password, confirmPassword, agree, isPassenger, isDriver, npi, vehicleType]);

  const canSubmit = errors.length === 0 && !submitting;

  async function handleSendOtp() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await requestOtp(normalizePhoneBJ(phone), "REGISTER");
      setDevCode(res.devCode);
      setStep("OTP");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible d'envoyer le code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister() {
    setError(null);
    setSubmitting(true);
    try {
      const roles: ("PASSENGER" | "DRIVER")[] =
        roleChoice === "DRIVER" ? ["DRIVER"] : roleChoice === "BOTH" ? ["PASSENGER", "DRIVER"] : ["PASSENGER"];

      const result = await register({
        phone: normalizePhoneBJ(phone),
        otp,
        fullName,
        password,
        roles,
        email: email || undefined,
        npi: isPassenger ? npi : undefined,
        address: address || undefined,
        vehicleType: isDriver ? vehicleType : undefined,
        vehiclePlate: isDriver ? vehiclePlate || undefined : undefined,
        nip: isDriver ? nip || undefined : undefined,
      });

      loginWithToken(result.user, result.accessToken);

      // Les documents (carte d'identite, permis, casier judiciaire) se televersent
      // juste apres, une fois le compte cree et authentifie (page Vérifications).
      nav("/profile/verifications");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Inscription impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Inscription"
      subtitle="Bénin • Téléphone +229 • Vérification par SMS"
      actions={[{ label: "J'ai déjà un compte", href: "/login", variant: "secondary" }]}
      nextApi={["POST /auth/otp/request", "POST /auth/register"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Créer un compte">
          {step === "FORM" ? (
            <div className="grid gap-4">
              <label className="grid gap-1 text-sm">
                Je suis
                <select
                  className="rounded-xl border px-3 py-2 bg-white"
                  value={roleChoice}
                  onChange={(e) => setRoleChoice(e.target.value as "PASSENGER" | "DRIVER" | "BOTH")}
                >
                  <option value="PASSENGER">Passager</option>
                  <option value="DRIVER">Conducteur</option>
                  <option value="BOTH">Passager + Conducteur</option>
                </select>
              </label>

              <label className="grid gap-1 text-sm">
                Nom complet
                <input className="rounded-xl border px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>

              <label className="grid gap-1 text-sm">
                Téléphone (Mobile Money)
                <input className="rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              <label className="grid gap-1 text-sm">
                Email (optionnel)
                <input className="rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  Mot de passe
                  <input type="password" className="rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span className="text-xs text-gray-500">8 caractères minimum, avec une lettre et un chiffre.</span>
                </label>
                <label className="grid gap-1 text-sm">
                  Confirmer
                  <input type="password" className="rounded-xl border px-3 py-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
              </div>

              {isPassenger && (
                <div className="rounded-xl border border-brand-green-200 bg-brand-green-50 p-3 grid gap-3">
                  <div className="text-sm font-semibold text-brand-green-700">Vérification passager</div>
                  <label className="grid gap-1 text-sm">
                    NPI (numéro personnel d'identification)
                    <input className="rounded-xl border px-3 py-2" value={npi} onChange={(e) => setNpi(e.target.value)} />
                  </label>
                  <label className="grid gap-1 text-sm">
                    Adresse
                    <input className="rounded-xl border px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </label>
                  <p className="text-xs text-brand-green-700">
                    Tu pourras téléverser le scan de ta carte d'identité juste après l'inscription, une fois ton
                    compte créé (page Vérifications).
                  </p>
                </div>
              )}

              {isDriver && (
                <div className="rounded-xl border border-brand-yellow-200 bg-brand-yellow-50 p-3 grid gap-3">
                  <div className="text-sm font-semibold text-brand-yellow-700">Vérification conducteur</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      Type de véhicule
                      <input className="rounded-xl border px-3 py-2" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Plaque
                      <input className="rounded-xl border px-3 py-2" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
                    </label>
                  </div>
                  <label className="grid gap-1 text-sm">
                    NIP
                    <input className="rounded-xl border px-3 py-2" value={nip} onChange={(e) => setNip(e.target.value)} />
                  </label>
                  <p className="text-xs text-brand-yellow-700">
                    Juste après l'inscription, tu pourras téléverser la photo de ton permis, puis ton extrait de
                    casier judiciaire (à fournir dans le mois, des rappels SMS te seront envoyés).
                  </p>
                </div>
              )}

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                J'accepte les <Link className="underline" to="/terms">conditions d'utilisation</Link>.
              </label>

              {errors.length > 0 && (
                <ul className="text-sm text-brand-red-600 list-disc pl-5">
                  {errors.map((e) => <li key={e}>{e}</li>)}
                </ul>
              )}
              {error && <p className="text-sm text-brand-red-600">{error}</p>}

              <button
                disabled={!canSubmit}
                onClick={handleSendOtp}
                className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50"
              >
                Recevoir le code par SMS
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-gray-600">
                Un code à 6 chiffres a été envoyé au {phone} par SMS.
                {devCode && (
                  <span className="block mt-1 text-brand-yellow-700 font-mono">(mode démo, code: {devCode})</span>
                )}
              </p>
              <label className="grid gap-1 text-sm">
                Code de vérification
                <input className="rounded-xl border px-3 py-2 tracking-widest text-lg" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
              </label>
              {error && <p className="text-sm text-brand-red-600">{error}</p>}
              <div className="flex gap-2">
                <button onClick={() => setStep("FORM")} className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50">
                  Retour
                </button>
                <button
                  disabled={otp.length !== 6 || submitting}
                  onClick={handleRegister}
                  className="flex-1 rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50"
                >
                  Confirmer l'inscription
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Pourquoi ces informations ?">
          <p className="text-sm text-gray-600">
            Pour la sécurité de tous, MobiBenin vérifie l'identité des passagers (NPI, carte d'identité) et des
            conducteurs (permis, NIP, casier judiciaire) avant l'activation complète du compte. Un administrateur
            valide manuellement chaque dossier conducteur. Les documents sont téléversés juste après
            l'inscription, une fois ton compte créé, et ne sont jamais accessibles publiquement.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
