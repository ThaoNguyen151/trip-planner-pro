import { create } from "zustand";
import type { ItineraryActivity, ItineraryDay, ItineraryStore } from "@/types/itinerary";

let nextId = 1;
const genId = () => `act-${nextId++}`;

const sortByStartTime = (activities: ItineraryActivity[]) =>
  [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime));

function createInitialDays(): ItineraryDay[] {
  nextId = 1;
  return [
    {
      day: 10,
      date: "Wednesday, June 10, 2026",
      activities: [
        {
          id: genId(),
          title: "Arrival at DAD Airport",
          location: "Da Nang International Airport (SGN-DAD)",
          startTime: "14:30",
          endTime: "15:30",
          category: "Transport",
          priority: "High",
          status: "Planned",
          overdue: true,
        },
        {
          id: genId(),
          title: "Check-in: InterContinental Sun Peninsula",
          location: "Son Tra Peninsula, Da Nang",
          startTime: "16:00",
          endTime: "17:00",
          category: "Lodging",
          priority: "Medium",
          status: "Confirmed",
        overdue: false,
        },
        {
          id: genId(),
          title: "Seafood Lunch at My Khe Beach",
          location: "Be Man Restaurant",
          startTime: "12:30",
          endTime: "14:00",
          category: "Dining",
          priority: "Low",
          status: "Planned",
        overdue: false,
        },
      ],
    },
    {
      day: 11,
      date: "Thursday, June 11, 2026",
      activities: [
        {
          id: genId(),
          title: "Bana Hills & Golden Bridge Tour",
          location: "Sun World Bana Hills",
          startTime: "09:00",
          endTime: "17:00",
          category: "Sightseeing",
          priority: "High",
          status: "Planned",
        overdue: false,
        },
      ],
    },
    {
      day: 12,
      date: "Friday, June 12, 2026",
      activities: [
        {
          id: genId(),
          title: "Morning at My Khe Beach",
          location: "My Khe Beach",
          startTime: "06:00",
          endTime: "08:30",
          category: "Sightseeing",
          priority: "Medium",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Breakfast at The Tropical Garden",
          location: "Vo Nguyen Giap Street",
          startTime: "08:30",
          endTime: "09:30",
          category: "Dining",
          priority: "Low",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Marble Mountains Tour",
          location: "Hoa Hai, Ngu Hanh Son",
          startTime: "10:00",
          endTime: "13:00",
          category: "Sightseeing",
          priority: "High",
          status: "Confirmed",
        overdue: false,
        },
        {
          id: genId(),
          title: "Lunch at Moc Quan",
          location: "Near Marble Mountains",
          startTime: "13:00",
          endTime: "14:00",
          category: "Dining",
          priority: "Low",
          status: "Planned",
        overdue: false,
        },
      ],
    },
    {
      day: 13,
      date: "Saturday, June 13, 2026",
      activities: [
        {
          id: genId(),
          title: "Son Tra Peninsula Exploration",
          location: "Son Tra Mountain",
          startTime: "08:00",
          endTime: "12:00",
          category: "Sightseeing",
          priority: "High",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Linh Ung Pagoda Visit",
          location: "Son Tra Peninsula",
          startTime: "10:00",
          endTime: "11:30",
          category: "Sightseeing",
          priority: "Medium",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Seafood Dinner at Thoi Co",
          location: "Truong Sa Street, Ngu Hanh Son",
          startTime: "18:00",
          endTime: "20:00",
          category: "Dining",
          priority: "Medium",
          status: "Confirmed",
        overdue: false,
        },
      ],
    },
    {
      day: 14,
      date: "Sunday, June 14, 2026",
      activities: [
        {
          id: genId(),
          title: "Day Trip to Hoi An Ancient Town",
          location: "Hoi An (30km from Da Nang)",
          startTime: "08:00",
          endTime: "17:00",
          category: "Sightseeing",
          priority: "High",
          status: "Confirmed",
        overdue: false,
        },
        {
          id: genId(),
          title: "Lantern Making Workshop",
          location: "Old Town, Hoi An",
          startTime: "14:00",
          endTime: "15:30",
          category: "Sightseeing",
          priority: "Low",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Dinner at Cao Lau Restaurant",
          location: "Hoi An Ancient Town",
          startTime: "18:30",
          endTime: "20:00",
          category: "Dining",
          priority: "Medium",
          status: "Confirmed",
        overdue: false,
        },
      ],
    },
    {
      day: 15,
      date: "Monday, June 15, 2026",
      activities: [
        {
          id: genId(),
          title: "Transfer to Hue via Hai Van Pass",
          location: "Hai Van Pass",
          startTime: "07:00",
          endTime: "09:30",
          category: "Transport",
          priority: "High",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Visit Hue Imperial City",
          location: "Hue Citadel",
          startTime: "10:00",
          endTime: "13:00",
          category: "Sightseeing",
          priority: "High",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Lunch at Huong River Restaurant",
          location: "Le Loi Street, Hue",
          startTime: "13:00",
          endTime: "14:30",
          category: "Dining",
          priority: "Low",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Return to Da Nang",
          location: "Da Nang City",
          startTime: "15:00",
          endTime: "17:00",
          category: "Transport",
          priority: "Medium",
          status: "Planned",
        overdue: false,
        },
      ],
    },
    {
      day: 16,
      date: "Tuesday, June 16, 2026",
      activities: [
        {
          id: genId(),
          title: "Shopping at Han Market",
          location: "Han Market, Da Nang",
          startTime: "09:00",
          endTime: "11:00",
          category: "Sightseeing",
          priority: "Medium",
          status: "Planned",
        overdue: false,
        },
        {
          id: genId(),
          title: "Last Lunch at Madame Lan",
          location: "Bach Dang Street, Da Nang",
          startTime: "11:30",
          endTime: "13:00",
          category: "Dining",
          priority: "Medium",
          status: "Confirmed",
        overdue: false,
        },
        {
          id: genId(),
          title: "Departure from Da Nang",
          location: "Da Nang International Airport (DAD-SGN)",
          startTime: "15:00",
          endTime: "16:00",
          category: "Transport",
          priority: "High",
          status: "Planned",
        overdue: false,
        },
      ],
    },
  ];
}

export const useItineraryStore = create<ItineraryStore>()((set) => ({
      days: createInitialDays(),

      addActivity: (day, date, activity) =>
        set((state) => {
          const exists = state.days.some((d) => d.day === day);
          if (exists) {
            return {
              days: state.days.map((d) =>
                d.day === day
                  ? {
                      ...d,
                      activities: sortByStartTime([...d.activities, { id: genId(), ...activity }]),
                    }
                  : d,
              ),
            };
          }
          const newDay: ItineraryDay = {
            day,
            date,
            activities: [{ id: genId(), ...activity }],
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
                    ? { ...d, activities: sortByStartTime([...d.activities, merged]) }
                    : d,
                )
                .sort((a, b) => a.day - b.day),
            };
          }

          const newDay: ItineraryDay = { day, date: date ?? "", activities: [merged] };
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
