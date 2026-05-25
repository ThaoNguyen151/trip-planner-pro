import { monthLabel } from "@/lib/calendar-dates";
import { MonthNavGroup } from "@/components/calendar/MonthNavGroup";

type CalendarPageHeaderProps = {
  month: Date;
  tripSubtitle: string;
  onPrevMonth: () => void;
  onTodayMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarPageHeader({
  month,
  tripSubtitle,
  onPrevMonth,
  onTodayMonth,
  onNextMonth,
}: CalendarPageHeaderProps) {
  const label = monthLabel(month);

  return (
    <header className="pt-1">
      <div className="flex flex-col items-stretch gap-3 md:hidden">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] sm:text-2xl">
            {label}
          </h1>
          <p className="mt-1 line-clamp-2 px-1 text-xs leading-snug text-slate-500 sm:text-sm">
            {tripSubtitle}
          </p>
        </div>
        <MonthNavGroup
          compact
          onPrev={onPrevMonth}
          onToday={onTodayMonth}
          onNext={onNextMonth}
        />
      </div>

      <div className="relative mb-4 hidden items-center justify-end md:flex">
        <div className="pointer-events-none absolute inset-x-0 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl">
            {label}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
            {tripSubtitle}
          </p>
        </div>
        <MonthNavGroup
          onPrev={onPrevMonth}
          onToday={onTodayMonth}
          onNext={onNextMonth}
        />
      </div>
    </header>
  );
}
