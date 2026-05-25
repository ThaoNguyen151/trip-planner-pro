# Trip Planner Pro

A client-side trip planning app built with React, TypeScript, and Vite. Plan multiple trips in one place with itinerary, budget, calendar, packing, and dashboard views. All data is stored in the browser (`localStorage`); there is no backend API.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** for navigation
- **Zustand** for in-memory feature state
- **Zod** + **React Hook Form** for forms
- **Tailwind CSS 4** + **shadcn/ui** for UI
- **jsPDF** + **jspdf-autotable** for itinerary PDF export
- **date-fns** for dates

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm run start` | Serve `dist` via `server/static.mjs` |
| `npm run lint` | Run ESLint |

Open the dev server URL (typically `http://localhost:5173`).

## Feature list

### Trips hub (`/overview`, `/trips`)

- **Overview** (`/overview`) — shown when there are no trips; create the first trip (name, budget, dates).
- **Trip list** (`/trips`) — grid of trip cards with date range, cover image (stock picker), and planning progress %.
- **Create trip** — modal form with VND-style budget input (thousand separators: `10.000.000`).
- **Open trip** — sets active trip and navigates to dashboard.
- **Reset trip data** — clears itinerary, expenses, calendar-derived data, and packing checklists for one trip (trip metadata stays on the list); confirmation dialog included.

### Per-trip app shell (`/trips/:tripId/...`)

Shared sidebar layout with collapsible navigation and **Back to trips**.

| Section | Route | Highlights |
|---------|--------|------------|
| **Dashboard** | `.../dashboard` | Progress rings (itinerary, packing, budget), today’s itinerary preview, budget summary, task alerts (overdue / unpaid). **Export PDF** downloads full itinerary (all days/activities). |
| **Itinerary** | `.../itinerary` | Day timeline, add/edit/delete activities, filters (date, category, status, priority), overdue flag for planned past activities. **Current location** button on location field (browser geolocation + address lookup). |
| **Calendar** | `.../calendar` | Month grid; events are **derived from itinerary** (not a separate manual calendar editor). Day panel with category, priority, status tags and status-based colors. |
| **Packing** | `.../packing` | Categories with icons, pack/unpack items, filters, progress. |
| **Budget** | `.../budget` | Total budget, expenses (estimated/actual), paid/unpaid, charts, category filters, add/edit/delete. |
| **Settings** | `.../settings` | Light / dark theme toggle. |

### Cross-cutting

- **Multi-trip isolation** — each trip has its own feature blob; switching trips saves the previous trip and loads the new one.
- **Theme** — purple-forward light mode (`:root` in `src/index.css`) and dark mode (`.dark` class on `<html>`).
- **Legacy migration** — one-time import from old global `localStorage` keys into the first trip when the feature registry is empty.

## State structure

The app uses two layers: **trip metadata** (list + active trip) and **per-trip feature data** (planning content).

```
┌─────────────────────────────────────────────────────────────┐
│  useTripStore (persisted: trip-planner-pro/trips)           │
│  • trips: Trip[]                                            │
│  • activeTripId: string | null                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │  trip-scope-bridge (init in main.tsx)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  In-memory Zustand (UI while a trip is active)              │
│  • useBudgetStore    — totalBudget, expenses, filters       │
│  • useItineraryStore — days[] with activities               │
│  • usePackingStore   — categories[], filters                │
│  (Calendar UI reads itinerary via useItineraryCalendarEvents)│
└──────────────────────────┬──────────────────────────────────┘
                           │  debounced save (~250ms) on change
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Trip features registry (persisted: trip-planner-pro/       │
│  trip-features) — Record<tripId, TripFeatureData>           │
└─────────────────────────────────────────────────────────────┘
```

### `Trip` (metadata)

```ts
{
  id: string
  title: string
  createdAt: number
  budget: number        // trip-level budget cap (also seeds budget.totalBudget)
  startDate: string     // ISO yyyy-mm-dd
  endDate: string
  image?: string        // cover URL for list card
}
```

