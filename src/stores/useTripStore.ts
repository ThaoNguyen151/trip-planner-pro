import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { removeTripFeatureData } from "@/lib/trip-data-registry";
import type { Trip } from "@/types/trip";

export type AddTripInput = {
  title: string;
  startDate: string;
  endDate: string;
  budget?: number;
  image?: string;
};

type TripPlannerState = {
  trips: Trip[];
  activeTripId: string | null;
  addTrip: (input: AddTripInput) => string;
  removeTrip: (id: string) => void;
  setActiveTripId: (id: string | null) => void;
  setTripImage: (id: string, image: string) => void;
  getActiveTrip: () => Trip | undefined;
};

function newTripId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useTripStore = create<TripPlannerState>()(
  persist(
    (set, get) => ({
      trips: [],
      activeTripId: null,

      addTrip: (input) => {
        const title = input.title.trim();
        const id = newTripId();
        if (!title) return id;

        const trip: Trip = {
          id,
          title,
          createdAt: Date.now(),
          budget: input.budget ?? 0,
          startDate: input.startDate,
          endDate: input.endDate,
          image: input.image,
        };

        set((s) => ({ trips: [...s.trips, trip] }));
        return id;
      },

      removeTrip: (id) => {
        removeTripFeatureData(id);
        set((s) => {
          const trips = s.trips.filter((x) => x.id !== id);
          const activeTripId =
            s.activeTripId === id
              ? (trips[trips.length - 1]?.id ?? null)
              : s.activeTripId;
          return { trips, activeTripId };
        });
      },

      setActiveTripId: (id) => set({ activeTripId: id }),

      setTripImage: (id, image) =>
        set((s) => ({
          trips: s.trips.map((t) => (t.id === id ? { ...t, image } : t)),
        })),

      getActiveTrip: () => {
        const { trips, activeTripId } = get();
        return trips.find((t) => t.id === activeTripId);
      },
    }),
    {
      name: STORAGE_KEYS.TRIP_STATE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trips: state.trips,
        activeTripId: state.activeTripId,
      }),
    },
  ),
);
