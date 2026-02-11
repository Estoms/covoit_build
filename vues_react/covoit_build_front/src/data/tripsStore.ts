import { MOCK_TRIPS, type Trip } from "./mockTrips";

const STORAGE_KEY = "covoitbuild_trips";

/** Read trips created in the UI (mock) from localStorage. */
export function getStoredTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

/** Persist trips created in the UI (mock) into localStorage. */
export function setStoredTrips(trips: Trip[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

/** Merge seed trips + trips published by drivers in the UI. */
export function getAllTrips(): Trip[] {
  return [...getStoredTrips(), ...MOCK_TRIPS];
}

/** Add one trip to storage (prepend so it appears first). */
export function addTrip(trip: Trip) {
  const current = getStoredTrips();
  setStoredTrips([trip, ...current]);
}

/** Find a trip by id across all sources. */
export function findTripById(id: string): Trip | undefined {
  return getAllTrips().find((t) => t.id === id);
}
