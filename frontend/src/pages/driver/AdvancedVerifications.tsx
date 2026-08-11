import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import VerificationCard from "../../ui/VerificationCard";
import { getMyVerifications } from "../../api/verifications";
import type { DriverProfileDTO } from "../../types";

export default function AdvancedVerifications() {
  const [driver, setDriver] = useState<DriverProfileDTO | null>(null);

  useEffect(() => {
    getMyVerifications().then((d) => setDriver(d.driver));
  }, []);

  return (
    <PageShell title="Vérifications avancées" subtitle="Renforce la confiance des passagers" nextApi={["GET /verifications/me"]}>
      <VerificationCard
        title="Certification complète"
        description="Permis, NIP et casier judiciaire validés par un administrateur."
        status={driver?.verificationStatus === "APPROVED" ? "APPROVED" : driver?.verificationStatus === "REJECTED" ? "REJECTED" : "PENDING_REVIEW"}
        actionHref="/profile/verifications"
        actionLabel="Voir mon dossier"
      />
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
        Un profil entièrement certifié augmente ton score de priorité dans l'algorithme de recherche
        (voir <a className="underline" href="/d/rewards">mes récompenses</a>).
      </div>
    </PageShell>
  );
}
