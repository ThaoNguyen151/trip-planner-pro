import { useState } from "react";
import { ImageIcon } from "lucide-react";

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
}

export function TripCard({
  trip,
  title,
  dateRange,
  progress,
  onOpen,
  onImageChange,
}: TripCardProps) {
  const displayTitle = (title ?? trip.title).trim() || "Untitled trip";
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectImage = (url: string) => {
    onImageChange?.(trip.id, url);
    setPickerOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => onOpen?.(trip.id)}
        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full"
      >
        <div
          className="relative group h-36 w-full cursor-pointer sm:h-40 md:h-44"
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen(true);
          }}
        >
          <img
            src={trip.image ?? DEFAULT_IMAGE}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <ImageIcon className="size-4" />
              Change photo
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-base font-semibold text-slate-900">{displayTitle}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{dateRange}</p>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-1.5">
              {progress}% planned
            </p>
            <Progress
              value={progress}
              className="h-1.5 bg-slate-200 [&>div]:bg-violet-600"
            />
          </div>
        </div>
      </button>

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
