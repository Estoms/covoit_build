import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { api } from "../../api/client";
import { ApiClientError } from "../../api/client";

export default function AccountSettingsForm() {
  const { user, refreshUser, logout } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setError(null);
    try {
      await api.patch("/users/me", { fullName, email: email || undefined, address: address || undefined });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Mise à jour impossible.");
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setError(null);
    try {
      await api.delete("/users/me");
      await logout();
      nav("/");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Suppression impossible.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageShell title="Mon compte" subtitle={user?.phone} nextApi={["PATCH /users/me", "DELETE /users/me"]}>
      <Section title="Informations personnelles">
        <div className="grid gap-4 max-w-md">
          <label className="grid gap-1 text-sm">Nom complet<input className="rounded-xl border px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Email<input className="rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Adresse<input className="rounded-xl border px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
          {error && <p className="text-sm text-brand-red-600">{error}</p>}
          <button onClick={handleSave} className="rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700 w-fit">
            Enregistrer
          </button>
          {saved && <p className="text-sm text-brand-green-700">Modifications enregistrées.</p>}
        </div>
      </Section>

      <div className="mt-6">
        <Section title="Zone sensible">
          <p className="text-sm text-gray-600">
            La suppression de ton compte anonymise tes données personnelles (nom, email, téléphone, documents) et
            déconnecte toutes tes sessions. Cette action est irréversible.
          </p>
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="mt-3 rounded-xl border border-brand-red-300 px-4 py-2 text-sm font-semibold text-brand-red-600 hover:bg-brand-red-50"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-xl bg-brand-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-600 disabled:opacity-50"
              >
                {deleting ? "Suppression…" : "Confirmer la suppression définitive"}
              </button>
              <button onClick={() => setConfirmingDelete(false)} className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Annuler
              </button>
            </div>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
