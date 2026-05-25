import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateTripDialog } from "@/components/overview/CreateTripModal";
import { TripCard } from "@/components/overview/TripCard";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tripPath } from "@/constants/routes";
import { createTripFromForm } from "@/lib/create-trip-from-form";
import { formatTripDateRange, getTripListProgress } from "@/lib/trip-display";
import { useTripPlanner } from "@/hooks/useTripPlanner";
import { useTripStore } from "@/stores/useTripStore";
import { Plus } from "lucide-react";

export default function ListPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { trips, setActiveTripId, setTripImage } = useTripPlanner();

  useEffect(() => {
    useTripStore.getState().setActiveTripId(null);
  }, []);

  const handleOpenTrip = (tripId: string) => {
    setActiveTripId(tripId);
    navigate(tripPath(tripId, "dashboard"));
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Trips
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base md:text-lg">
            Manage your upcoming adventures and past memories.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:w-auto md:justify-end">
        <ToggleGroup
          type="single"
          size="default"
          defaultValue="upcoming"
          className="w-full justify-center rounded-full bg-transparent sm:w-auto md:h-10"
        >
            <ToggleGroupItem
              value="upcoming"
              aria-label="Toggle upcoming"
              className="flex-1 rounded-full px-3 py-2 text-xs sm:flex-none sm:px-4 sm:text-sm data-[state=on]:bg-violet-600 data-[state=on]:text-white"
            >
              Upcoming
            </ToggleGroupItem>
            <ToggleGroupItem
              value="past"
              aria-label="Toggle past"
              className="flex-1 rounded-full px-3 py-2 text-xs sm:flex-none sm:px-4 sm:text-sm data-[state=on]:bg-violet-600 data-[state=on]:text-white"
            >
              Past
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full gap-2 sm:h-12 sm:w-auto sm:px-6"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Trip
          </Button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-12 text-center sm:py-16">
          <p className="text-base font-medium text-slate-900 sm:text-lg">
            No trips yet
          </p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Create your first trip to start planning itinerary, budget,
            calendar, and packing in one place.
          </p>
          <Button className="mt-6 w-full sm:w-auto" onClick={() => setOpen(true)}>
            Create trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              dateRange={formatTripDateRange(trip.startDate, trip.endDate)}
              progress={getTripListProgress(trip)}
              onOpen={handleOpenTrip}
              onImageChange={(id, image) => setTripImage(id, image)}
            />
          ))}
        </div>
      )}

      <CreateTripDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => {
          createTripFromForm(values);
        }}
      />
    </div>
  );
}
