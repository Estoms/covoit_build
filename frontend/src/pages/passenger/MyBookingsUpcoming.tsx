import BookingsList from "./BookingsList";
export default function MyBookingsUpcoming() {
  return <BookingsList title="Réservations à venir" statuses={["PENDING_PAYMENT", "CONFIRMED", "IN_PROGRESS"]} emptyLabel="Aucune réservation à venir." />;
}
