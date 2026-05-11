import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { AppShellLayout } from '@/layouts/AppShellLayout'
import BudgetPage from '@/pages/budget/BudgetPage'
import CalendarPage from '@/pages/calendar/CalendarPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ItineraryPage from '@/pages/itinerary/ItineraryPage'
import PackingPage from '@/pages/packing/PackingPage'
import SettingsPage from '@/pages/settings/SettingsPage'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppShellLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'itinerary', element: <ItineraryPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'packing', element: <PackingPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to={ROUTES.dashboard} replace /> },
    ],
  },
])
