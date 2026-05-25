import type { CalendarEvent } from "@/types/calendar";
import type { Expense } from "@/types/budget";
import type { ItineraryDay } from "@/types/itinerary";
import type { PackingCategory } from "@/types/package";

export type TripBudgetData = {
  totalBudget: number;
  expenses: Expense[];
};

export type TripItineraryData = {
  days: ItineraryDay[];
};

export type TripCalendarData = {
  events: CalendarEvent[];
};

export type TripPackingData = {
  categories: PackingCategory[];
};

export type TripFeatureData = {
  budget: TripBudgetData;
  itinerary: TripItineraryData;
  calendar: TripCalendarData;
  packing: TripPackingData;
};

export type TripFeaturesRegistry = Record<string, TripFeatureData>;
