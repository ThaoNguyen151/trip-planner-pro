import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initTripScopeBridge } from '@/lib/trip-scope-bridge'
import { useTripStore } from '@/stores/useTripStore'

function bootstrapTripScope() {
  if (useTripStore.persist.hasHydrated()) {
    initTripScopeBridge()
    return
  }
  useTripStore.persist.onFinishHydration(() => {
    initTripScopeBridge()
  })
}

bootstrapTripScope()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
