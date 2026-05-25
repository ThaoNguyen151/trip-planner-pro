import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CreateTripDialog } from "@/components/overview/CreateTripModal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { createTripFromForm } from "@/lib/create-trip-from-form";

export default function OverviewPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center flex-col min-h-screen">
      <img
        src="/src/assets/EmtyStateOverview.png"
        alt="Overview Placeholder"
        className="w-2xl h-2xl shadow-md rounded-2xl"
      />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mt-4 text-primary-foreground">
          Overview Coming Soon!
        </h1>
        <h2 className="text-xl text-muted-foreground font-normal mt-4 text-center max-w-lg">
          Adventure is calling. Start planning your next journey and keep all
          your itineraries organized in one place.
        </h2>
        <Button
          variant="outline"
          size="lg"
          className="mt-6 h-12 px-8 text-base gap-2 bg-primary-foreground"
          onClick={() => setOpen(true)}
        >
          <CirclePlus className="size-5" />
          Start a new trip
        </Button>
      </div>

      <CreateTripDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => {
          const id = createTripFromForm(values);
          if (id) navigate(ROUTES.list);
        }}
      />
    </div>
  );
}
