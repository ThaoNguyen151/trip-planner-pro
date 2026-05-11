import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { Trip } from '@/types/trip'

type TripPlannerState = {
  trips: Trip[]
  addTrip: (title: string) => void
  removeTrip: (id: string) => void
}

function newTripId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useTripStore = create<TripPlannerState>()(
  persist(
    (set) => ({
      trips: [],
      addTrip: (title) => {
        const t = title.trim()
        if (!t) return
        set((s) => ({
          trips: [
            ...s.trips,
            { id: newTripId(), title: t, createdAt: Date.now() },
          ],
        }))
      },
      removeTrip: (id) =>
        set((s) => ({ trips: s.trips.filter((x) => x.id !== id) })),
    }),
    {
      name: STORAGE_KEYS.TRIP_STATE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ trips: state.trips }),
    },
  ),
)
