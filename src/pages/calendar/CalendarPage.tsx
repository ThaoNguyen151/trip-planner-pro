import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { addDays, monthLabel, startOfMonth, toDateKey } from '@/lib/calendar-dates'
import { cn } from '@/lib/utils'
import { useCalendarEventsStore } from '@/stores/useCalendarEventsStore'
import { useTripStore } from '@/stores/useTripStore'
import type { CalendarEvent, CalendarEventColor, CalendarEventKind } from '@/types/calendar'

const WEEKDAYS_SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const WEEKDAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

function MonthNavGroup({
  compact,
  onPrev,
  onToday,
  onNext,
}: {
  compact?: boolean
  onPrev: () => void
  onToday: () => void
  onNext: () => void
}) {
  const iconBtn = compact ? 'size-8' : 'size-9'
  const iconSize = compact ? 'size-4' : 'size-5'
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-0.5 rounded-lg',
        compact && 'mx-auto w-full max-w-xs justify-center sm:max-w-sm',
      )}
      role="group"
      aria-label="Month navigation"
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
          iconBtn,
        )}
        aria-label="Previous month"
        onClick={onPrev}
      >
        <ChevronLeft className={iconSize} aria-hidden />
      </button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          'rounded-md border-slate-200/90 bg-white font-medium text-slate-700 shadow-sm hover:bg-slate-50',
          compact ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
        )}
        onClick={onToday}
      >
        Today
      </Button>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
          iconBtn,
        )}
        aria-label="Next month"
        onClick={onNext}
      >
        <ChevronRight className={iconSize} aria-hidden />
      </button>
    </div>
  )
}

function timeSortKey(t?: string): number {
  if (!t?.trim()) return 24 * 60 + 1
  const m = t.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!m) return 24 * 60 + 2
  return Number(m[1]) * 60 + Number(m[2])
}

