import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getMyVerifications, updateVehicle } from "../../api/verifications";
import { uploadDocument } from "../../api/documents";

export default function Vehicles() {
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [hasLicenseDocument, setHasLicenseDocument] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyVerifications().then((d) => {
      setVehicleType(d.driver?.vehicleType ?? "");
      setVehiclePlate(d.driver?.vehiclePlate ?? "");
      setHasLicenseDocument(!!d.driver?.licenseDocumentId);
    });
  }, []);

  async function handleSave() {
    await updateVehicle({ vehicleType, vehiclePlate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLicenseUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const documentId = await uploadDocument("DRIVER_LICENSE", file);
      await updateVehicle({ licenseDocumentId: documentId });
      setHasLicenseDocument(true);
    } catch {
      setError("Envoi du document impossible. Réessaie avec une image plus légère.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <PageShell title="Mon véhicule" nextApi={["GET /verifications/me", "POST /documents", "PATCH /verifications/driver/vehicle"]}>
      <Section title="Informations véhicule">
        <div className="grid gap-4 max-w-md">
          <label className="grid gap-1 text-sm">Type de véhicule<input className="rounded-xl border px-3 py-2" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} /></label>
          <label className="grid gap-1 text-sm">Plaque d'immatriculation<input className="rounded-xl border px-3 py-2" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} /></label>
          <div className="grid gap-1 text-sm">
            Photo du permis
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/jpeg,image/png,image/webp,application/pdf";
                input.onchange = () => handleLicenseUpload(input.files?.[0]);
                input.click();
              }}
              className="rounded-xl border px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? "Envoi…" : hasLicenseDocument ? "Document envoyé — remplacer" : "Choisir un fichier"}
            </button>
          </div>
          {error && <p className="text-sm text-brand-red-600">{error}</p>}
          <button onClick={handleSave} className="rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700 w-fit">Enregistrer</button>
          {saved && <p className="text-sm text-brand-green-700">Enregistré.</p>}
        </div>
      </Section>
    </PageShell>
  );
}
