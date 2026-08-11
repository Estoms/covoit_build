import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { myBookings } from "../../api/bookings";
import type { Booking, BookingStatus } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";

export default function BookingsList({
  title,
  statuses,
  emptyLabel,
}: {
  title: string;
  statuses: BookingStatus[];
  emptyLabel: string;
}) {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myBookings().then((r) => setItems(r.items.filter((b) => statuses.includes(b.status)))).finally(() => setLoading(false));
  }, [statuses]);

  return (
    <PageShell title={title} nextApi={["GET /bookings/mine"]}>
      {loading && <Section title="Chargement">…</Section>}
      {!loading && items.length === 0 && <Section title="Rien ici"><p className="text-sm text-gray-600">{emptyLabel}</p></Section>}
      <div className="grid gap-4">
        {items.map((b) => (
          <Link key={b.id} to={`/p/bookings/${b.id}`}>
            <Section title={`${b.trip?.fromCity ?? "?"} → ${b.trip?.toCity ?? "?"}`} action={<StatusBadge label={b.status} tone={bookingStatusTone(b.status)} />}>
              <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-600">
                <span>{b.trip?.departAt ? formatDateTime(b.trip.departAt) : "—"}</span>
                <span className="font-semibold text-gray-900">{formatXof(b.totalChargedXof)}</span>
              </div>
            </Section>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
