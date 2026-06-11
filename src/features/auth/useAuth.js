// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useAuth
// FASE 4 — ETAPA G: Autenticación, usuarios, roles, sesión
// Extraído de App.jsx: handleLogin, handleLogout, _initSess,
//   _isAdmin, _canUse, _secretariaPuede, sessionUser
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { _ss } from '../../shared/storage/sessionStorage.js';
import { LS, SS } from '../../shared/storage/storageKeys.js';
import { auditLog, resetLoginAttempts, recordLoginFailure, isLoginBlocked, getLoginRemainingMin } from '../../shared/utils/security.js';
import { ROLES } from '../../shared/utils/constants.js';

const DEFAULT_ADMIN = { user: 'admin', pass: 'admin123', role: ROLES.ADMIN, nombre: 'Administrador' };

/**
 * Hook de autenticación y manejo de sesión.
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = JSON.parse(_ls.getItem(LS.SESSION) || 'null');
      return s || null;
    } catch { return null; }
  });
  const [users, setUsers] = useState(() => sp(LS.USERS, []));
  const [loading, setLoading] = useState(false);

  // ── Login ────────────────────────────────────────────────
  const login = useCallback((username, password) => {
    if (isLoginBlocked()) {
      const min = getLoginRemainingMin();
      return { ok: false, error: `Demasiados intentos. Espere ${min} minutos.` };
    }

    const userList = sp(LS.USERS, []);
    const found = userList.find(u => u.user === username);

    if (found && found.pass === password && found.activo !== false) {
      const session = { user: found.user, role: found.rol || found.role, nombre: found.nombre, id: found.id };
      _ls.setItem(LS.SESSION, JSON.stringify(session));
      resetLoginAttempts();
      auditLog('login', found.user, 'Login exitoso');
      setCurrentUser(session);
      return { ok: true, user: session };
    }

    // Admin por defecto
    if (username === DEFAULT_ADMIN.user && password === DEFAULT_ADMIN.pass) {
      const session = { user: DEFAULT_ADMIN.user, role: DEFAULT_ADMIN.role, nombre: DEFAULT_ADMIN.nombre };
      _ls.setItem(LS.SESSION, JSON.stringify(session));
      resetLoginAttempts();
      auditLog('login', DEFAULT_ADMIN.user, 'Login admin');
      setCurrentUser(session);
      return { ok: true, user: session };
    }

    recordLoginFailure();
    auditLog('login_failed', username, 'Credenciales inválidas');
    return { ok: false, error: 'Usuario o contraseña incorrectos' };
  }, []);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    const user = currentUser?.user || 'unknown';
    auditLog('logout', user, 'Logout');
    // Limpiar sessionStorage (API Keys)
    try { sessionStorage.clear(); } catch {}
    // Limpiar sesión
    _ls.removeItem(LS.SESSION);
    _ls.removeItem(LS.ACTIVE_FORM);
    _ls.removeItem(LS.LOGIN_ATTEMPTS);
    _ls.removeItem(LS.LOGIN_BLOCKED_UNTIL);
    setCurrentUser(null);
  }, [currentUser]);

  // ── Roles ────────────────────────────────────────────────
  const isAdmin = useCallback((role) => role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN, []);
  const isAdminEmpresa = useCallback((role) => role === ROLES.ADMIN_EMPRESA, []);
  const isMedico = useCallback((role) => role === ROLES.MEDICO, []);

  const canUse = useCallback((feature) => {
    const role = currentUser?.role;
    if (!role) return false;
    if (isAdmin(role)) return true;
    if (isAdminEmpresa(role)) return ['dashboard', 'portal-empresa'].includes(feature);
    if (isMedico(role)) return true;
    return false;
  }, [currentUser, isAdmin, isAdminEmpresa]);

  // ── Gestión de usuarios ──────────────────────────────────
  const saveUsers = useCallback((newUsers) => {
    setUsers(newUsers);
    _ls.setItem(LS.USERS, JSON.stringify(newUsers));
  }, []);

  const addUser = useCallback((userData) => {
    const updated = [...users, { ...userData, id: 'usr_' + Date.now(), activo: true }];
    saveUsers(updated);
    return updated;
  }, [users, saveUsers]);

  const updateUser = useCallback((id, data) => {
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    saveUsers(updated);
    return updated;
  }, [users, saveUsers]);

  const deleteUser = useCallback((id) => {
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
    return updated;
  }, [users, saveUsers]);

  // ── Inicialización de sesión desde D1 ────────────────────
  const initSession = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar usuarios desde localStorage (ya deberían estar)
      const storedUsers = sp(LS.USERS, []);
      if (storedUsers.length > 0) setUsers(storedUsers);

      // Si hay sesión activa, verificar el usuario
      const session = sp(LS.SESSION, null);
      if (session) setCurrentUser(session);
    } finally { setLoading(false); }
  }, []);

  return {
    currentUser, setCurrentUser, users, loading,
    login, logout, isAdmin, isAdminEmpresa, isMedico, canUse,
    saveUsers, addUser, updateUser, deleteUser, initSession,
  };
};