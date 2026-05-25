import { X } from "lucide-react";

import { CalendarEventCard } from "@/components/calendar/CalendarEventCard";
import {
  dotClassForColor,
  formatLongWeekdayDate,
} from "@/components/calendar/calendar-display-utils";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

type ScheduledActivitiesPanelProps = {
  dateKey: string;
  events: CalendarEvent[];
  onClose: () => void;
  variant: "aside" | "sheet";
};

export function ScheduledActivitiesPanel({
  dateKey,
  events,
  onClose,
  variant,
}: ScheduledActivitiesPanelProps) {
  const longDate = formatLongWeekdayDate(dateKey);

  if (variant === "sheet") {
    return (
      <div
        className="flex max-h-[min(85dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        role="document"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0 pr-2">
            <h2
              id="scheduled-activities-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Activities
            </h2>
            <p className="mt-0.5 text-sm font-medium text-muted-foreground">
              {longDate}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {events.length === 0 ? (
            <p className="rounded-xl bg-muted/50 py-8 text-center text-sm text-muted-foreground ring-1 ring-border">
              No activities for this day.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {events.map((e) => (
                <li key={e.id}>
                  <CalendarEventCard event={e} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[min(85vh,720px)] flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2
          id="scheduled-activities-title"
          className="text-base font-semibold text-foreground"
        >
          Scheduled activities
        </h2>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <p className="shrink-0 border-b border-border px-4 py-2 text-xs text-muted-foreground">
        {longDate}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activities for this day.
          </p>
        ) : (
          <ul className="space-y-0">
            {events.map((e) => (
              <li
                key={e.id}
                className="relative border-l-2 border-border pb-4 pl-5 last:pb-0"
              >
                <span
                  className={cn(
                    "absolute left-[-5px] top-4 size-2 rounded-full",
                    dotClassForColor(e.color),
                  )}
                  aria-hidden
                />
                <CalendarEventCard event={e} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
