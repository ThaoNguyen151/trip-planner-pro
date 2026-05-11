export type CalendarEventKind = 'booking' | 'stay' | 'activity' | 'reminder'

export type CalendarEventColor = 'sky' | 'violet' | 'amber' | 'emerald' | 'stone'

export type CalendarEvent = {
  id: string
  dateKey: string
  title: string
  kind: CalendarEventKind
  color: CalendarEventColor
  subtitle?: string
  time?: string
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
