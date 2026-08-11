import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminGetUser } from "../../api/admin";
import { formatXof } from "../../utils/format";

export default function UserDetails() {
  const { userId } = useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof adminGetUser>> | null>(null);

  useEffect(() => {
    if (userId) adminGetUser(userId).then(setData);
  }, [userId]);

  if (!data) return <PageShell title="Utilisateur" subtitle="Chargement…" />;

  const { user, driverProfile, wallet, loyaltyAccount } = data;

  return (
    <PageShell title={user.fullName} subtitle={user.phone} nextApi={["GET /admin/users/:id"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Compte">
          <div className="text-sm space-y-1">
            <div>Rôles : {user.roles.join(", ")}</div>
            <div>Email : {user.email ?? "—"}</div>
            <div>NPI : {user.npi ?? "—"}</div>
            <div>Inscrit le : {new Date(user.createdAt).toLocaleDateString("fr-FR")}</div>
          </div>
        </Section>
        <Section title="Portefeuille & fidélité">
          <div className="text-sm space-y-1">
            <div>Solde : {formatXof(wallet?.balanceXof ?? 0)}</div>
            <div>Points fidélité : {loyaltyAccount?.points ?? 0}</div>
          </div>
        </Section>
        {driverProfile && (
          <Section title="Profil conducteur">
            <div className="text-sm space-y-1">
              <div>Statut : {driverProfile.verificationStatus}</div>
              <div>Véhicule : {driverProfile.vehicleType ?? "—"}</div>
              <div>Casier judiciaire soumis : {driverProfile.criminalRecordSubmittedAt ? "Oui" : "Non"}</div>
            </div>
          </Section>
        )}
      </div>
    </PageShell>
  );
}
