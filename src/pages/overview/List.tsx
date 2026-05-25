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

export function ToggleGroupSpacing() {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      defaultValue="top"
      variant="outline"
      spacing={2}
    >
      <ToggleGroupItem value="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem value="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

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
    <div className="max-w-full min-h-screen flex flex-col ">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">
            My Trips
          </h1>
          <p className="text-xl text-muted-foreground mt-0.5">
            Manage your upcoming adventures and past memories.
          </p>
        </div>

        <div className="flex items-center gap-7 flex-row">
          <ToggleGroup
            type="single"
            size="lg"
            defaultValue="upcoming"
            variant="outline"
            className="rounded-full border text-primary-foreground border-slate-200 bg-accent-foreground"
          >
            <ToggleGroupItem
              value="upcoming"
              aria-label="Toggle upcoming"
              className="rounded-full px-4 py-1.5 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Upcoming
            </ToggleGroupItem>
            <ToggleGroupItem
              value="past"
              aria-label="Toggle past"
              className="rounded-full px-4 py-1.5 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Past
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            size="lg"
            className=" h-12 px-8 text-base gap-2 bg-primary-foreground"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Trip
          </Button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 py-16 text-center">
          <p className="text-lg font-medium text-primary-foreground">
            No trips yet
          </p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Create your first trip to start planning itinerary, budget,
            calendar, and packing in one place.
          </p>
          <Button className="mt-6" onClick={() => setOpen(true)}>
            Create trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
