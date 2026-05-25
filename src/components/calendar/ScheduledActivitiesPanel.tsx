import { X } from "lucide-react";

import {
  dotClassForColor,
  formatLongWeekdayDate,
  formatTimeLabel,
  kindTagLabel,
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
        className="flex max-h-[min(85dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-sky-100/95 shadow-2xl ring-1 ring-sky-200/70"
        role="document"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-sky-200/50 px-4 py-3">
          <div className="min-w-0 pr-2">
            <h2
              id="scheduled-activities-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Activities
            </h2>
            <p className="mt-0.5 text-sm font-medium text-slate-600">{longDate}</p>
          </div>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {events.length === 0 ? (
            <p className="rounded-xl bg-white/80 py-8 text-center text-sm text-slate-600 ring-1 ring-slate-200/60">
              No activities for this day.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {events.map((e) => (
                <li key={e.id}>
                  <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200/60">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 flex-1 text-base font-bold leading-snug text-slate-900">
                        {e.title}
                      </p>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-sky-700">
                        {formatTimeLabel(e.time)}
                      </p>
                    </div>
                    {e.subtitle ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {e.subtitle}
                      </p>
                    ) : null}
                    {/* <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                      {longDate}
                    </p> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[min(85vh,720px)] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2
          id="scheduled-activities-title"
          className="text-base font-semibold text-slate-900"
        >
          Scheduled activities
        </h2>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <p className="shrink-0 border-b border-slate-50 px-4 py-2 text-xs text-slate-500">
        {dateKey}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No activities for this day.
          </p>
        ) : (
          <ul className="space-y-0">
            {events.map((e) => (
              <li
                key={e.id}
                className="relative border-l-2 border-slate-200 pb-4 pl-5 last:pb-0"
              >
                <span
                  className={cn(
                    "absolute left-[-5px] top-1.5 size-2 rounded-full",
                    dotClassForColor(e.color),
                  )}
                  aria-hidden
                />
                <div className="rounded-lg border border-slate-100 bg-sky-50/50 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {e.title}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-slate-600">
                        {formatTimeLabel(e.time)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                      {kindTagLabel(e.kind)}
                    </span>
                  </div>
                  {e.subtitle ? (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {e.subtitle}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
