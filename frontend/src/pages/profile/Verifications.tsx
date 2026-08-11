import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import VerificationCard from "../../ui/VerificationCard";
import type { VerificationStatus } from "../../ui/VerificationCard";
import { useAuth } from "../../auth/AuthContext";
import { getMyVerifications, updateVehicle } from "../../api/verifications";
import { api } from "../../api/client";
import { uploadDocument } from "../../api/documents";
import { formatDateTime } from "../../utils/format";

export default function Verifications() {
  const { user, refreshUser } = useAuth();
  const isDriver = user?.roles?.includes("DRIVER") || user?.roles?.includes("PASSENGER_DRIVER");
  const isPassenger = user?.roles?.includes("PASSENGER") || user?.roles?.includes("PASSENGER_DRIVER");

  const [data, setData] = useState<Awaited<ReturnType<typeof getMyVerifications>> | null>(null);
  const [npi, setNpi] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingIdCard, setUploadingIdCard] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    getMyVerifications().then((d) => {
      setData(d);
      setNpi(d.passenger?.npi ?? "");
    });
  }
  useEffect(reload, []);

  async function saveNpi() {
    setSaving(true);
    setError(null);
    try {
      await api.patch("/users/me", { npi });
      await refreshUser();
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleIdCardUpload(file?: File) {
    if (!file) return;
    setUploadingIdCard(true);
    setError(null);
    try {
      const documentId = await uploadDocument("ID_CARD", file);
      await api.patch("/users/me", { idCardDocumentId: documentId });
      await refreshUser();
      reload();
    } catch {
      setError("Envoi du document impossible. Réessaie avec une image plus légère.");
    } finally {
      setUploadingIdCard(false);
    }
  }

  async function handleLicenseUpload(file?: File) {
    if (!file) return;
    setUploadingLicense(true);
    setError(null);
    try {
      const documentId = await uploadDocument("DRIVER_LICENSE", file);
      await updateVehicle({ licenseDocumentId: documentId });
      reload();
    } catch {
      setError("Envoi du document impossible. Réessaie avec une image plus légère.");
    } finally {
      setUploadingLicense(false);
    }
  }

  function pickFile(onPicked: (file?: File) => void) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,application/pdf";
    input.onchange = () => onPicked(input.files?.[0]);
    input.click();
  }

  if (!data) return <PageShell title="Vérifications" subtitle="Chargement…" />;

  const passengerStatus: VerificationStatus = data.passenger?.complete ? "APPROVED" : "PENDING_REVIEW";
  const driverStatus: VerificationStatus =
    data.driver?.verificationStatus === "APPROVED" ? "APPROVED" :
    data.driver?.verificationStatus === "REJECTED" ? "REJECTED" : "PENDING_REVIEW";

  return (
    <PageShell
      title="Vérifications"
      subtitle={`Profil : ${user?.fullName || "Utilisateur"}`}
      nextApi={["GET /verifications/me", "POST /documents", "PATCH /users/me", "PATCH /verifications/driver/vehicle", "POST /verifications/driver/criminal-record"]}
    >
      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      {isPassenger && (
        <>
          <VerificationCard
            title="Identité passager (NPI + carte d'identité)"
            description="Requis pour réserver un trajet."
            status={passengerStatus}
          />
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                NPI
                <input className="rounded-xl border px-3 py-2" value={npi} onChange={(e) => setNpi(e.target.value)} />
              </label>
              <div className="grid gap-1 text-sm">
                Scan de la carte d'identité
                <button
                  type="button"
                  disabled={uploadingIdCard}
                  onClick={() => pickFile(handleIdCardUpload)}
                  className="rounded-xl border px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingIdCard ? "Envoi…" : data.passenger?.idCardDocumentId ? "Document envoyé — remplacer" : "Choisir un fichier"}
                </button>
              </div>
            </div>
            <button disabled={saving} onClick={saveNpi} className="mt-4 rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50">
              Enregistrer le NPI
            </button>
          </div>
        </>
      )}

      {isDriver && data.driver && (
        <>
          <VerificationCard
            title="Dossier conducteur (permis, NIP, casier judiciaire)"
            description={
              data.driver.criminalRecordSubmittedAt
                ? "Dossier soumis, en attente ou déjà validé par un administrateur."
                : `Casier judiciaire à fournir avant le ${formatDateTime(data.driver.criminalRecordDueAt)}.`
            }
            status={driverStatus}
            actionLabel={data.driver.criminalRecordSubmittedAt ? undefined : "Fournir mon casier judiciaire"}
            actionHref={data.driver.criminalRecordSubmittedAt ? undefined : "/verify/face"}
            rejectionReason={data.driver.verificationStatus === "REJECTED" ? "Dossier refusé par un administrateur. Contacte le support pour plus de détails." : undefined}
          />
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-sm font-semibold mb-2">Photo du permis de conduire</div>
            <button
              type="button"
              disabled={uploadingLicense}
              onClick={() => pickFile(handleLicenseUpload)}
              className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              {uploadingLicense ? "Envoi…" : data.driver.licenseDocumentId ? "Document envoyé — remplacer" : "Choisir un fichier"}
            </button>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="font-semibold">Pourquoi ces vérifications ?</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Elles protègent tous les utilisateurs de la plateforme.</li>
          <li>Les documents sont stockés de façon privée et ne sont jamais accessibles par une URL publique.</li>
          <li>Seule l'équipe de modération MobiBenin (admin/support) peut consulter ces documents.</li>
          <li>Un conducteur ne peut publier de trajet qu'après validation manuelle de son dossier.</li>
        </ul>
      </div>
    </PageShell>
  );
}
