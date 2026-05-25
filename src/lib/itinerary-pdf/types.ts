import type { ItineraryDay } from "@/types/itinerary";

export type ItineraryPdfPayload = {
  tripTitle: string;
  dateRange: string;
  days: ItineraryDay[];
  generatedAt?: Date;
};
