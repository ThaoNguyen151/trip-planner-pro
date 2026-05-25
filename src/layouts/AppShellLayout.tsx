import { useState } from "react";

import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import {
  Bell,
  Calendar,
  ArrowLeft,
  LayoutDashboard,
  Map,
  Package,
  Search,
  Settings,
  UserCircle,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ROUTES, tripPath, type TripSection } from "@/constants/routes";

import { cn } from "@/lib/utils";

import { useTripStore } from "@/stores/useTripStore";

const nav: {
  section: TripSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { section: "dashboard", label: "Dashboard", icon: LayoutDashboard },

  { section: "itinerary", label: "Itinerary", icon: Map },

  { section: "calendar", label: "Calendar", icon: Calendar },

  { section: "packing", label: "Packing", icon: Package },

  { section: "budget", label: "Budget", icon: Wallet },

  { section: "settings", label: "Settings", icon: Settings },
];

function navLinkClass(
  isActive: boolean,

  variant: "sidebar" | "dock",

  sidebarCollapsed?: boolean,
) {
  if (variant === "dock") {
    return cn(
      "flex min-w-0 flex-1 items-center justify-center rounded-lg py-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
      isActive
        ? "text-primary"
        : "text-muted-foreground active:text-foreground",
    );
  }

  return cn(
    "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",

    sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",

    isActive
      ? "bg-primary/10 text-primary shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function AppShellLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const { tripId = "" } = useParams<{ tripId: string }>();

  const handleBackToTrips = () => {
    useTripStore.getState().setActiveTripId(null);

    navigate(ROUTES.trips);
  };

  return (
    <div className="flex h-svh min-h-0 w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      <aside
        className={cn(
          "hidden shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-200 ease-in-out md:flex",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "flex items-center py-5",

            sidebarCollapsed
              ? "justify-center px-2"
              : "justify-between gap-2 px-5",
          )}
        >
          {!sidebarCollapsed && tripId ? (
            <NavLink
              to={tripPath(tripId, "dashboard")}
              className="min-w-0 truncate text-lg font-semibold tracking-tight text-slate-900"
            >
              Trip Planner Pro
            </NavLink>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            aria-expanded={!sidebarCollapsed}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <img
              src="/paper-plane-dark-right.png"
              className="size-5"
              aria-hidden
            />
          </Button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map(({ section, label, icon: Icon }) => (
            <NavLink
              key={section}
              to={section}
              end={section === "dashboard"}
              aria-label={label}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) =>
                navLinkClass(isActive, "sidebar", sidebarCollapsed)
              }
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />

              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200/80 p-3">
          <button
            type="button"
            onClick={handleBackToTrips}
            aria-label="Back to trips"
            title={sidebarCollapsed ? "Back to trips" : undefined}
            className={cn(
              "flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900",

              sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3",
            )}
          >
            <ArrowLeft className="size-[18px] shrink-0" aria-hidden />

            {!sidebarCollapsed && (
              <span className="truncate">Back to trips</span>
            )}
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6 md:justify-end">
          {tripId ? (
            <NavLink
              to={tripPath(tripId, "dashboard")}
              className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground md:hidden"
            >
              Trip Planner Pro
            </NavLink>
          ) : (
            <span className="md:hidden" />
          )}

          <div className="flex min-w-0 max-w-full flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-initial">
            <div className="relative min-w-0 max-w-[11rem] shrink sm:max-w-none sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />

              <input
                type="search"
                name="q"
                readOnly
                placeholder="Search..."
                aria-label="Search itineraries"
                className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-left text-sm text-foreground placeholder:text-muted-foreground outline-none ring-ring/30 focus-visible:ring-2"
              />
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notifications"
              >
                <Bell className="size-5 text-muted-foreground" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Account"
              >
                <UserCircle className="size-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-background p-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-4 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch justify-around gap-0.5 border-t border-border bg-card pb-[env(safe-area-inset-bottom,0px)] md:hidden"
        aria-label="Main navigation"
      >
        {nav.map(({ section, label, icon: Icon }) => (
          <NavLink
            key={section}
            to={section}
            end={section === "dashboard"}
            aria-label={label}
            title={label}
            className={({ isActive }) => navLinkClass(isActive, "dock")}
          >
            <Icon className="size-6 shrink-0" aria-hidden />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
