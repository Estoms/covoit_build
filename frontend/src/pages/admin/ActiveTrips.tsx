import TripsList from "./TripsList";
export default function ActiveTrips() {
  return <TripsList title="Trajets actifs" statuses={["PUBLISHED", "IN_PROGRESS"]} />;
}
