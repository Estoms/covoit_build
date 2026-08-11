import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { api } from "../../api/client";
import { userReviews } from "../../api/reviews";
import type { Review } from "../../types";

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<{ fullName: string; createdAt: string } | null>(null);
  const [reviews, setReviews] = useState<{ items: Review[]; averageRating: number | null }>({ items: [], averageRating: null });

  useEffect(() => {
    if (!userId) return;
    api.get<{ user: { fullName: string; createdAt: string } }>(`/users/${userId}/public`).then((r) => setProfile(r.user));
    userReviews(userId).then(setReviews);
  }, [userId]);

  if (!profile) return <PageShell title="Profil" subtitle="Chargement…" />;

  return (
    <PageShell title={profile.fullName} subtitle={reviews.averageRating ? `★ ${reviews.averageRating.toFixed(1)} / 5` : "Pas encore d'avis"} nextApi={["GET /users/:id/public", "GET /reviews/user/:id"]}>
      <Section title="Avis reçus">
        {reviews.items.length === 0 ? (
          <p className="text-sm text-gray-600">Aucun avis pour le moment.</p>
        ) : (
          <div className="divide-y">
            {reviews.items.map((r) => (
              <div key={r.id} className="py-2 text-sm">
                <div className="font-semibold">★ {r.rating}/5</div>
                {r.comment && <div className="text-gray-600">{r.comment}</div>}
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
