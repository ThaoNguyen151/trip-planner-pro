import { eventChipClassForStatus } from "@/components/calendar/calendar-display-utils";
import { addDays, startOfMonth, toDateKey } from "@/lib/calendar-dates";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

const WEEKDAYS_SUN_FIRST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEKDAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

type CalendarMonthGridProps = {
  month: Date;
  compactGrid: boolean;
  selectedDateKey: string | null;
  eventsByDay: Map<string, CalendarEvent[]>;
  onSelectDateKey: (dateKey: string) => void;
};

export function CalendarMonthGrid({
  month,
  compactGrid,
  selectedDateKey,
  eventsByDay,
  onSelectDateKey,
}: CalendarMonthGridProps) {
  const first = startOfMonth(month);
  const weekday = first.getDay();
  const gridStart = addDays(first, -weekday);
  const daysGrid = Array.from({ length: compactGrid ? 35 : 42 }, (_, i) =>
    addDays(gridStart, i),
  );
  const maxEventsInCell = compactGrid ? 2 : 3;

  return (
    <article className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-card sm:rounded-xl">
      <div className="grid grid-cols-7 divide-x divide-border border-b border-border bg-muted text-center text-[9px] font-semibold uppercase tracking-wide text-foreground sm:text-[11px]">
        {WEEKDAYS_SUN_FIRST.map((d, i) => (
          <div key={d} className="bg-muted py-2 md:py-3">
            <span className="md:hidden">{WEEKDAY_SHORT[i]}</span>
            <span className="hidden md:inline">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-y divide-border">
        {daysGrid.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const key = toDateKey(d);
          const dayEvents = eventsByDay.get(key) ?? [];
          const max = maxEventsInCell;
          const isSelected = selectedDateKey === key;

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`${key}, ${dayEvents.length} activities`}
              className={cn(
                "cursor-pointer p-1 outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-ring sm:p-1.5",
                compactGrid ? "min-h-[68px]" : "min-h-[82px]",
                inMonth ? "bg-card" : "bg-muted/40",
                isSelected && "shadow-[inset_0_0_0_2px] shadow-primary",
              )}
              onClick={() => onSelectDateKey(key)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  onSelectDateKey(key);
                }
              }}
            >
              <div className="flex items-center justify-between gap-0.5 sm:gap-1">
                <div
                  className={cn(
                    "font-semibold tabular-nums",
                    compactGrid ? "text-[11px]" : "text-xs",
                    inMonth ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {d.getDate()}
                </div>
                {dayEvents.length > 0 ? (
                  <div className="hidden text-[10px] font-medium text-muted-foreground sm:block">
                    {dayEvents.length} item{dayEvents.length > 1 ? "s" : ""}
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "pointer-events-none space-y-0.5",
                  compactGrid ? "mt-1" : "mt-1.5",
                )}
              >
                {dayEvents.slice(0, max).map((e) => (
                  <div
                    key={e.id}
                    className={cn(
                      "w-full truncate rounded-md px-1 py-px text-left font-semibold sm:px-2 sm:py-0.5",
                      compactGrid ? "text-[9px]" : "text-[10px]",
                      eventChipClassForStatus(e.status),
                    )}
                    title={`${e.title} · ${e.category} · ${e.priority} · ${e.status}`}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > max ? (
                  <div className="text-[10px] font-medium text-muted-foreground">
                    +{dayEvents.length - max} more
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
