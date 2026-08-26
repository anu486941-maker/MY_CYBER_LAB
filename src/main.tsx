import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence Vite's benign WebSocket connection errors when HMR is disabled by the platform
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    const msg = typeof event.reason === 'string' ? event.reason : (event.reason.message || String(event.reason));
    if (msg && msg.includes('WebSocket')) {
      event.preventDefault();
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
