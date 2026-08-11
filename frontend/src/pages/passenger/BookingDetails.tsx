import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { cancelBooking, getBooking } from "../../api/bookings";
import type { Booking } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";
import { ApiClientError } from "../../api/client";

export default function BookingDetails() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    if (bookingId) getBooking(bookingId).then((r) => setBooking(r.booking)).catch(() => setError("Réservation introuvable."));
  }

  useEffect(reload, [bookingId]);

  async function handleCancel() {
    if (!booking) return;
    try {
      await cancelBooking(booking.id);
      reload();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Annulation impossible.");
    }
  }

  if (error && !booking) return <PageShell title="Réservation" subtitle="Erreur"><Section title="Erreur"><p className="text-sm text-brand-red-600">{error}</p></Section></PageShell>;
  if (!booking) return <PageShell title="Réservation" subtitle="Chargement…" />;

  const canCancel = booking.status === "PENDING_PAYMENT" || booking.status === "CONFIRMED";
  const canReview = booking.status === "COMPLETED" && !booking.review;

  return (
    <PageShell
      title={`${booking.trip?.fromCity ?? "?"} → ${booking.trip?.toCity ?? "?"}`}
      subtitle={booking.trip?.departAt ? formatDateTime(booking.trip.departAt) : undefined}
      actions={[
        ...(canReview ? [{ label: "Laisser un avis", href: `/p/reviews/new/${booking.id}` }] : []),
        ...(canCancel ? [{ label: "Annuler", onClick: handleCancel, variant: "danger" as const }] : []),
      ]}
      nextApi={["GET /bookings/:id", "POST /bookings/:id/cancel"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Statut" action={<StatusBadge label={booking.status} tone={bookingStatusTone(booking.status)} />}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Places</span><span>{booking.seats}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Total payé</span><span className="font-semibold">{formatXof(booking.totalChargedXof)}</span></div>
          </div>
          {error && <p className="mt-3 text-sm text-brand-red-600">{error}</p>}
        </Section>
        <Section title="Contact">
          <p className="text-sm text-gray-600">Coordonne les détails via la messagerie interne.</p>
          <Link to="/messages" className="mt-3 inline-block rounded-xl border px-4 py-2 font-medium hover:bg-gray-50">Ouvrir la messagerie</Link>
        </Section>
      </div>
    </PageShell>
  );
}
