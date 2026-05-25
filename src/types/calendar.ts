import type {
  ActivityCategory,
  ActivityPriority,
  ActivityStatus,
} from '@/types/itinerary'

export type CalendarEventKind = 'booking' | 'stay' | 'activity' | 'reminder'

export type CalendarEventColor = 'sky' | 'violet' | 'amber' | 'emerald' | 'stone'

export type CalendarEvent = {
  id: string
  dateKey: string
  title: string
  kind: CalendarEventKind
  color: CalendarEventColor
  category: ActivityCategory
  priority: ActivityPriority
  status: ActivityStatus
  location?: string
  overdue?: boolean
  subtitle?: string
  time?: string
}

/** Grid chips, timeline dots — driven by activity status. */
export function colorForActivityStatus(status: ActivityStatus): CalendarEventColor {
  switch (status) {
    case 'Planned':
      return 'stone'
    case 'Confirmed':
      return 'emerald'
    case 'Completed':
      return 'sky'
  }
}

export function colorForCalendarKind(kind: CalendarEventKind): CalendarEventColor {
  switch (kind) {
    case 'booking':
      return 'sky'
    case 'stay':
      return 'emerald'
    case 'activity':
      return 'violet'
    case 'reminder':
      return 'stone'
  }
}
