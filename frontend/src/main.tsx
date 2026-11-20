import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { googleTranslateService } from './services/googleTranslateService'

// Initialize Real-time Dynamic Google Translate engine & React DOM protection
googleTranslateService.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
