import BookingsList from "./BookingsList";
export default function MyBookingsPast() {
  return <BookingsList title="Réservations passées" statuses={["COMPLETED"]} emptyLabel="Aucun trajet terminé pour le moment." />;
}
