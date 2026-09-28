import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { reloadOnce } from './lib/reload'

// Vite raises this when a preloaded chunk can't be fetched, typically after a new deploy.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnce()) event.preventDefault()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
