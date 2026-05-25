import { createBrowserRouter, Navigate } from "react-router-dom";

import {
  LegacyTripPathRedirect,
  OverviewGate,
  TripEntryRedirect,
  TripIdSync,
  TripsGate,
} from "@/components/routing/trip-routing";
import { ROUTES } from "@/constants/routes";
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
          { path: "trips", element: <TripsGate /> },
          { path: "list", element: <Navigate to={ROUTES.trips} replace /> },
        ],
      },

      {
        path: "trips/:tripId",
        element: <AppShellLayout />,
        children: [
          {
            element: <TripIdSync />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
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

      {
        path: "dashboard",
        element: <LegacyTripPathRedirect section="dashboard" />,
      },
      {
        path: "itinerary",
        element: <LegacyTripPathRedirect section="itinerary" />,
      },
      {
        path: "calendar",
        element: <LegacyTripPathRedirect section="calendar" />,
      },
      {
        path: "packing",
        element: <LegacyTripPathRedirect section="packing" />,
      },
      {
        path: "budget",
        element: <LegacyTripPathRedirect section="budget" />,
      },
      {
        path: "settings",
        element: <LegacyTripPathRedirect section="settings" />,
      },

      { path: "*", element: <TripEntryRedirect /> },
    ],
  },
]);
