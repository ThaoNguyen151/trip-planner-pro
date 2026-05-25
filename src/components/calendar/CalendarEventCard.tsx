import { AlertTriangle } from "lucide-react";

import {
  categoryBadgeClass,
  eventCardClassForStatus,
  formatTimeLabel,
  priorityBadgeClass,
  statusBadgeClass,
} from "@/components/calendar/calendar-display-utils";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

function CalendarTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        className,
      )}
    >
      {children}
    </span>
  );
}

type CalendarEventCardProps = {
  event: CalendarEvent;
  /** Tighter layout for mobile sheet. */
  compact?: boolean;
};

export function CalendarEventCard({ event, compact }: CalendarEventCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm",
        eventCardClassForStatus(event.status),
        compact ? "p-3.5" : "p-4",
      )}
    >
      {event.overdue ? (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <CalendarTag className="border-destructive bg-destructive text-destructive-foreground">
            Overdue
          </CalendarTag>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-destructive/70">
            <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
            Action required
          </span>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "min-w-0 flex-1 font-bold leading-snug text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {event.title}
        </p>
        <p
          className={cn(
            "shrink-0 font-semibold tabular-nums text-primary",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {formatTimeLabel(event.time)}
        </p>
      </div>

      {event.location ? (
        <p
          className={cn(
            "mt-1.5 text-muted-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {event.location}
        </p>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <CalendarTag className={categoryBadgeClass()}>
          {event.category}
        </CalendarTag>
        <CalendarTag className={priorityBadgeClass(event.priority)}>
          Priority: {event.priority}
        </CalendarTag>
        <CalendarTag className={statusBadgeClass(event.status)}>
          {event.status}
        </CalendarTag>
      </div>
    </div>
  );
}
