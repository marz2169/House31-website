import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SEOProvider } from './components/SEO'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SEOProvider>
      <App />
    </SEOProvider>
  </StrictMode>
)
