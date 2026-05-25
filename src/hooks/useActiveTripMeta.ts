import { differenceInDays, parseISO } from "date-fns";

import { formatTripDateRange } from "@/lib/trip-display";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useTripStore } from "@/stores/useTripStore";

/** Tên, ngày, budget của trip đang active — dùng chung cho header các trang feature. */
export function useActiveTripMeta() {
  const activeTrip = useTripStore((s) =>
    s.trips.find((t) => t.id === s.activeTripId),
  );
  const totalBudget = useBudgetStore((s) => s.totalBudget);
  const totalActual = useBudgetStore((s) =>
    s.expenses.reduce((sum, e) => sum + (e.actualCost ?? 0), 0),
  );

  const title = activeTrip?.title ?? "Trip";
  const startDate = activeTrip?.startDate ?? "";
  const endDate = activeTrip?.endDate ?? "";
  const dateRange =
    startDate && endDate ? formatTripDateRange(startDate, endDate) : "";

  let dayCount = 0;
  if (startDate && endDate) {
    try {
      dayCount =
        differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    } catch {
      dayCount = 0;
    }
  }

  const remainingBudget = Math.max(0, totalBudget - totalActual);
  const budgetUsagePercent =
    totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  return {
    title,
    startDate,
    endDate,
    dateRange,
    dayCount,
    totalBudget,
    totalActual,
    remainingBudget,
    budgetUsagePercent,
  };
}
