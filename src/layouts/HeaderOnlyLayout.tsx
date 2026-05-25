// src/layouts/HeaderOnlyLayout.tsx
import { Bell, Search, UserCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function HeaderOnlyLayout() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-6">
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
          Trip Planner Pro
        </h1>

        <div className="relative hidden min-w-0 flex-1 max-w-[11rem] sm:block md:max-w-xs lg:w-72">
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
            className="h-9 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-ring/30 focus-visible:ring-2"
          />
        </div>

        {/* Icons */}
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
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
