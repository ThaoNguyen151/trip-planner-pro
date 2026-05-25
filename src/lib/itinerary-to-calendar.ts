import { addDays, parseISO } from "date-fns";

import { toDateKey } from "@/lib/calendar-dates";
import type { CalendarEvent, CalendarEventKind } from "@/types/calendar";
import { colorForCalendarKind } from "@/types/calendar";
import type {
  ActivityCategory,
  ItineraryActivity,
  ItineraryDay,
} from "@/types/itinerary";

/** Parse itinerary day label (e.g. "Wednesday, June 10, 2026") to yyyy-mm-dd. */
export function itineraryDateToDateKey(
  dateStr: string,
  tripStartDate?: string,
  dayNumber?: number,
): string | null {
  const trimmed = dateStr?.trim();
  if (trimmed) {
    const parsed = new Date(trimmed.replace(/^[^,]+, /, ""));
    if (!Number.isNaN(parsed.getTime())) {
      return toDateKey(parsed);
    }
  }

  if (tripStartDate && dayNumber != null && dayNumber > 0) {
    try {
      const start = parseISO(tripStartDate);
      if (!Number.isNaN(start.getTime())) {
        const offset = dayNumber - 1;
        return toDateKey(addDays(start, offset));
      }
    } catch {
      /* fall through */
    }
  }

  return null;
}

function categoryToKind(category: ActivityCategory): CalendarEventKind {
  switch (category) {
    case "Transport":
      return "booking";
    case "Lodging":
      return "stay";
    case "Dining":
    case "Sightseeing":
    default:
      return "activity";
  }
}

function activityToCalendarEvent(
  activity: ItineraryActivity,
  dateKey: string,
): CalendarEvent {
  const kind = categoryToKind(activity.category);
  const subtitleParts = [activity.location, activity.status].filter(Boolean);

  return {
    id: activity.id,
    dateKey,
    title: activity.title,
    kind,
    color: colorForCalendarKind(kind),
    subtitle: subtitleParts.length > 0 ? subtitleParts.join(" · ") : undefined,
    time: activity.startTime,
  };
}

export function itineraryDaysToCalendarEvents(
  days: ItineraryDay[],
  tripStartDate?: string,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const day of days) {
    const dateKey = itineraryDateToDateKey(
      day.date,
      tripStartDate,
      day.day,
    );
    if (!dateKey) continue;

    for (const activity of day.activities) {
      events.push(activityToCalendarEvent(activity, dateKey));
    }
  }

  return events;
}
