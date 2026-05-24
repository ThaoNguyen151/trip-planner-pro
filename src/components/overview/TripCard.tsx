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

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", // Tokyo
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", // Paris
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400", // Mountains
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", // Beach
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400", // Italy
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400", // London
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", // Dubai
  "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400", // Bali
];

const DEFAULT_IMAGE = STOCK_IMAGES[0];

export interface Trip {
  id: number;
  name: string;
  dateRange: string;
  progress: number;
  image?: string;
}

interface TripCardProps {
  trip: Trip;
  onImageChange?: (id: number, image: string) => void;
}

export function TripCard({ trip, onImageChange }: TripCardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectImage = (url: string) => {
    onImageChange?.(trip.id, url);
    setPickerOpen(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div
          className="relative group w-full h-40 cursor-pointer"
          onClick={() => setPickerOpen(true)}
        >
          <img
            src={trip.image ?? DEFAULT_IMAGE}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <ImageIcon className="size-4" />
              Change photo
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="font-semibold text-primary-foreground">{trip.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {trip.dateRange}
          </p>
          <div className="mt-4">
            <p className="text-sm text-primary-foreground font-medium mb-1.5">
              {trip.progress}% planned
            </p>
            <Progress
              value={trip.progress}
              className="h-1.5 bg-muted-foreground [&>div]:bg-primary-foreground"
            />
          </div>
        </div>
      </div>

      {/* Image picker dialog */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose a photo</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {STOCK_IMAGES.map((url) => (
              <button
                key={url}
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
