import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { submitReview } from "../../api/reviews";
import { ApiClientError } from "../../api/client";

export default function LeaveReview() {
  const { bookingId } = useParams();
  const nav = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!bookingId) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitReview(bookingId, rating, comment || undefined);
      nav(`/p/bookings/${bookingId}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Envoi impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title="Laisser un avis" subtitle="Ton retour aide les autres passagers" nextApi={["POST /reviews"]}>
      <Section title="Note et commentaire">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`h-10 w-10 rounded-full border font-semibold ${n <= rating ? "bg-brand-yellow-500 border-brand-yellow-500 text-white" : "border-gray-300"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded-xl border px-3 py-2"
          rows={4}
          placeholder="Ton commentaire (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-brand-red-600">{error}</p>}
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="mt-4 rounded-xl bg-brand-green-600 px-5 py-2.5 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50"
        >
          Envoyer l'avis
        </button>
      </Section>
    </PageShell>
  );
}
