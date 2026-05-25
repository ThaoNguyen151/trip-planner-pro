import { create } from "zustand";
import type {
  ItineraryActivity,
  ItineraryDay,
  ItineraryStore,
} from "@/types/itinerary";

const sortByStartTime = (activities: ItineraryActivity[]) =>
  [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime));

export const useItineraryStore = create<ItineraryStore>()((set) => ({
  days: [],

  addActivity: (day, date, activity) =>
    set((state) => {
      const exists = state.days.some((d) => d.day === day);
      if (exists) {
        return {
          days: state.days.map((d) =>
            d.day === day
              ? {
                  ...d,
                  activities: sortByStartTime([
                    ...d.activities,
                    { id: crypto.randomUUID(), ...activity },
                  ]),
                }
              : d,
          ),
        };
      }
      const newDay: ItineraryDay = {
        day,
        date,
        activities: [{ id: crypto.randomUUID(), ...activity }],
      };
      const sorted = [...state.days, newDay].sort((a, b) => a.day - b.day);
      return { days: sorted };
    }),

  updateActivity: (day, activityId, updates, date) =>
    set((state) => {
      let originalActivity: ItineraryActivity | undefined;
      for (const d of state.days) {
        const found = d.activities.find((a) => a.id === activityId);
        if (found) {
          originalActivity = found;
          break;
        }
      }
      if (!originalActivity) return state;

      const merged = { ...originalActivity, ...updates };

      const daysWithoutActivity = state.days
        .map((d) => ({
          ...d,
          activities: d.activities.filter((a) => a.id !== activityId),
        }))
        .filter((d) => d.activities.length > 0);

      const targetExists = daysWithoutActivity.some((d) => d.day === day);
      if (targetExists) {
        return {
          days: daysWithoutActivity
            .map((d) =>
              d.day === day
                ? {
                    ...d,
                    activities: sortByStartTime([...d.activities, merged]),
                  }
                : d,
            )
            .sort((a, b) => a.day - b.day),
        };
      }

      const newDay: ItineraryDay = {
        day,
        date: date ?? "",
        activities: [merged],
      };
      return {
        days: [...daysWithoutActivity, newDay].sort((a, b) => a.day - b.day),
      };
    }),

  deleteActivity: (day, activityId) =>
    set((state) => ({
      days: state.days.map((d) =>
        d.day === day
          ? {
              ...d,
              activities: d.activities.filter((a) => a.id !== activityId),
            }
          : d,
      ),
    })),
}));
