import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/poppins";
import { SeccionPaginaProvider } from '../context/SeccionContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SeccionPaginaProvider>
      <App />
    </SeccionPaginaProvider>
  </StrictMode>,
)
