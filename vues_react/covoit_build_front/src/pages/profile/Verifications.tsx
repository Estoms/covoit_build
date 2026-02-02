import { useMemo, useState } from "react";
import PageShell from "../../ui/PageShell";
import VerificationCard from "../../ui/VerificationCard";
import type { VerificationStatus } from "../../ui/VerificationCard";
import { useAuth } from "../../auth/AuthContext";

type DocType = "CIP" | "PASSEPORT" | "CARTE_BIOMETRIQUE";

function docLabel(t: DocType) {
  switch (t) {
    case "CIP":
      return "CIP";
    case "PASSEPORT":
      return "Passeport";
    case "CARTE_BIOMETRIQUE":
      return "Carte biométrique";
  }
}

export default function Verifications() {
  const { user } = useAuth();

  const isDriver = user?.roles?.includes("DRIVER") ?? false;

  // Mock state (à remplacer par API plus tard)
  const [identityStatus, setIdentityStatus] = useState<VerificationStatus>("NOT_STARTED");
  const [vehicleStatus, setVehicleStatus] = useState<VerificationStatus>("NOT_STARTED");
  const [faceStatus, setFaceStatus] = useState<VerificationStatus>("NOT_STARTED");

  const [identityDocType, setIdentityDocType] = useState<DocType>("CIP");
  const [identityFileName, setIdentityFileName] = useState<string | undefined>();
  const [vehicleFileName, setVehicleFileName] = useState<string | undefined>();

  const [identityRejectReason] = useState("Photo floue / informations illisibles (mock).");
  const [vehicleRejectReason] = useState("Nom différent sur la carte grise (mock).");

  const progress = useMemo(() => {
    const items: VerificationStatus[] = [identityStatus, faceStatus];
    if (isDriver) items.push(vehicleStatus);

    const approved = items.filter((s) => s === "APPROVED").length;
    return { approved, total: items.length };
  }, [identityStatus, faceStatus, vehicleStatus, isDriver]);

  const allApproved = progress.approved === progress.total;

  function uploadIdentity(file?: File) {
    if (!file) return;
    setIdentityFileName(file.name);
    setIdentityStatus("PENDING_REVIEW");

    // mock review auto après 1.5s
    setTimeout(() => {
      setIdentityStatus("APPROVED");
    }, 1500);
  }

  function uploadVehicle(file?: File) {
    if (!file) return;
    setVehicleFileName(file.name);
    setVehicleStatus("PENDING_REVIEW");

    setTimeout(() => {
      setVehicleStatus("APPROVED");
    }, 1500);
  }

  return (
    <PageShell
      title="Vérifications"
      subtitle={`Profil : ${user?.fullName || "Utilisateur"} • Progression ${progress.approved}/${progress.total}`}
      actions={[
        { label: "Mon profil", href: "/p/profile", variant: "secondary" },
      ]}
      nextApi={[
        "GET /verifications/me",
        "POST /verifications/identity",
        "POST /verifications/vehicle-registration",
        "POST /verifications/face",
      ]}
    >
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-semibold">Statut global</div>
            <div className="text-sm text-gray-600">
              {allApproved
                ? "✅ Profil vérifié. Tu peux utiliser toutes les fonctionnalités."
                : "⏳ Vérifie ton profil pour débloquer toutes les fonctionnalités."}
            </div>
          </div>

          <div className="text-sm font-semibold">
            {progress.approved}/{progress.total} validés
          </div>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gray-900"
            style={{ width: `${Math.round((progress.approved / progress.total) * 100)}%` }}
          />
        </div>
      </div>

      {/* Identité */}
      <VerificationCard
        title="Pièce d’identité"
        description="CIP / Passeport / Carte biométrique. Photo nette, lisible, sans reflet."
        status={identityStatus}
        fileName={identityFileName ? `${docLabel(identityDocType)} • ${identityFileName}` : undefined}
        rejectionReason={identityStatus === "REJECTED" ? identityRejectReason : undefined}
        actionLabel={identityStatus === "APPROVED" ? "Remplacer (mock)" : "Téléverser"}
        onAction={() => {
          // trigger file picker
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*,.pdf";
          input.onchange = () => uploadIdentity(input.files?.[0]);
          input.click();
        }}
      />

      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm font-semibold">Type de document</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(["CIP", "PASSEPORT", "CARTE_BIOMETRIQUE"] as DocType[]).map((t) => (
            <label key={t} className="flex items-center gap-2 rounded-xl border px-3 py-2">
              <input
                type="radio"
                checked={identityDocType === t}
                onChange={() => setIdentityDocType(t)}
              />
              <span className="text-sm">{docLabel(t)}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          (Mock) Plus tard : contrôle automatique + validation manuelle si besoin.
        </p>
      </div>

      {/* Carte grise (conducteur uniquement) */}
      {isDriver && (
        <VerificationCard
          title="Carte grise (conducteur)"
          description="Carte grise du véhicule, idéalement au nom du conducteur."
          status={vehicleStatus}
          fileName={vehicleFileName}
          rejectionReason={vehicleStatus === "REJECTED" ? vehicleRejectReason : undefined}
          actionLabel={vehicleStatus === "APPROVED" ? "Remplacer (mock)" : "Téléverser carte grise"}
          onAction={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*,.pdf";
            input.onchange = () => uploadVehicle(input.files?.[0]);
            input.click();
          }}
        />
      )}

      {/* Visage */}
      <VerificationCard
        title="Selfie (visage)"
        description="Prends une photo de ton visage (selfie) dans un endroit bien éclairé."
        status={faceStatus}
        actionLabel={faceStatus === "APPROVED" ? "Re-faire un selfie" : "Faire un selfie"}
        actionHref="/verify/face"
      />

      <div className="rounded-2xl border bg-white p-5">
        <div className="font-semibold">Règles de sécurité</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Documents lisibles, pas de reflet, pas de flou.</li>
          <li>Nous ne partageons pas tes documents publiquement.</li>
          <li>Accès réservé à la modération (admin/support).</li>
        </ul>

        <button
          className="mt-4 rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
          onClick={() => {
            // mock: simule qu'on a fait le selfie et validé
            setFaceStatus("PENDING_REVIEW");
            setTimeout(() => setFaceStatus("APPROVED"), 1200);
          }}
        >
          (Mock) Simuler validation selfie
        </button>
      </div>
    </PageShell>
  );
}
