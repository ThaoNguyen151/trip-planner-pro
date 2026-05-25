import { useMemo } from "react";

import { itineraryDaysToCalendarEvents } from "@/lib/itinerary-to-calendar";
import { useItineraryStore } from "@/stores/useItineraryStore";
import { useTripStore } from "@/stores/useTripStore";
import type { CalendarEvent } from "@/types/calendar";

/** Calendar events derived from the active trip's itinerary (not calendar-seed). */
export function useItineraryCalendarEvents(): CalendarEvent[] {
  const days = useItineraryStore((s) => s.days);
  const tripStartDate = useTripStore((s) => {
    const trip = s.trips.find((t) => t.id === s.activeTripId);
    return trip?.startDate;
  });

  return useMemo(
    () => itineraryDaysToCalendarEvents(days, tripStartDate),
    [days, tripStartDate],
  );
}
