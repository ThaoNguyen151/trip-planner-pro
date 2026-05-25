import { create } from 'zustand'

import { seedCalendarEvents } from '@/lib/calendar-seed'
import type { CalendarEvent, CalendarEventKind } from '@/types/calendar'
import { colorForCalendarKind } from '@/types/calendar'

type NewEventInput = {
  dateKey: string
  title: string
  kind: CalendarEventKind
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
        const color = colorForCalendarKind(input.kind)
        set((s) => ({
          events: [
            ...s.events,
            {
              id: newEventId(),
              dateKey: input.dateKey.trim(),
              title,
              kind: input.kind,
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
            if (patch.kind !== undefined && patch.color === undefined) {
              next.color = colorForCalendarKind(patch.kind)
            }
            return next
          }),
        })),
      removeEvent: (id) =>
        set((s) => ({ events: s.events.filter((x) => x.id !== id) })),
}))
