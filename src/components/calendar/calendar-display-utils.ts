import type { CalendarEventColor, CalendarEventKind } from "@/types/calendar";
import type { ActivityPriority, ActivityStatus } from "@/types/itinerary";

export function timeSortKey(t?: string): number {
  if (!t?.trim()) return 24 * 60 + 1;
  const m = t.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!m) return 24 * 60 + 2;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function formatTimeLabel(t?: string): string {
  if (!t?.trim()) return "—";
  const m = t.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!m) return t.trim();
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(min).padStart(2, "0")} ${ampm}`;
}

/** e.g. "Wednesday, June 10" from yyyy-mm-dd (local). */
export function formatLongWeekdayDate(dateKey: string): string {
  const parts = dateKey.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateKey;
  const [y, mo, d] = parts;
  const dt = new Date(y, mo - 1, d);
  if (Number.isNaN(dt.getTime())) return dateKey;
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function kindTagLabel(kind: CalendarEventKind): string {
  switch (kind) {
    case "booking":
      return "FLIGHT";
    case "stay":
      return "STAY";
    case "activity":
      return "ACTIVITY";
    case "reminder":
      return "REMINDER";
  }
}

export function dotClassForColor(color: CalendarEventColor): string {
  switch (color) {
    case "sky":
      return "bg-sky-600 dark:bg-sky-400";
    case "violet":
      return "bg-violet-600 dark:bg-violet-400";
    case "amber":
      return "bg-amber-600 dark:bg-amber-400";
    case "emerald":
      return "bg-emerald-600 dark:bg-emerald-400";
    case "stone":
      return "bg-slate-500 dark:bg-slate-400";
  }
}

export function eventChipClassForColor(color: CalendarEventColor): string {
  switch (color) {
    case "sky":
      return "bg-sky-50 text-sky-900 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-800/60";
    case "violet":
      return "bg-violet-50 text-violet-900 ring-1 ring-violet-100 dark:bg-violet-950/50 dark:text-violet-200 dark:ring-violet-800/60";
    case "amber":
      return "bg-amber-50 text-amber-950 ring-1 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800/60";
    case "emerald":
      return "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800/60";
    case "stone":
      return "bg-muted text-muted-foreground ring-1 ring-border";
  }
}

export function eventChipClassForStatus(status: ActivityStatus): string {
  return eventChipClassForColor(
    status === "Planned"
      ? "stone"
      : status === "Confirmed"
        ? "emerald"
        : "sky",
  );
}

export function eventCardClassForStatus(status: ActivityStatus): string {
  switch (status) {
    case "Planned":
      return "border-border bg-muted/40";
    case "Confirmed":
      return "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-800/60 dark:bg-emerald-950/30";
    case "Completed":
      return "border-sky-200/80 bg-sky-50/40 dark:border-sky-800/60 dark:bg-sky-950/30";
  }
}

export function categoryBadgeClass(): string {
  return "border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15";
}

export function priorityBadgeClass(priority: ActivityPriority): string {
  switch (priority) {
    case "High":
      return "border border-red-100 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300";
    case "Medium":
      return "border border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300";
    case "Low":
      return "border border-border bg-muted text-muted-foreground";
  }
}

export function statusBadgeClass(status: ActivityStatus): string {
  switch (status) {
    case "Planned":
      return "border border-border bg-muted text-muted-foreground";
    case "Confirmed":
      return "border border-green-100 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300";
    case "Completed":
      return "border border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300";
  }
}

export function sortEventsByTime<
  T extends { time?: string; title: string },
>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const ta = timeSortKey(a.time);
    const tb = timeSortKey(b.time);
    if (ta !== tb) return ta - tb;
    return a.title.localeCompare(b.title);
  });
}
