import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Calendar,
  LayoutDashboard,
  Map,
  Package,
  Search,
  Settings,
  UserCircle,
  Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const nav = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.itinerary, label: 'Itinerary', icon: Map },
  { to: ROUTES.calendar, label: 'Calendar', icon: Calendar },
  { to: ROUTES.packing, label: 'Packing', icon: Package },
  { to: ROUTES.budget, label: 'Budget', icon: Wallet },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
] as const

function navLinkClass(isActive: boolean, variant: 'sidebar' | 'dock') {
  if (variant === 'dock') {
    return cn(
      'flex min-w-0 flex-1 items-center justify-center rounded-lg py-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50',
      isActive ? 'text-sky-700' : 'text-slate-500 active:text-slate-700',
    )
  }
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-sky-50 text-sky-700 shadow-sm'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  )
}

export function AppShellLayout() {
  return (
    <div className="flex h-svh min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-foreground md:flex-row">
      <aside
        className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex"
        aria-label="Main navigation"
      >
        <div className="px-5 py-5">
          <NavLink
            to={ROUTES.dashboard}
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Trip Planner Pro
          </NavLink>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => navLinkClass(isActive, 'sidebar')}>
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 sm:px-6 md:justify-end">
          <NavLink
            to={ROUTES.dashboard}
            className="min-w-0 truncate text-sm font-semibold tracking-tight text-slate-900 md:hidden"
          >
            Trip Planner Pro
          </NavLink>
          <div className="flex min-w-0 max-w-full flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-initial">
            <div className="relative min-w-0 max-w-[11rem] shrink sm:max-w-none sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                name="q"
                readOnly
                placeholder="Search itineraries..."
                aria-label="Search itineraries"
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-left text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-sky-500/30 focus-visible:ring-2"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5 text-slate-600" />
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Account">
                <UserCircle className="size-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50/90 p-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-4 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch justify-around gap-0.5 border-t border-slate-200/90 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden"
        aria-label="Main navigation"
      >
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            title={label}
            className={({ isActive }) => navLinkClass(isActive, 'dock')}
          >
            <Icon className="size-6 shrink-0" aria-hidden />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
