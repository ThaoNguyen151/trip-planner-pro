// src/layouts/HeaderOnlyLayout.tsx
import { Bell, Search, UserCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function HeaderOnlyLayout() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-slate-200/80 bg-white px-4 sm:px-6 gap-2">
        {/* title */}
        <h1 className="hidden sm:flex flex-1 text-xl sm:text-2xl font-semibold tracking-tight text-primary-foreground">
          Trip Planner Pro
        </h1>

        {/* search place */}
        <div className="relative flex-1 sm:flex-none sm:w-72">
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
            className="h-9 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-sky-500/30 focus-visible:ring-2"
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
            <Bell className="size-5 text-slate-600" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Account"
          >
            <UserCircle className="size-5 text-slate-600" />
          </Button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-accent-foreground p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
