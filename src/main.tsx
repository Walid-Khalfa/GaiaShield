import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { withErrorOverlay } from './components/with-error-overlay'
import { initSentry, initPostHog } from './lib/monitoring'
import { queryClient } from './lib/queryClient'

// Initialize monitoring
initSentry();
initPostHog();

const AppWithErrorOverlay = withErrorOverlay(App)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithErrorOverlay />
    </QueryClientProvider>
  </StrictMode>,
)
