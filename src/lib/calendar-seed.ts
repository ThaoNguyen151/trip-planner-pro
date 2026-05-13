import type { CalendarEvent } from '@/types/calendar'

import { addDays, toDateKey } from './calendar-dates'

/** Sample events relative to `now` — used as initial store state before first persist write. */
export function seedCalendarEvents(now: Date = new Date()): CalendarEvent[] {
  const k = (offset: number) => toDateKey(addDays(now, offset))

  return [
    {
      id: 'm1',
      dateKey: k(-3),
      title: 'Flight — HAN → DAD',
      kind: 'booking',
      color: 'sky',
      subtitle: 'Vietnam Airlines VN154',
      time: '08:40',
    },
    {
      id: 'm2',
      dateKey: k(0),
      title: 'Check-in resort',
      kind: 'stay',
      color: 'emerald',
      subtitle: 'Ocean View Resort',
      time: '14:00',
    },
    {
      id: 'm3',
      dateKey: k(0),
      title: 'Sunset walk',
      kind: 'activity',
      color: 'amber',
      subtitle: 'My Khe beach',
      time: '17:30',
    },
    {
      id: 'm4',
      dateKey: k(2),
      title: 'Bà Nà Hills day trip',
      kind: 'activity',
      color: 'violet',
      subtitle: 'Cable car + Golden Bridge',
      time: '09:00',
    },
    {
      id: 'm5',
      dateKey: k(2),
      title: 'Renew travel insurance',
      kind: 'reminder',
      color: 'stone',
      subtitle: 'Policy #TP-2026-042',
      time: '10:00',
    },
    {
      id: 'm6',
      dateKey: k(5),
      title: 'Cooking class',
      kind: 'activity',
      color: 'amber',
      subtitle: 'Hội An old town',
      time: '15:30',
    },
    {
      id: 'm7',
      dateKey: k(8),
      title: 'Flight — DAD → HAN',
      kind: 'booking',
      color: 'sky',
      subtitle: 'Bamboo Airways QH102',
      time: '19:15',
    },
    {
      id: 'm8',
      dateKey: k(-18),
      title: 'Passport / visa check',
      kind: 'reminder',
      color: 'stone',
      subtitle: 'Before international leg',
      time: '09:00',
    },
    {
      id: 'm9',
      dateKey: k(22),
      title: 'Hotel checkout',
      kind: 'stay',
      color: 'emerald',
      subtitle: 'Late checkout requested',
      time: '12:00',
    },
    {
      id: 'm10',
      dateKey: k(35),
      title: 'Weekend city tour',
      kind: 'activity',
      color: 'violet',
      subtitle: 'Hop-on hop-off bus',
      time: '10:00',
    },
  ]
}
