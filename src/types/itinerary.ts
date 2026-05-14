export const ACTIVITY_CATEGORIES = ["Transport", "Lodging", "Dining", "Sightseeing"] as const
export const ACTIVITY_PRIORITIES = ["High", "Medium", "Low"] as const
export const ACTIVITY_STATUSES = ["Planned", "Confirmed", "Completed"] as const

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number]
export type ActivityPriority = (typeof ACTIVITY_PRIORITIES)[number]
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number]

export interface ItineraryActivity {
  id: string
  title: string
  location: string
  startTime: string
  endTime: string
  category: ActivityCategory
  priority: ActivityPriority
  status: ActivityStatus
  overdue?: boolean
}

export interface ItineraryDay {
  day: number
  date: string
  collapsed: boolean
  activities: ItineraryActivity[]
}

export interface ItineraryStore {
  days: ItineraryDay[]
  addActivity: (day: number, activity: Omit<ItineraryActivity, "id">) => void
  updateActivity: (day: number, activityId: string, updates: Partial<ItineraryActivity>) => void
  deleteActivity: (day: number, activityId: string) => void
  toggleCollapse: (day: number) => void
}