function formatTimeLabel(t?: string): string {
  if (!t?.trim()) return '—'
  const m = t.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!m) return t.trim()
  let h = Number(m[1])
  const min = Number(m[2])
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`
}

/** e.g. "Wednesday, June 10" from yyyy-mm-dd (local). */
function formatLongWeekdayDate(dateKey: string): string {
  const parts = dateKey.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateKey
  const [y, mo, d] = parts
  const dt = new Date(y, mo - 1, d)
  if (Number.isNaN(dt.getTime())) return dateKey
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function kindTagLabel(kind: CalendarEventKind): string {
  switch (kind) {
    case 'booking':
      return 'FLIGHT'
    case 'stay':
      return 'STAY'
    case 'activity':
      return 'ACTIVITY'
    case 'reminder':
      return 'REMINDER'
  }
}

function dotClassForColor(color: CalendarEventColor): string {
  switch (color) {
    case 'sky':
      return 'bg-sky-600'
    case 'violet':
      return 'bg-violet-600'
    case 'amber':
      return 'bg-amber-600'
    case 'emerald':
      return 'bg-emerald-600'
    case 'stone':
      return 'bg-slate-500'
  }
}

function ScheduledActivitiesPanel({
  dateKey,
  events,
  onClose,
  variant,
}: {
  dateKey: string
  events: CalendarEvent[]
  onClose: () => void
  variant: 'aside' | 'sheet'
}) {
  const longDate = formatLongWeekdayDate(dateKey)

  if (variant === 'sheet') {
    return (
      <div
        className="flex max-h-[min(85dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-sky-100/95 shadow-2xl ring-1 ring-sky-200/70"
        role="document"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-sky-200/50 px-4 py-3">
          <div className="min-w-0 pr-2">
            <h2 id="scheduled-activities-title" className="text-lg font-bold tracking-tight text-slate-900">
              Activities
            </h2>
            <p className="mt-0.5 text-sm font-medium text-slate-600">{longDate}</p>
          </div>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {events.length === 0 ? (
            <p className="rounded-xl bg-white/80 py-8 text-center text-sm text-slate-600 ring-1 ring-slate-200/60">
              No activities for this day.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {events.map((e) => (
                <li key={e.id}>
                  <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200/60">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 flex-1 text-base font-bold leading-snug text-slate-900">
                        {e.title}
                      </p>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-sky-700">
                        {formatTimeLabel(e.time)}
                      </p>
                    </div>
                    {e.subtitle ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{e.subtitle}</p>
                    ) : null}
                    <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                      {longDate}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-h-[min(85vh,720px)] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 id="scheduled-activities-title" className="text-base font-semibold text-slate-900">
          Scheduled activities
        </h2>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <p className="shrink-0 border-b border-slate-50 px-4 py-2 text-xs text-slate-500">{dateKey}</p>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No activities for this day.</p>
        ) : (
          <ul className="space-y-0">
            {events.map((e) => (
              <li key={e.id} className="relative border-l-2 border-slate-200 pb-4 pl-5 last:pb-0">
                <span
                  className={cn(
                    'absolute left-[-5px] top-1.5 size-2 rounded-full',
                    dotClassForColor(e.color),
                  )}
                  aria-hidden
                />
                <div className="rounded-lg border border-slate-100 bg-sky-50/50 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-600">
                        {formatTimeLabel(e.time)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                      {kindTagLabel(e.kind)}
                    </span>
                  </div>
                  {e.subtitle ? (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.subtitle}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [month, setMonth] = useState(() => new Date())
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [compactGrid, setCompactGrid] = useState(false)

  const events = useCalendarEventsStore((s) => s.events)
  const trips = useTripStore((s) => s.trips)

  const tripSubtitle = useMemo(() => {
    if (trips.length === 0) return 'Vietnam Adventure Tour'
    const sorted = [...trips].sort((a, b) => b.createdAt - a.createdAt)
    return sorted[0].title
  }, [trips])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const arr = map.get(e.dateKey) ?? []
      arr.push(e)
      map.set(e.dateKey, arr)
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.title.localeCompare(b.title))
    }
    return map
  }, [events])

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateKey) return []
    const list = events.filter((e) => e.dateKey === selectedDateKey)
    return [...list].sort((a, b) => {
      const ta = timeSortKey(a.time)
      const tb = timeSortKey(b.time)
      if (ta !== tb) return ta - tb
      return a.title.localeCompare(b.title)
    })
  }, [selectedDateKey, events])

  const daysGrid = useMemo(() => {
    const first = startOfMonth(month)
    const weekday = first.getDay()
    const gridStart = addDays(first, -weekday)
    return Array.from({ length: compactGrid ? 35 : 42 }, (_, i) => addDays(gridStart, i))
  }, [month, compactGrid])

  useEffect(() => {
    if (!selectedDateKey) return
    const visible = daysGrid.some((d) => toDateKey(d) === selectedDateKey)
    if (!visible) queueMicrotask(() => setSelectedDateKey(null))
  }, [daysGrid, selectedDateKey])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const apply = () => setCompactGrid(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const goPrevMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  const goNextMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  const goTodayMonth = () => setMonth(() => new Date())

  const maxEventsInCell = compactGrid ? 2 : 3

  function closeDayPanel() {
    setSelectedDateKey(null)
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-3 px-2 sm:gap-4 sm:px-4 md:px-6">
      <header className="pt-1">
        <div className="flex flex-col items-stretch gap-3 md:hidden">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] sm:text-2xl">
              {monthLabel(month)}
            </h1>
            <p className="mt-1 line-clamp-2 px-1 text-xs leading-snug text-slate-500 sm:text-sm">
              {tripSubtitle}
            </p>
          </div>
          <MonthNavGroup compact onPrev={goPrevMonth} onToday={goTodayMonth} onNext={goNextMonth} />
        </div>

        <div className="relative mb-4 hidden items-center justify-end md:flex">
          <div className="pointer-events-none absolute inset-x-0 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl">
              {monthLabel(month)}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">{tripSubtitle}</p>
          </div>
          <MonthNavGroup onPrev={goPrevMonth} onToday={goTodayMonth} onNext={goNextMonth} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
        <article className="min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white sm:rounded-xl">
          <div className="grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50 text-center text-[9px] font-semibold uppercase tracking-wide text-black sm:text-[11px]">
            {WEEKDAYS_SUN_FIRST.map((d, i) => (
              <div key={d} className="bg-slate-200 py-2 md:py-3">
                <span className="md:hidden">{WEEKDAY_SHORT[i]}</span>
                <span className="hidden md:inline">{d}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
            {daysGrid.map((d) => {
              const inMonth = d.getMonth() === month.getMonth()
              const key = toDateKey(d)
              const dayEvents = eventsByDay.get(key) ?? []
              const max = maxEventsInCell
              const isSelected = selectedDateKey === key
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${key}, ${dayEvents.length} activities`}
                  className={cn(
                    'cursor-pointer p-1 outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:p-1.5',
                    compactGrid ? 'min-h-[68px]' : 'min-h-[82px]',
                    inMonth ? 'bg-white' : 'bg-slate-100',
                    isSelected && 'shadow-[inset_0_0_0_2px] shadow-sky-400',
                  )}
                  onClick={() => setSelectedDateKey(key)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSelectedDateKey(key)
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1">
                    <div
                      className={cn(
                        'font-semibold tabular-nums',
                        compactGrid ? 'text-[11px]' : 'text-xs',
                        inMonth ? 'text-slate-900' : 'text-slate-400',
                      )}
                    >
                      {d.getDate()}
                    </div>
                    {dayEvents.length > 0 ? (
                      <div className="hidden text-[10px] font-medium text-slate-500 sm:block">
                        {dayEvents.length} item{dayEvents.length > 1 ? 's' : ''}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      'pointer-events-none space-y-0.5',
                      compactGrid ? 'mt-1' : 'mt-1.5',
                    )}
                  >
                    {dayEvents.slice(0, max).map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          'w-full truncate rounded-md px-1 py-px text-left font-semibold sm:px-2 sm:py-0.5',
                          compactGrid ? 'text-[9px]' : 'text-[10px]',
                          e.color === 'sky' && 'bg-sky-50 text-sky-900 ring-1 ring-sky-100',
                          e.color === 'violet' &&
                            'bg-violet-50 text-violet-900 ring-1 ring-violet-100',
                          e.color === 'amber' &&
                            'bg-amber-50 text-amber-950 ring-1 ring-amber-100',
                          e.color === 'emerald' &&
                            'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100',
                          e.color === 'stone' &&
                            'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80',
                        )}
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > max ? (
                      <div className="text-[10px] font-medium text-slate-500">
                        +{dayEvents.length - max} more
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        {selectedDateKey ? (
          <aside className="hidden w-full max-w-md shrink-0 md:block md:w-80 lg:w-96">
            <ScheduledActivitiesPanel
              variant="aside"
              dateKey={selectedDateKey}
              events={selectedDayEvents}
              onClose={closeDayPanel}
            />
          </aside>
        ) : null}
      </div>

      {selectedDateKey ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/45 p-4 md:hidden"
          role="presentation"
          onClick={closeDayPanel}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheduled-activities-title"
            className="my-auto w-full max-w-md"
            onClick={(ev) => ev.stopPropagation()}
          >
            <ScheduledActivitiesPanel
              variant="sheet"
              dateKey={selectedDateKey}
              events={selectedDayEvents}
              onClose={closeDayPanel}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
