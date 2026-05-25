import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
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
    : ROUTES.list;
}

/** `/` — overview when no trips, otherwise list. */
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
  if (trips.length > 0) return <Navigate to={ROUTES.list} replace />;
  return <OverviewPage />;
}

/** `/list` — only when at least one trip exists. */
export function ListGate() {
  const hydrated = useTripStoreHydrated();
  const trips = useTripStore((s) => s.trips);

  if (!hydrated) return null;
  if (trips.length === 0) return <Navigate to={ROUTES.overview} replace />;
  return <ListPage />;
}

/** App shell — requires a selected trip; data loads via trip-scope-bridge. */
export function RequireActiveTrip() {
  const hydrated = useTripStoreHydrated();
  const trips = useTripStore((s) => s.trips);
  const activeTripId = useTripStore((s) => s.activeTripId);

  if (!hydrated) return null;
  if (!activeTripId) {
    return (
      <Navigate
        to={trips.length === 0 ? ROUTES.overview : ROUTES.list}
        replace
      />
    );
  }
  return <Outlet />;
}
