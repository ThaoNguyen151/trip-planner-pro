import { useEffect, useMemo, useState } from "react";

import {
  CalendarMonthGrid,
  CalendarPageHeader,
  ScheduledActivitiesPanel,
} from "@/components/calendar";
import { sortEventsByTime } from "@/components/calendar/calendar-display-utils";
import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { useItineraryCalendarEvents } from "@/hooks/useItineraryCalendarEvents";
import { addDays, startOfMonth, toDateKey } from "@/lib/calendar-dates";
import type { CalendarEvent } from "@/types/calendar";

export default function CalendarPage() {
  const [month, setMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [compactGrid, setCompactGrid] = useState(false);

  const events = useItineraryCalendarEvents();
  const { title: tripSubtitle } = useActiveTripMeta();

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.dateKey) ?? [];
      arr.push(e);
      map.set(e.dateKey, arr);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateKey) return [];
    const list = events.filter((e) => e.dateKey === selectedDateKey);
    return sortEventsByTime(list);
  }, [selectedDateKey, events]);

  const daysGrid = useMemo(() => {
    const first = startOfMonth(month);
    const weekday = first.getDay();
    const gridStart = addDays(first, -weekday);
    return Array.from({ length: compactGrid ? 35 : 42 }, (_, i) =>
      addDays(gridStart, i),
    );
  }, [month, compactGrid]);

  useEffect(() => {
    if (!selectedDateKey) return;
    const visible = daysGrid.some((d) => toDateKey(d) === selectedDateKey);
    if (!visible) queueMicrotask(() => setSelectedDateKey(null));
  }, [daysGrid, selectedDateKey]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setCompactGrid(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const goPrevMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNextMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const goTodayMonth = () => setMonth(() => new Date());

  function closeDayPanel() {
    setSelectedDateKey(null);
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-3 px-2 sm:gap-4 sm:px-4 md:px-6">
      <CalendarPageHeader
        month={month}
        tripSubtitle={tripSubtitle}
        onPrevMonth={goPrevMonth}
        onTodayMonth={goTodayMonth}
        onNextMonth={goNextMonth}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
        <CalendarMonthGrid
          month={month}
          compactGrid={compactGrid}
          selectedDateKey={selectedDateKey}
          eventsByDay={eventsByDay}
          onSelectDateKey={setSelectedDateKey}
        />

        {selectedDateKey ? (
          <aside className="hidden w-full max-w-md shrink-0 md:block md:w-80 lg:w-96">
            <ScheduledActivitiesPanel
              variant="aside"
              dateKey={selectedDateKey}
              events={selectedDayEvents}
              onClose={closeDayPanel}
            />
          </aside>
        ) : null}
      </div>

      {selectedDateKey ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/45 p-4 md:hidden"
          role="presentation"
          onClick={closeDayPanel}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheduled-activities-title"
            className="my-auto w-full max-w-md"
            onClick={(ev) => ev.stopPropagation()}
          >
            <ScheduledActivitiesPanel
              variant="sheet"
              dateKey={selectedDateKey}
              events={selectedDayEvents}
              onClose={closeDayPanel}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
