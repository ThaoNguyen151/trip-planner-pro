import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { FilterBar, DaySection, AddItemModal } from "@/components/itinerary";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ActiveTripHeader } from "@/components/shared/ActiveTripHeader";
import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { useItineraryFilters } from "@/hooks/useItineraryFilters";
import { useItineraryStore } from "@/stores";
import type { ItineraryActivity } from "@/types";

export default function ItineraryPage() {
  const { startDate, endDate } = useActiveTripMeta();
  const [addOpen, setAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    activity: ItineraryActivity;
    day: number;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    day: number;
    activityId: string;
  } | null>(null);
  const deleteActivity = useItineraryStore((s) => s.deleteActivity);
  const {
    filters,
    dateOptions,
    hasActiveFilters,
    filteredDays,
    clearFilters,
    updateFilter,
  } = useItineraryFilters();

  const handleEditActivity = useCallback(
    (activity: ItineraryActivity, day: number) => {
      setEditingItem({ activity, day });
      setAddOpen(true);
    },
    [],
  );

  const handleDeleteActivity = useCallback(
    (day: number, activityId: string) => {
      setDeleteTarget({ day, activityId });
    },
    [],
  );

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteActivity(deleteTarget.day, deleteTarget.activityId);
      setDeleteTarget(null);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setEditingItem(null);
    }
    setAddOpen(open);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 rounded-xl bg-muted/40 px-2 py-4 sm:px-4 sm:gap-5 md:px-6 md:py-6 md:gap-6">
      {/* Header */}
      <ActiveTripHeader
        variant="page"
        action={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:self-auto"
          >
            <Plus className="size-4" />
            Add Item
          </button>
        }
      />

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        dateOptions={dateOptions}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Timeline */}
      <div className="relative pl-12 md:pl-14">
        <div className="absolute bottom-0 left-[1.1875rem] top-0 w-0.5 bg-border/40 md:left-5.75" />
        {filteredDays.map((day) => (
          <DaySection
            key={day.day}
            day={day.day}
            date={day.date}
            activities={day.activities}
            forceExpand={hasActiveFilters}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        ))}
      </div>

      {filteredDays.length === 0 && hasActiveFilters && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No results match your filters
          </p>
          <p className="text-xs text-muted-foreground/60">
            Try adjusting or clearing the filters above
          </p>
        </div>
      )}

      <AddItemModal
        open={addOpen}
        onOpenChange={handleModalClose}
        editingActivity={editingItem?.activity}
        editingDay={editingItem?.day}
        minDate={startDate || undefined}
        maxDate={endDate || undefined}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Item?"
        description="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
