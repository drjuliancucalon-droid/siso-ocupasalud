// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Entry Point (main.jsx)
// BrowserRouter + Stores + Service Worker
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// ── Service Worker (PWA offline) ──────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        console.log('[SISO] Service Worker registrado ✓', reg.scope);
        reg.update().catch(() => {});
      })
      .catch(err => console.warn('[SISO] SW no disponible (modo dev normal):', err.message));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);