### `TripFeatureData` (per `tripId`)

```ts
{
  budget: {
    totalBudget: number
    expenses: Expense[]   // category, costs, paymentStatus, etc.
  }
  itinerary: {
    days: ItineraryDay[]  // day, date label, activities[]
  }
  calendar: {
    events: CalendarEvent[]  // snapshot derived from itinerary on save
  }
  packing: {
    categories: PackingCategory[]  // items with packed flag, iconName for persist
  }
}
```

### Runtime flow

1. **Bootstrap** — `initTripScopeBridge()` subscribes to `activeTripId` and feature store changes.
2. **Switch trip** — persist outgoing trip → load `TripFeatureData` for incoming trip into Zustand.
3. **Edit feature pages** — components keep using existing stores; bridge auto-persists to the registry for `activeTripId`.
4. **New trip** — `createTripFromForm()` adds metadata + `initializeTripFeatureData()` with empty defaults (default packing templates, no itinerary/expenses).
5. **Reset trip** — `resetTripFeatureData(tripId)` replaces registry entry with empty defaults; reloads stores if that trip is active.

Key modules: `src/lib/trip-data-registry.ts`, `src/lib/trip-scope-bridge.ts`, `src/lib/trip-feature-defaults.ts`.

## Routing overview

| Path | Behavior |
|------|----------|
| `/` | Redirect to `/overview` or `/trips` depending on trip count |
| `/overview` | Empty state (no trips) |
| `/trips` | Trip list; clears `activeTripId` |
| `/trips/:tripId/dashboard` … | Feature sections (legacy `/dashboard` paths redirect) |
| `/list` | Redirects to `/trips` |

## Project layout (high level)

```
src/
  components/     # UI by feature (itinerary, budget, calendar, overview, …)
  hooks/          # useActiveTripMeta, useItineraryFilters, useItineraryCalendarEvents, …
  layouts/        # AppShellLayout, HeaderOnlyLayout
  lib/            # trip bridge, registry, PDF export, geolocation, money input
  pages/          # Route-level pages
  routes/         # React Router config
  stores/         # Zustand stores
  types/          # Trip, itinerary, budget, calendar, packing types
public/fonts/     # Noto Sans TTF for Vietnamese PDF text
docs/             # Additional notes (e.g. TRIP_ADDITIONS.md)
```

## Known limitations

- **Browser-only storage** — Data lives in `localStorage`. Clearing site data, another browser, or another device loses or diverges from your trips. No sync, backup, or multi-user support.
- **No backend** — No authentication, sharing, or server-side validation.
- **Calendar is itinerary-driven** — The calendar view reflects itinerary activities; you cannot maintain a separate calendar event list independent of itinerary (stored calendar events are a derived snapshot on save).
- **PDF export** — Generated on the Dashboard only. Requires loading Noto Sans fonts from `/public/fonts`. First export is async; very long itineraries may produce large PDFs. Geolocation/address quality depends on the browser and network (Nominatim).
- **Geolocation** — Itinerary “current location” needs HTTPS (or localhost) and user permission; address reverse-geocoding can fail (falls back to coordinates).
- **Trip list progress %** — Based primarily on packing items packed vs total; if there are no packing items, a simple heuristic from itinerary activity count is used. After reset, progress is 0% only when default packing items are all unchecked.
- **“Upcoming / Past” toggle on `/trips`** — UI present; filtering by trip dates may not be fully wired.
- **Budget vs trip budget** — Trip card stores a budget number; feature `totalBudget` is initialized from it but can diverge after edits in the Budget page.
- **Single active session** — One `activeTripId` at a time; opening a trip from the list while editing another tab is not a supported multi-tab scenario.
- **Legacy stores** — `useCalendarEventsStore` still exists for seeds/compat but the calendar page uses itinerary-derived events; avoid assuming calendar store is the source of truth.


## License

Private / educational project — see repository for license terms if applicable.
