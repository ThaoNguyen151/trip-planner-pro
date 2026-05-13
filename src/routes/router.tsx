import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { AppShellLayout } from "@/layouts/AppShellLayout";
import { HeaderOnlyLayout } from "@/layouts/HeaderOnlyLayout";
import BudgetPage from "@/pages/budget/BudgetPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ItineraryPage from "@/pages/itinerary/ItineraryPage";
import PackingPage from "@/pages/packing/PackingPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import OverviewPage from "@/pages/overview/OverviewPage";
import ListPage from "@/pages/overview/List";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    children: [
      // { index: true, element: <Navigate to={ROUTES.dashboard} replace /> };
      { index: true, element: <Navigate to={ROUTES.overview} replace /> },

      //HEADER ONLY LAYOUT
      {
        element: <HeaderOnlyLayout />,
        children: [
          { path: "overview", element: <OverviewPage /> },
          { path: "list", element: <ListPage /> },
        ],
      },

      //APP SHELL LAYOUT
      {
        element: <AppShellLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "itinerary", element: <ItineraryPage /> },
          { path: "calendar", element: <CalendarPage /> },
          { path: "packing", element: <PackingPage /> },
          { path: "budget", element: <BudgetPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },

      { path: "*", element: <Navigate to={ROUTES.dashboard} replace /> },
    ],
  },
]);
