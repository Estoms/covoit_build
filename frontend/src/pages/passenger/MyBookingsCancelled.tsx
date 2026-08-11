import BookingsList from "./BookingsList";
export default function MyBookingsCancelled() {
  return <BookingsList title="Réservations annulées" statuses={["CANCELLED"]} emptyLabel="Aucune annulation." />;
}
