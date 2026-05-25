import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { TripFeatureData, TripFeaturesRegistry } from "@/types/trip-data";

function readRegistry(): TripFeaturesRegistry {
  const raw = localStorage.getItem(STORAGE_KEYS.TRIP_FEATURES);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as TripFeaturesRegistry;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRegistry(registry: TripFeaturesRegistry): void {
  localStorage.setItem(STORAGE_KEYS.TRIP_FEATURES, JSON.stringify(registry));
}

export function getTripFeatureData(tripId: string): TripFeatureData | undefined {
  return readRegistry()[tripId];
}

export function setTripFeatureData(tripId: string, data: TripFeatureData): void {
  const registry = readRegistry();
  registry[tripId] = data;
  writeRegistry(registry);
}

export function removeTripFeatureData(tripId: string): void {
  const registry = readRegistry();
  delete registry[tripId];
  writeRegistry(registry);
}

export function hasTripFeatureData(tripId: string): boolean {
  return tripId in readRegistry();
}

export function isRegistryEmpty(): boolean {
  return Object.keys(readRegistry()).length === 0;
}
