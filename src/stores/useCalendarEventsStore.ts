import { create } from 'zustand'

import { seedCalendarEvents } from '@/lib/calendar-seed'
import type { CalendarEvent, CalendarEventKind } from '@/types/calendar'
import {
  colorForActivityStatus,
  colorForCalendarKind,
} from '@/types/calendar'
import type {
  ActivityCategory,
  ActivityPriority,
  ActivityStatus,
} from '@/types/itinerary'

type NewEventInput = {
  dateKey: string
  title: string
  kind: CalendarEventKind
  category?: ActivityCategory
  priority?: ActivityPriority
  status?: ActivityStatus
  location?: string
  subtitle?: string
  time?: string
}

type CalendarEventsState = {
  events: CalendarEvent[]
  addEvent: (input: NewEventInput) => void
  updateEvent: (id: string, patch: Partial<Omit<CalendarEvent, 'id'>>) => void
  removeEvent: (id: string) => void
}

function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `cal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useCalendarEventsStore = create<CalendarEventsState>()((set) => ({
      events: seedCalendarEvents(),
      addEvent: (input) => {
        const title = input.title.trim()
        if (!title || !input.dateKey.trim()) return
        const status = input.status ?? 'Planned'
        const color = colorForActivityStatus(status)
        set((s) => ({
          events: [
            ...s.events,
            {
              id: newEventId(),
              dateKey: input.dateKey.trim(),
              title,
              kind: input.kind,
              category: input.category ?? 'Other',
              priority: input.priority ?? 'Medium',
              status,
              location: input.location?.trim() || input.subtitle?.trim() || undefined,
              color,
              subtitle: input.subtitle?.trim() || undefined,
              time: input.time?.trim() || undefined,
            },
          ],
        }))
      },
      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((e) => {
            if (e.id !== id) return e
            const next = { ...e, ...patch }
            if (patch.status !== undefined && patch.color === undefined) {
              next.color = colorForActivityStatus(patch.status)
            } else if (patch.kind !== undefined && patch.color === undefined && patch.status === undefined) {
              next.color = colorForCalendarKind(patch.kind)
            }
            return next
          }),
        })),
      removeEvent: (id) =>
        set((s) => ({ events: s.events.filter((x) => x.id !== id) })),
}))
