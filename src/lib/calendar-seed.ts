import type { CalendarEvent } from '@/types/calendar'
import { colorForActivityStatus } from '@/types/calendar'

import { addDays, toDateKey } from './calendar-dates'

/** Sample events relative to `now` — used as initial store state before first persist write. */
export function seedCalendarEvents(now: Date = new Date()): CalendarEvent[] {
  const k = (offset: number) => toDateKey(addDays(now, offset))

  const items: Omit<CalendarEvent, 'id' | 'dateKey'>[] = [
    {
      title: 'Flight — HAN → DAD',
      kind: 'booking',
      category: 'Transport',
      priority: 'High',
      status: 'Confirmed',
      color: colorForActivityStatus('Confirmed'),
      location: 'Noi Bai International Airport',
      time: '08:40',
    },
    {
      title: 'Check-in resort',
      kind: 'stay',
      category: 'Lodging',
      priority: 'Medium',
      status: 'Confirmed',
      color: colorForActivityStatus('Confirmed'),
      location: 'Ocean View Resort',
      time: '14:00',
    },
    {
      title: 'Sunset walk',
      kind: 'activity',
      category: 'Sightseeing',
      priority: 'Low',
      status: 'Planned',
      color: colorForActivityStatus('Planned'),
      location: 'My Khe beach',
      time: '17:30',
    },
    {
      title: 'Bà Nà Hills day trip',
      kind: 'activity',
      category: 'Sightseeing',
      priority: 'Medium',
      status: 'Planned',
      color: colorForActivityStatus('Planned'),
      location: 'Cable car + Golden Bridge',
      time: '09:00',
    },
    {
      title: 'Renew travel insurance',
      kind: 'reminder',
      category: 'Other',
      priority: 'High',
      status: 'Planned',
      color: colorForActivityStatus('Planned'),
      location: 'Policy #TP-2026-042',
      time: '10:00',
    },
    {
      title: 'Cooking class',
      kind: 'activity',
      category: 'Dining',
      priority: 'Low',
      status: 'Completed',
      color: colorForActivityStatus('Completed'),
      location: 'Hội An old town',
      time: '15:30',
    },
    {
      title: 'Flight — DAD → HAN',
      kind: 'booking',
      category: 'Transport',
      priority: 'High',
      status: 'Confirmed',
      color: colorForActivityStatus('Confirmed'),
      location: 'Da Nang International Airport',
      time: '19:15',
    },
    {
      title: 'Passport / visa check',
      kind: 'reminder',
      category: 'Other',
      priority: 'High',
      status: 'Completed',
      color: colorForActivityStatus('Completed'),
      location: 'Before international leg',
      time: '09:00',
    },
    {
      title: 'Hotel checkout',
      kind: 'stay',
      category: 'Lodging',
      priority: 'Medium',
      status: 'Planned',
      color: colorForActivityStatus('Planned'),
      location: 'Late checkout requested',
      time: '12:00',
    },
    {
      title: 'Weekend city tour',
      kind: 'activity',
      category: 'Sightseeing',
      priority: 'Low',
      status: 'Planned',
      color: colorForActivityStatus('Planned'),
      location: 'Hop-on hop-off bus',
      time: '10:00',
    },
  ]

  const offsets = [-3, 0, 0, 2, 2, 5, 8, -18, 22, 35]

  return items.map((item, i) => ({
    id: `m${i + 1}`,
    dateKey: k(offsets[i]),
    ...item,
  }))
}
