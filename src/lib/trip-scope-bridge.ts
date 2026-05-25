import {
  computeTripProgress,
  createEmptyTripFeatureData,
  readLegacyGlobalFeatureData,
} from "@/lib/trip-feature-defaults";
import {
  getTripFeatureData,
  hasTripFeatureData,
  isRegistryEmpty,
  setTripFeatureData,
} from "@/lib/trip-data-registry";
import { itineraryDaysToCalendarEvents } from "@/lib/itinerary-to-calendar";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useItineraryStore } from "@/stores/useItineraryStore";
import { usePackingStore } from "@/stores/usePackingStore";
import { useTripStore } from "@/stores/useTripStore";
import type { Trip } from "@/types/trip";
import type { TripFeatureData } from "@/types/trip-data";

const LEGACY_MIGRATED_FLAG = "trip-planner-pro/legacy-features-migrated";

let initialized = false;
let isSwitching = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function getActiveTrip(): Trip | undefined {
  const { trips, activeTripId } = useTripStore.getState();
  return trips.find((t) => t.id === activeTripId);
}

function captureFeatureState(): TripFeatureData {
  const budget = useBudgetStore.getState();
  const itinerary = useItineraryStore.getState();
  const packing = usePackingStore.getState();
  const trip = getActiveTrip();

  return {
    budget: {
      totalBudget: budget.totalBudget,
      expenses: budget.expenses,
    },
    itinerary: { days: itinerary.days },
    calendar: {
      events: itineraryDaysToCalendarEvents(
        itinerary.days,
        trip?.startDate,
      ),
    },
    packing: { categories: packing.categories },
  };
}

function applyFeatureState(data: TripFeatureData): void {
  const budget = useBudgetStore.getState();
  const packing = usePackingStore.getState();

  useBudgetStore.setState({
    totalBudget: data.budget.totalBudget,
    expenses: data.budget.expenses,
    filters: budget.filters,
  });
  useItineraryStore.setState({ days: data.itinerary.days });
  usePackingStore.setState({
    categories: data.packing.categories,
    filters: packing.filters,
  });
}

function persistActiveTrip(): void {
  const tripId = useTripStore.getState().activeTripId;
  if (!tripId || isSwitching) return;
  setTripFeatureData(tripId, captureFeatureState());
}

function schedulePersist(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistActiveTrip();
  }, 250);
}

function resolveFeatureDataForTrip(trip: Trip): TripFeatureData {
  const existing = getTripFeatureData(trip.id);
  if (existing) return existing;

  const legacy = readLegacyGlobalFeatureData();
  if (legacy && !localStorage.getItem(LEGACY_MIGRATED_FLAG)) {
    localStorage.setItem(LEGACY_MIGRATED_FLAG, "1");
    const merged: TripFeatureData = {
      ...legacy,
      budget: {
        ...legacy.budget,
        totalBudget: trip.budget > 0 ? trip.budget : legacy.budget.totalBudget,
      },
    };
    setTripFeatureData(trip.id, merged);
    return merged;
  }

  const created = createEmptyTripFeatureData(trip);
  setTripFeatureData(trip.id, created);
  return created;
}

function switchActiveTrip(fromId: string | null, toId: string | null): void {
  isSwitching = true;
  try {
    if (fromId) {
      setTripFeatureData(fromId, captureFeatureState());
    }

    if (!toId) return;

    const trip = useTripStore.getState().trips.find((t) => t.id === toId);
    if (!trip) return;

    const data = resolveFeatureDataForTrip(trip);
    applyFeatureState(data);
  } finally {
    isSwitching = false;
  }
}

function migrateLegacyIntoFirstTrip(): void {
  if (!isRegistryEmpty() || localStorage.getItem(LEGACY_MIGRATED_FLAG)) return;

  const legacy = readLegacyGlobalFeatureData();
  if (!legacy) return;

  const { trips, addTrip } = useTripStore.getState();
  if (trips.length > 0) {
    const first = trips[0];
    setTripFeatureData(first.id, legacy);
    localStorage.setItem(LEGACY_MIGRATED_FLAG, "1");
    return;
  }

  const id = addTrip({
    title: "Da Nang Family Trip",
    startDate: "2026-06-10",
    endDate: "2026-06-15",
    budget: legacy.budget.totalBudget,
  });
  setTripFeatureData(id, legacy);
  localStorage.setItem(LEGACY_MIGRATED_FLAG, "1");
}

export function initializeTripFeatureData(tripId: string): void {
  const trip = useTripStore.getState().trips.find((t) => t.id === tripId);
  if (!trip || hasTripFeatureData(tripId)) return;
  setTripFeatureData(tripId, createEmptyTripFeatureData(trip));
}

export function loadTripIntoStores(tripId: string): void {
  const trip = useTripStore.getState().trips.find((t) => t.id === tripId);
  if (!trip) return;
  const data = resolveFeatureDataForTrip(trip);
  isSwitching = true;
  try {
    applyFeatureState(data);
  } finally {
    isSwitching = false;
  }
}

export { computeTripProgress };

export function initTripScopeBridge(): void {
  if (initialized) return;
  initialized = true;

  migrateLegacyIntoFirstTrip();

  useTripStore.subscribe((state, prev) => {
    if (state.activeTripId !== prev.activeTripId) {
      switchActiveTrip(prev.activeTripId, state.activeTripId);
    }
  });

  const subscribeStore = <T extends object>(store: {
    subscribe: (listener: (state: T, prev: T) => void) => () => void;
  }) =>
    store.subscribe(() => {
      if (isSwitching) return;
      schedulePersist();
    });

  subscribeStore(useBudgetStore);
  subscribeStore(useItineraryStore);
  subscribeStore(usePackingStore);

  const { activeTripId } = useTripStore.getState();
  if (activeTripId) {
    loadTripIntoStores(activeTripId);
  }
}
