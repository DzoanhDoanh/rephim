import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

if (container) {
  try {
    console.log('Mounting App...');
    const root = createRoot(container)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
    console.log('App render called successfully.');
  } catch (err) {
    console.error('MOUNT ERROR:', err);
    container.innerHTML = `<div style="background:#1a0000;color:red;padding:20px;min-height:100vh">
      <h1>Critical Error during Mount:</h1>
      <pre>${err.stack || err.message}</pre>
    </div>`;
  }
}
