import type { CalendarEventColor, CalendarEventKind } from "@/types/calendar";

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
      return "bg-sky-600";
    case "violet":
      return "bg-violet-600";
    case "amber":
      return "bg-amber-600";
    case "emerald":
      return "bg-emerald-600";
    case "stone":
      return "bg-slate-500";
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
