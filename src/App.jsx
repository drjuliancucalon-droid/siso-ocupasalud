// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — App.jsx Refactorizado (SPRINT 0)
// Router completo con TODAS las páginas + Stores + Watchers
// ═══════════════════════════════════════════════════════════════

import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// ── Layout (siempre visible para rutas protegidas) ────────────
import Layout from './app/Layout.jsx';

// ── Componentes transversales (watchers) ─────────────────────
import VersionWatcher from './components/VersionWatcher.jsx';
import D1ChangesWatcher from './components/D1ChangesWatcher.jsx';
import StorageHealth from './components/StorageHealth.jsx';

// ── Lazy loading de TODAS las páginas ────────────────────────
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const PatientsPage = lazy(() => import('./pages/PatientsPage.jsx'));
const HistoriaPage = lazy(() => import('./pages/HistoriaPage.jsx'));
const HistoriaGeneralPage = lazy(() => import('./pages/HistoriaGeneralPage.jsx'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage.jsx'));
const AgendaPage = lazy(() => import('./pages/AgendaPage.jsx'));
const BillingPage = lazy(() => import('./pages/BillingPage.jsx'));
const CajaPage = lazy(() => import('./pages/CajaPage.jsx'));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx'));
const SGSSTPage = lazy(() => import('./pages/SGSSTPage.jsx'));
const TelemedicinePage = lazy(() => import('./pages/TelemedicinePage.jsx'));
const WorkerPortalPage = lazy(() => import('./pages/WorkerPortalPage.jsx'));
const PortalEmpresaPage = lazy(() => import('./pages/PortalEmpresaPage.jsx'));
const PortalCertificadosEmpresa = lazy(() => import('./pages/PortalCertificadosEmpresa.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const CertificadoPage = lazy(() => import('./pages/CertificadoPage.jsx'));
const VerificacionPage = lazy(() => import('./pages/VerificacionPage.jsx'));
const CartaCustodiaPage = lazy(() => import('./pages/CartaCustodiaPage.jsx'));
const ContabilidadPage = lazy(() => import('./pages/ContabilidadPage.jsx'));
const PlanesPage = lazy(() => import('./pages/PlanesPage.jsx'));
const CotizacionesPage = lazy(() => import('./pages/CotizacionesPage.jsx'));
const PortafolioPage = lazy(() => import('./pages/PortafolioPage.jsx'));
const MensajesPage = lazy(() => import('./pages/MensajesPage.jsx'));
const ARLPage = lazy(() => import('./pages/ARLPage.jsx'));
const HabeasDataPage = lazy(() => import('./pages/HabeasDataPage.jsx'));
const ConfigIPSPage = lazy(() => import('./pages/ConfigIPSPage.jsx'));
const SuperAdminPage = lazy(() => import('./pages/SuperAdminPage.jsx'));
const BackupPage = lazy(() => import('./pages/BackupPage.jsx'));

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
 * Ruta protegida: redirige a /login si no hay sesión
 */
function ProtectedRoute({ children }) {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

/**
 * WatchersWrapper — Inyecta los watchers transversales en el Layout
 */
function WatchersWrapper({ children }) {
  return (
    <>
      <VersionWatcher />
      <D1ChangesWatcher />
      <StorageHealth />
      {children}
    </>
  );
}

/**
 * App — Componente principal con React Router
 */
export default function App() {
  const { currentUser, loginLocal } = useAuthStore();

  // Restaurar sesión desde localStorage al iniciar
  useEffect(() => {
    if (!currentUser) {
      try {
        const stored = localStorage.getItem('siso-auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.currentUser) {
            loginLocal(parsed.currentUser);
          }
        }
      } catch {
        // Ignorar errores de parseo
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* ── Ruta pública: Login ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Portales públicos (sin autenticación) ── */}
        <Route path="/portal" element={<WorkerPortalPage />} />
        <Route path="/portal/empresa" element={<PortalEmpresaPage />} />
        <Route path="/portal/empresa/certificados" element={<PortalCertificadosEmpresa />} />
        <Route path="/verificar" element={<VerificacionPage />} />
        <Route path="/certificado/:code" element={<CertificadoPage />} />

        {/* ── Redirección raíz ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Rutas protegidas con Layout + Watchers ── */}
        <Route
          element={
            <ProtectedRoute>
              <WatchersWrapper>
                <Layout />
              </WatchersWrapper>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/hc/new" element={<HistoriaPage />} />
          <Route path="/hc/general" element={<HistoriaGeneralPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/caja" element={<CajaPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/sgsst" element={<SGSSTPage />} />
          <Route path="/telemedicine" element={<TelemedicinePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/custodia" element={<CartaCustodiaPage />} />
          <Route path="/contabilidad" element={<ContabilidadPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          <Route path="/cotizaciones" element={<CotizacionesPage />} />
          <Route path="/portafolio" element={<PortafolioPage />} />
          <Route path="/mensajes" element={<MensajesPage />} />
          <Route path="/arl" element={<ARLPage />} />
          <Route path="/habeas-data" element={<HabeasDataPage />} />
          <Route path="/config/ips" element={<ConfigIPSPage />} />
          <Route path="/admin" element={<SuperAdminPage />} />
          <Route path="/backup" element={<BackupPage />} />
        </Route>

        {/* ── Catch-all: redirigir a dashboard ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}