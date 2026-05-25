import { format } from "date-fns";

import type { TripFormValues } from "@/components/overview/CreateTripModal";
import { initializeTripFeatureData } from "@/lib/trip-scope-bridge";
import { useTripStore } from "@/stores/useTripStore";

export function createTripFromForm(values: TripFormValues): string | null {
  const title = values.tripName.trim();
  if (!title || !values.startDate || !values.endDate) return null;

  const budget =
    Number.parseFloat(values.tripBudget.replace(/,/g, "").trim()) || 0;
  const startDate = format(values.startDate, "yyyy-MM-dd");
  const endDate = format(values.endDate, "yyyy-MM-dd");

  const id = useTripStore.getState().addTrip({
    title,
    startDate,
    endDate,
    budget,
  });

  initializeTripFeatureData(id);

  return id;
}
