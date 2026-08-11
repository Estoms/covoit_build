import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { userReviews } from "../../api/reviews";
import { getMyVerifications } from "../../api/verifications";
import type { DriverProfileDTO, Review } from "../../types";
import StatusBadge, { verificationStatusTone } from "../../ui/StatusBadge";

export default function DriverProfile() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<{ items: Review[]; averageRating: number | null }>({ items: [], averageRating: null });
  const [driver, setDriver] = useState<DriverProfileDTO | null>(null);

  useEffect(() => {
    if (user?.id) userReviews(user.id).then(setReviews);
    getMyVerifications().then((d) => setDriver(d.driver));
  }, [user?.id]);

  return (
    <PageShell title={user?.fullName ?? "Mon profil"} subtitle={reviews.averageRating ? `★ ${reviews.averageRating.toFixed(1)} / 5` : "Pas encore d'avis"} actions={[{ label: "Modifier le véhicule", href: "/d/vehicles", variant: "secondary" }]} nextApi={["GET /verifications/me", "GET /reviews/user/:id"]}>
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Statut de vérification" action={driver && <StatusBadge label={driver.verificationStatus} tone={verificationStatusTone(driver.verificationStatus)} />}>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Véhicule : {driver?.vehicleType ?? "—"}</div>
            <div>Plaque : {driver?.vehiclePlate ?? "—"}</div>
          </div>
        </Section>
        <Section title="Avis reçus">
          {reviews.items.length === 0 ? (
            <p className="text-sm text-gray-600">Aucun avis pour le moment.</p>
          ) : (
            <div className="divide-y">
              {reviews.items.slice(0, 5).map((r) => (
                <div key={r.id} className="py-2 text-sm">
                  <div className="font-semibold">★ {r.rating}/5</div>
                  {r.comment && <div className="text-gray-600">{r.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
