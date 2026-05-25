import { useState } from "react";
import { ImageIcon, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/trip";

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400",
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
  "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400",
];

const DEFAULT_IMAGE = STOCK_IMAGES[0];

interface TripCardProps {
  trip: Trip;
  dateRange: string;
  progress: number;
  title?: string;
  onOpen?: (id: string) => void;
  onImageChange?: (id: string, image: string) => void;
  onResetData?: (id: string) => void;
}

export function TripCard({
  trip,
  title,
  dateRange,
  progress,
  onOpen,
  onImageChange,
  onResetData,
}: TripCardProps) {
  const displayTitle = (title ?? trip.title).trim() || "Untitled trip";
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectImage = (url: string) => {
    onImageChange?.(trip.id, url);
    setPickerOpen(false);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md">
        <button
          type="button"
          className="group relative block h-36 w-full cursor-pointer sm:h-40 md:h-44"
          onClick={() => setPickerOpen(true)}
          aria-label={`Change photo for ${displayTitle}`}
        >
          <img
            src={trip.image ?? DEFAULT_IMAGE}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ImageIcon className="size-4" aria-hidden />
              Change photo
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpen?.(trip.id)}
          className="w-full p-4 text-left"
        >
          <h2 className="text-base font-semibold text-slate-900">
            {displayTitle}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{dateRange}</p>
          <div className="mt-4">
            <p className="mb-1.5 text-sm font-medium text-slate-700">
              {progress}% planned
            </p>
            <Progress
              value={progress}
              className="h-1.5 bg-slate-200 [&>div]:bg-violet-600"
            />
          </div>
        </button>

        {onResetData ? (
          <div className="border-t border-slate-100 px-4 pb-4 pt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 w-full gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onResetData(trip.id)}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset trip
            </Button>
          </div>
        ) : null}
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a photo</DialogTitle>
          </DialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STOCK_IMAGES.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => handleSelectImage(url)}
                className={cn(
                  "rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                  trip.image === url
                    ? "border-primary"
                    : "border-transparent hover:border-slate-300",
                )}
              >
                <img
                  src={url}
                  alt="stock"
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
