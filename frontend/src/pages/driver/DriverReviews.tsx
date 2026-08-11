import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { useAuth } from "../../auth/AuthContext";
import { userReviews } from "../../api/reviews";
import type { Review } from "../../types";

export default function DriverReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<{ items: Review[]; averageRating: number | null }>({ items: [], averageRating: null });

  useEffect(() => {
    if (user?.id) userReviews(user.id).then(setReviews);
  }, [user?.id]);

  return (
    <PageShell title="Mes avis" subtitle={reviews.averageRating ? `Note moyenne : ★ ${reviews.averageRating.toFixed(1)} / 5` : undefined} nextApi={["GET /reviews/user/:id"]}>
      <Section title="Tous les avis">
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
