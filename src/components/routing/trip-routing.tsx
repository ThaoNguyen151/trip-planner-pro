import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

import { ROUTES, tripPath, type TripSection } from "@/constants/routes";
import OverviewPage from "@/pages/overview/OverviewPage";
import ListPage from "@/pages/overview/List";
import { useTripStore } from "@/stores/useTripStore";

function useTripStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useTripStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;
    return useTripStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  return hydrated;
}

function tripsHomePath(): string {
  return useTripStore.getState().trips.length === 0
    ? ROUTES.overview
    : ROUTES.trips;
}

/** `/` — overview when no trips, otherwise trips list. */
export function TripEntryRedirect() {
  const hydrated = useTripStoreHydrated();
  if (!hydrated) return null;
  return <Navigate to={tripsHomePath()} replace />;
}

/** `/overview` — only when there are no trips. */
export function OverviewGate() {
  const hydrated = useTripStoreHydrated();
  const trips = useTripStore((s) => s.trips);

  if (!hydrated) return null;
  if (trips.length > 0) return <Navigate to={ROUTES.trips} replace />;
  return <OverviewPage />;
}

/** `/trips` — only when at least one trip exists. */
export function TripsGate() {
  const hydrated = useTripStoreHydrated();
  const trips = useTripStore((s) => s.trips);

  if (!hydrated) return null;
  if (trips.length === 0) return <Navigate to={ROUTES.overview} replace />;
  return <ListPage />;
}

/** Sync `:tripId` from URL → `activeTripId` and load trip data. */
export function TripIdSync() {
  const hydrated = useTripStoreHydrated();
  const { tripId } = useParams<{ tripId: string }>();
  const trips = useTripStore((s) => s.trips);
  const activeTripId = useTripStore((s) => s.activeTripId);

  useEffect(() => {
    if (!hydrated || !tripId) return;
    const exists = trips.some((t) => t.id === tripId);
    if (!exists) return;

    if (activeTripId !== tripId) {
      useTripStore.getState().setActiveTripId(tripId);
    }
  }, [hydrated, tripId, trips, activeTripId]);

  if (!hydrated) return null;

  if (!tripId || !trips.some((t) => t.id === tripId)) {
    return (
      <Navigate
        to={trips.length === 0 ? ROUTES.overview : ROUTES.trips}
        replace
      />
    );
  }

  return <Outlet />;
}

/** Redirect old `/dashboard`, `/budget`, … URLs to `/trips/:tripId/...`. */
export function LegacyTripPathRedirect({ section }: { section: TripSection }) {
  const activeTripId = useTripStore.getState().activeTripId;
  const trips = useTripStore.getState().trips;
  const tripId = activeTripId ?? trips[trips.length - 1]?.id;
  if (tripId) {
    return <Navigate to={tripPath(tripId, section)} replace />;
  }
  return (
    <Navigate
      to={trips.length === 0 ? ROUTES.overview : ROUTES.trips}
      replace
    />
  );
}
