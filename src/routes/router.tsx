import { createBrowserRouter } from "react-router-dom";

import {
  ListGate,
  OverviewGate,
  RequireActiveTrip,
  TripEntryRedirect,
} from "@/components/routing/trip-routing";
import { AppShellLayout } from "@/layouts/AppShellLayout";
import { HeaderOnlyLayout } from "@/layouts/HeaderOnlyLayout";
import BudgetPage from "@/pages/budget/BudgetPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ItineraryPage from "@/pages/itinerary/ItineraryPage";
import PackingPage from "@/pages/packing/PackingPage";
import SettingsPage from "@/pages/settings/SettingsPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <TripEntryRedirect /> },

      {
        element: <HeaderOnlyLayout />,
        children: [
          { path: "overview", element: <OverviewGate /> },
          { path: "list", element: <ListGate /> },
        ],
      },

      {
        element: <AppShellLayout />,
        children: [
          {
            element: <RequireActiveTrip />,
            children: [
              { path: "dashboard", element: <DashboardPage /> },
              { path: "itinerary", element: <ItineraryPage /> },
              { path: "calendar", element: <CalendarPage /> },
              { path: "packing", element: <PackingPage /> },
              { path: "budget", element: <BudgetPage /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },

      { path: "*", element: <TripEntryRedirect /> },
    ],
  },
]);
