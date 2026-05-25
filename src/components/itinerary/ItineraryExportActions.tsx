import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadItineraryPdf } from "@/lib/itinerary-pdf";
import type { ItineraryDay } from "@/types/itinerary";

type ItineraryExportActionsProps = {
  tripTitle: string;
  dateRange: string;
  days: ItineraryDay[];
};

function daysWithActivities(days: ItineraryDay[]): ItineraryDay[] {
  return days.filter((d) => d.activities.length > 0);
}

export function ItineraryExportActions({
  tripTitle,
  dateRange,
  days,
}: ItineraryExportActionsProps) {
  const [exporting, setExporting] = useState(false);
  const exportableDays = daysWithActivities(days);
  const hasData = exportableDays.length > 0;

  async function handleDownloadPdf() {
    if (!hasData || exporting) return;
    setExporting(true);
    try {
      await downloadItineraryPdf({
        tripTitle,
        dateRange,
        days: exportableDays,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 self-start md:self-auto"
      disabled={!hasData || exporting}
      onClick={handleDownloadPdf}
    >
      {exporting ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <FileDown className="size-4" aria-hidden />
      )}
      {exporting ? "Exporting…" : "Export PDF"}
    </Button>
  );
}
