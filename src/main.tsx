import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runAmanDiagnostic } from './utils/amanChatDiagnostic';

// Ensure the diagnostic function is attached to global scope immediately on load
if (typeof window !== 'undefined') {
  window.runAmanDiagnostic = runAmanDiagnostic;
  
  if (typeof window.runAmanDiagnostic !== "function") {
     console.error("[AMAN Diagnostic] Global binding failed");
  } else {
     console.info("[AMAN Diagnostic] Global function ready");
  }
}

// Extremely targeted, development-only narrow suppression of benign Vite HMR connection failures.
// This block is completely stripped from production builds via import.meta.env.DEV dead-code elimination.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const isViteHmrError = (msg: any): boolean => {
    if (!msg) return false;
    const str = typeof msg === 'string' ? msg : (msg.message || String(msg));
    return str.includes('[vite] failed to connect to websocket') || str.includes('WebSocket connection to');
  };

  const origError = console.error;
  console.error = function (...args) {
    if (args[0] && isViteHmrError(args[0])) {
      return;
    }
    origError.apply(this, args);
  };

  const origWarn = console.warn;
  console.warn = function (...args) {
    if (args[0] && isViteHmrError(args[0])) {
      return;
    }
    origWarn.apply(this, args);
  };

  window.addEventListener('error', (event) => {
    if (event.message && isViteHmrError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.error && isViteHmrError(event.error)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && isViteHmrError(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
