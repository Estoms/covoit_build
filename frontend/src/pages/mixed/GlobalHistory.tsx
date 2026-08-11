import { useEffect, useState } from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { myBookings } from "../../api/bookings";
import { myTrips } from "../../api/trips";
import { formatDateTime, formatXof } from "../../utils/format";
import StatusBadge, { bookingStatusTone } from "../../ui/StatusBadge";

type Row = { id: string; kind: "PASSAGER" | "CONDUCTEUR"; label: string; date: string; amount: number; status: string };

export default function GlobalHistory() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    Promise.all([myBookings(), myTrips()]).then(([b, t]) => {
      const bookingRows: Row[] = b.items.map((x) => ({
        id: x.id, kind: "PASSAGER", label: `${x.trip?.fromCity} → ${x.trip?.toCity}`,
        date: x.trip?.departAt ?? x.createdAt, amount: x.totalChargedXof, status: x.status,
      }));
      const tripRows: Row[] = t.items.map((x) => ({
        id: x.id, kind: "CONDUCTEUR", label: `${x.fromCity} → ${x.toCity}`,
        date: x.departAt, amount: x.pricePerSeatXof * (x.seatsTotal - x.seatsAvailable), status: x.status,
      }));
      setRows([...bookingRows, ...tripRows].sort((a, c) => new Date(c.date).getTime() - new Date(a.date).getTime()));
    });
  }, []);

  return (
    <PageShell title="Historique complet" subtitle="Tous tes trajets, passager et conducteur confondus" nextApi={["GET /bookings/mine", "GET /trips/mine/list"]}>
      <Section title="Tout l'historique">
        {rows.length === 0 ? <p className="text-sm text-gray-600">Rien pour le moment.</p> : (
          <div className="divide-y">
            {rows.map((r) => (
              <div key={`${r.kind}-${r.id}`} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="mr-2 text-xs font-semibold text-gray-400">{r.kind}</span>
                  {r.label}
                  <div className="text-xs text-gray-500">{formatDateTime(r.date)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={r.status} tone={bookingStatusTone(r.status)} />
                  <span className="font-semibold">{formatXof(r.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
