import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/overview/CreateTripModal";
import { TripCard, type Trip } from "@/components/overview/TripCard";
import { ROUTES } from "@/constants/routes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

const MOCK_TRIPS: Trip[] = [
  {
    id: 1,
    name: "Tokyo Tech Tour",
    dateRange: "Dec 01 - Dec 10, 2024",
    progress: 90,
  },
  {
    id: 2,
    name: "Tokyo Tech Tour",
    dateRange: "Dec 01 - Dec 10, 2024",
    progress: 90,
  },
  {
    id: 3,
    name: "Tokyo Tech Tour",
    dateRange: "Dec 01 - Dec 10, 2024",
    progress: 90,
  },
  {
    id: 4,
    name: "Parisian Spring",
    dateRange: "Apr 15 - Apr 22, 2025",
    progress: 15,
  },
];

export default function ListPage() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTrips = localStorage.getItem("trips");

    return savedTrips ? JSON.parse(savedTrips) : MOCK_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const handleImageChange = (id: number, image: string) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, image } : t)));
  };

  return (
    <div className="max-w-full min-h-screen flex flex-col ">
      {/* Header row */}
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
            Add Item
          </Button>
        </div>
      </div>

      {/* Trip grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onImageChange={handleImageChange}
          />
        ))}
      </div>

      <CreateTripDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => {
          console.log(values);
          navigate(ROUTES.list);
        }}
      />
    </div>
  );
}
