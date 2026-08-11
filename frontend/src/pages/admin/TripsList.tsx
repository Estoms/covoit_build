import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { adminListTrips } from "../../api/admin";
import type { AdminTrip } from "../../types";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";

export default function TripsList({ title, statuses }: { title: string; statuses?: string[] }) {
  const [items, setItems] = useState<AdminTrip[]>([]);

  useEffect(() => {
    adminListTrips().then((r) => setItems(statuses ? r.items.filter((t) => t.status && statuses.includes(t.status)) : r.items));
  }, [statuses]);

  return (
    <PageShell title={title} nextApi={["GET /admin/trips"]}>
      {items.length === 0 ? (
        <Section title="Rien ici"><p className="text-sm text-gray-600">Aucun trajet.</p></Section>
      ) : (
        <div className="grid gap-4">
          {items.map((t) => (
            <Section key={t.id} title={`${t.fromCity} → ${t.toCity}`} action={<StatusBadge label={t.status} tone={bookingStatusTone(t.status)} />}>
              <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-600">
                <span>{formatDateTime(t.departAt)} • {t.driver?.fullName}</span>
                <span className="font-semibold text-gray-900">{formatXof(t.pricePerSeatXof)} • {t.bookings?.length ?? 0} résa.</span>
              </div>
            </Section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
