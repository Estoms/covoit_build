import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { getBooking } from "../../api/bookings";
import type { Booking } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    getBooking(bookingId).then((r) => setBooking(r.booking));
  }, [bookingId]);

  if (!booking) return <PageShell title="Confirmation" subtitle="Chargement…" />;

  return (
    <PageShell
      title="Réservation confirmée"
      subtitle="Ton paiement a été reçu."
      actions={[{ label: "Mes réservations", href: "/p/bookings/upcoming", variant: "secondary" }]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Récapitulatif" action={<StatusBadge label={booking.status} tone={bookingStatusTone(booking.status)} />}>
          <div className="space-y-2 text-sm">
            <div>{booking.trip?.fromCity} → {booking.trip?.toCity}</div>
            {booking.trip?.departAt && <div className="text-gray-600">{formatDateTime(booking.trip.departAt)}</div>}
            <div className="flex justify-between pt-2"><span className="text-gray-600">Places</span><span className="font-semibold">{booking.seats}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Total payé</span><span className="font-extrabold">{formatXof(booking.totalChargedXof)}</span></div>
          </div>
        </Section>
        <Section title="Contacter le conducteur">
          <p className="text-sm text-gray-600">
            Pour protéger la vie privée, coordonne les derniers détails via la messagerie interne plutôt que
            par téléphone.
          </p>
          <Link to="/messages" className="mt-3 inline-block rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700">
            Ouvrir la messagerie
          </Link>
        </Section>
      </div>
    </PageShell>
  );
}
