export const ROUTES = {
  overview: "/overview",
  trips: "/trips",
} as const;

export const TRIP_SECTIONS = [
  "dashboard",
  "itinerary",
  "calendar",
  "packing",
  "budget",
  "settings",
] as const;

export type TripSection = (typeof TRIP_SECTIONS)[number];

export function tripPath(tripId: string, section: TripSection = "dashboard") {
  return `/trips/${tripId}/${section}`;
}

export function isTripSection(value: string): value is TripSection {
  return (TRIP_SECTIONS as readonly string[]).includes(value);
}
