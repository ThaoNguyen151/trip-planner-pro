import { useTripStore } from '@/stores'

/** Thin wrapper so feature code can depend on hooks instead of the store directly. */
export function useTripPlanner() {
  return useTripStore()
}
