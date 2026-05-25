import { format, parseISO } from "date-fns";

import { computeTripProgress } from "@/lib/trip-feature-defaults";
import { getTripFeatureData } from "@/lib/trip-data-registry";
import type { Trip } from "@/types/trip";

export function formatTripDateRange(startDate: string, endDate: string): string {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

export function getTripListProgress(trip: Trip): number {
  return computeTripProgress(getTripFeatureData(trip.id));
}
