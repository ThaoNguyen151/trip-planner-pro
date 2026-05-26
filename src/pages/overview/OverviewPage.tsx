import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CreateTripDialog } from "@/components/overview/CreateTripModal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { createTripFromForm } from "@/lib/create-trip-from-form";
import emptyStateOverviewImg from "@/assets/EmtyStateOverview.png";

export default function OverviewPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <img
        src={emptyStateOverviewImg}
        alt="Start planning your next trip"
        className="w-full max-w-[280px] rounded-2xl shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square object-cover"
      />
      <div className="mt-6 flex w-full max-w-lg flex-col items-center text-center sm:mt-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">
          Overview Coming Soon!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base md:text-lg">
          Adventure is calling. Start planning your next journey and keep all
          your itineraries organized in one place.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="mt-6 h-11 w-full gap-2 sm:h-12 sm:w-auto sm:px-8"
          onClick={() => setOpen(true)}
        >
          <CirclePlus className="size-5 shrink-0" />
          Start a new trip
        </Button>
      </div>

      <CreateTripDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => {
          const id = createTripFromForm(values);
          if (id) navigate(ROUTES.trips);
        }}
      />
    </div>
  );
}
