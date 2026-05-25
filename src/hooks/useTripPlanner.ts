import { useTripStore } from "@/stores";

/** Thin wrapper so feature code can depend on hooks instead of the store directly. */
export function useTripPlanner() {
  const trips = useTripStore((s) => s.trips);
  const activeTripId = useTripStore((s) => s.activeTripId);
  const addTrip = useTripStore((s) => s.addTrip);
  const removeTrip = useTripStore((s) => s.removeTrip);
  const setActiveTripId = useTripStore((s) => s.setActiveTripId);
  const setTripImage = useTripStore((s) => s.setTripImage);
  const activeTrip = useTripStore((s) =>
    s.trips.find((t) => t.id === s.activeTripId),
  );

  return {
    trips,
    activeTripId,
    activeTrip,
    addTrip,
    removeTrip,
    setActiveTripId,
    setTripImage,
  };
}
