import TripsList from "./TripsList";
export default function TripsHistory() {
  return <TripsList title="Historique des trajets" statuses={["COMPLETED", "CANCELLED"]} />;
}
