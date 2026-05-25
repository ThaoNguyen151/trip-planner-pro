import { useState, useMemo } from "react";
import { useItineraryStore } from "@/stores";
import type { ItineraryDay } from "@/types";

interface ItineraryFilters {
  date: string;
  category: string;
  status: string;
  priority: string;
}

const DEFAULT_FILTERS: ItineraryFilters = {
  date: "All Dates",
  category: "All Categories",
  status: "All Status",
  priority: "All Priorities",
};

export function useItineraryFilters() {
  const days = useItineraryStore((s) => s.days);
  const [filters, setFilters] = useState<ItineraryFilters>(DEFAULT_FILTERS);

  const dateOptions = useMemo(
    () => ["All Dates", ...days.map((d) => d.date.replace(/^[^,]+, /, ""))],
    [days],
  );

  const hasActiveFilters = Object.values(filters).some(
    (v) =>
      v !== "All Dates" &&
      v !== "All Categories" &&
      v !== "All Status" &&
      v !== "All Priorities",
  );

  const filteredDays = useMemo<ItineraryDay[]>(() => {
    return days
      .filter((d) => {
        if (filters.date === "All Dates") return true;
        const shortDate = d.date.replace(/^[^,]+, /, "");
        return shortDate === filters.date;
      })
      .map((d) => ({
        ...d,
        activities: d.activities.filter((a) => {
          if (
            filters.category !== "All Categories" &&
            a.category !== filters.category
          )
            return false;
          if (filters.status !== "All Status" && a.status !== filters.status)
            return false;
          if (
            filters.priority !== "All Priorities" &&
            a.priority !== filters.priority
          )
            return false;
          return true;
        }),
      }))
      .filter((d) => d.activities.length > 0);
  }, [days, filters]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const updateFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return {
    filters,
    dateOptions,
    hasActiveFilters,
    filteredDays,
    clearFilters,
    updateFilter,
  };
}
