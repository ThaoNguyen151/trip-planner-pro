import { ItineraryExportActions } from "@/components/itinerary";
import { ActiveTripHeader } from "@/components/shared/ActiveTripHeader";
import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { useItineraryStore } from "@/stores";

export function DashboardHeader() {
  const { title, dateRange } = useActiveTripMeta();
  const days = useItineraryStore((s) => s.days);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <ActiveTripHeader variant="dashboard" className="flex flex-col gap-2" />
      <ItineraryExportActions
        tripTitle={title}
        dateRange={dateRange}
        days={days}
      />
    </div>
  );
}
