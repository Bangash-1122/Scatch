import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { FatalError } from '@/components/ui/FatalError'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary label="Application" fallback={<FatalError />}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
