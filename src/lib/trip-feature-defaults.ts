import { STORAGE_KEYS } from "@/constants/storage-keys";
import { seedCalendarEvents } from "@/lib/calendar-seed";
import type { Trip } from "@/types/trip";
import type { TripFeatureData } from "@/types/trip-data";
import type { PackingCategory } from "@/types/package";
import { Shirt, SprayCan } from "lucide-react";

export function createDefaultPackingCategories(): PackingCategory[] {
  return [
    {
      id: "documents",
      name: "Documents",
      icon: Shirt,
      color: "#6366f1",
      items: [
        {
          id: "d1",
          name: "Passport / ID card",
          quantity: 1,
          unit: "",
          required: true,
          packed: false,
        },
        {
          id: "d2",
          name: "Flight E-Tickets",
          quantity: 2,
          unit: "",
          required: true,
          packed: false,
        },
      ],
    },
    {
      id: "clothes",
      name: "Clothes",
      icon: Shirt,
      color: "#10b981",
      items: [
        {
          id: "c1",
          name: "Linen Shirts (x3)",
          quantity: 3,
          unit: "pcs",
          required: true,
          packed: false,
        },
      ],
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: SprayCan,
      color: "#f59e0b",
      items: [
        {
          id: "e1",
          name: "Universal Adapter",
          quantity: 1,
          unit: "",
          required: true,
          packed: false,
        },
      ],
    },
    {
      id: "others",
      name: "Others",
      icon: SprayCan,
      color: "#64748b",
      items: [],
    },
  ];
}

export function createEmptyTripFeatureData(trip: Trip): TripFeatureData {
  return {
    budget: {
      totalBudget: trip.budget > 0 ? trip.budget : 0,
      expenses: [],
    },
    itinerary: { days: [] },
    calendar: { events: [] },
    packing: { categories: createDefaultPackingCategories() },
  };
}

export function createDemoTripFeatureData(trip: Trip): TripFeatureData {
  return {
    budget: {
      totalBudget: trip.budget > 0 ? trip.budget : 12000,
      expenses: [
        {
          id: "1",
          category: "Shopping",
          name: "Buy Gucci bag",
          estimatedCost: 1500,
          actualCost: 1200,
          paymentStatus: "Paid",
        },
      ],
    },
    itinerary: { days: [] },
    calendar: { events: seedCalendarEvents() },
    packing: { categories: createDefaultPackingCategories() },
  };
}

export function computeTripProgress(data: TripFeatureData | undefined): number {
  if (!data) return 0;

  const packingItems = data.packing.categories.flatMap((c) => c.items);
  if (packingItems.length > 0) {
    const packed = packingItems.filter((i) => i.packed).length;
    return Math.round((packed / packingItems.length) * 100);
  }

  const activityCount = data.itinerary.days.reduce(
    (sum, day) => sum + day.activities.length,
    0,
  );
  if (activityCount > 0) return Math.min(100, activityCount * 10);

  return 0;
}

function readPersistedSlice<T>(key: string, pick: (state: unknown) => T | null): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { state?: unknown };
    return pick(parsed.state);
  } catch {
    return null;
  }
}

/** One-time import from pre–multi-trip localStorage keys. */
export function readLegacyGlobalFeatureData(): TripFeatureData | null {
  const totalBudget = readPersistedSlice("budget-storage", (s) => {
    if (!s || typeof s !== "object") return null;
    const budget = (s as { totalBudget?: number }).totalBudget;
    return typeof budget === "number" ? budget : null;
  });

  const expenses = readPersistedSlice("budget-storage", (s) => {
    if (!s || typeof s !== "object") return null;
    const list = (s as { expenses?: unknown }).expenses;
    return Array.isArray(list) ? (list as TripFeatureData["budget"]["expenses"]) : null;
  });

  const days = readPersistedSlice("itinerary-storage", (s) => {
    if (!s || typeof s !== "object") return null;
    const list = (s as { days?: unknown }).days;
    return Array.isArray(list) ? (list as TripFeatureData["itinerary"]["days"]) : null;
  });

  const events = readPersistedSlice(STORAGE_KEYS.CALENDAR_EVENTS, (s) => {
    if (!s || typeof s !== "object") return null;
    const list = (s as { events?: unknown }).events;
    return Array.isArray(list) ? (list as TripFeatureData["calendar"]["events"]) : null;
  });

  if (
    totalBudget === null &&
    expenses === null &&
    days === null &&
    events === null
  ) {
    return null;
  }

  return {
    budget: {
      totalBudget: totalBudget ?? 12000,
      expenses: expenses ?? [],
    },
    itinerary: { days: days ?? [] },
    calendar: { events: events ?? seedCalendarEvents() },
    packing: { categories: createDefaultPackingCategories() },
  };
}
