import { useState } from "react";
import { Plus } from "lucide-react";
import { FilterBar, DaySection, AddItemModal } from "@/components/itinerary";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useItineraryFilters } from "@/hooks/useItineraryFilters";
import { useItineraryStore } from "@/stores";
import type { ItineraryActivity } from "@/types";

export default function ItineraryPage() {
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

  const handleEditActivity = (activity: ItineraryActivity, day: number) => {
    setEditingItem({ activity, day });
    setAddOpen(true);
  };

  const handleDeleteActivity = (day: number, activityId: string) => {
    setDeleteTarget({ day, activityId });
  };

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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 rounded-xl bg-slate-100 px-2 py-6 sm:px-4 md:px-6">
      {/* Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Da Nang Family Trip
          </h2>
          <p className="mt-1 text-base text-muted-foreground">
            June 10 - June 17, 2026
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
        >
          <Plus className="size-4" />
          Add Item
        </button>
      </section>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        dateOptions={dateOptions}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Timeline */}
      <div className="relative pl-14">
        <div className="absolute bottom-0 left-5.75 top-0 w-0.5 bg-border/40" />
        {filteredDays.map((day) => (
          <DaySection
            key={day.day}
            {...day}
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
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Item?"
        description="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
