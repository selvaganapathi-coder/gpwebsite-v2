import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/bundle.css'
import App from './App.jsx'

document.getElementById('boot-loader')?.remove()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
