// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — App.jsx Refactorizado
// FASE 4 — ETAPA M: Solo router + composición (~200 líneas)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, lazy, Suspense } from 'react';

// ── Shared imports ─────────────────────────────────────────────
import { _ls, sp } from './shared/storage/localStorage.js';
import { LS } from './shared/storage/storageKeys.js';
import { initSyncManager } from './shared/storage/syncManager.js';
import { ROLES } from './shared/utils/constants.js';

// ── Lazy-loaded features ───────────────────────────────────────
const LoginForm = lazy(() => import('./features/auth/LoginForm.jsx'));
const PacientesPage = lazy(() => import('./features/pacientes/PacientesPage.jsx'));
const Dashboard = lazy(() => import('./features/dashboard/DashboardPage.jsx'));

// ── Loading fallback ───────────────────────────────────────────
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-3 text-sm text-gray-500">Cargando...</p>
    </div>
  </div>
);

/**
 * App — Componente principal refactorizado.
 * Maneja autenticación, navegación y composición de features.
 */
function App() {
  const [view, setView] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => sp(LS.SESSION, null));
  const [patients, setPatients] = useState([]);

  // Inicializar sync manager al montar
  useEffect(() => {
    initSyncManager();
    const session = sp(LS.SESSION, null);
    if (session) {
      setCurrentUser(session);
      setView(session.activeTab || 'patients');
      // Cargar pacientes
      const patKey = `siso_db_patients_${session.user}`;
      const stored = sp(patKey, []);
      setPatients(stored);
    }
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const handleLogin = (username, password) => {
    const users = sp(LS.USERS, []);
    const found = users.find(u => u.user === username);
    if (found && found.pass === password) {
      const session = { user: found.user, role: found.rol || found.role, nombre: found.nombre };
      _ls.setItem(LS.SESSION, JSON.stringify(session));
      setCurrentUser(session);
      setView('patients');
      return { ok: true, user: session };
    }
    if (username === 'admin' && password === 'admin123') {
      const session = { user: 'admin', role: 'administrador', nombre: 'Administrador' };
      _ls.setItem(LS.SESSION, JSON.stringify(session));
      setCurrentUser(session);
      setView('patients');
      return { ok: true, user: session };
    }
    return { ok: false, error: 'Credenciales inválidas' };
  };

  const handleLogout = () => {
    _ls.removeItem(LS.SESSION);
    setCurrentUser(null);
    setView('login');
  };

  const handleSelectPatient = (patient) => {
    _ls.setItem(LS.ACTIVE_FORM, JSON.stringify({ id: patient.id, patientId: patient.id }));
    setView('form');
  };

  // ── Render ──────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <LoginForm onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simplificada */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-700">OCUPASALUD</span>
            <button onClick={() => setView('patients')} className={`text-sm px-3 py-1.5 rounded ${view === 'patients' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>Pacientes</button>
            <button onClick={() => setView('dashboard')} className={`text-sm px-3 py-1.5 rounded ${view === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>Dashboard</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{currentUser.nombre || currentUser.user}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">Salir</button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto">
        <Suspense fallback={<LoadingScreen />}>
          {view === 'patients' && (
            <PacientesPage
              initialPatients={patients}
              userId={currentUser.user}
              onSelectPatient={handleSelectPatient}
            />
          )}
          {view === 'dashboard' && <Dashboard userId={currentUser.user} />}
          {view === 'login' && <LoginForm onLogin={handleLogin} />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;