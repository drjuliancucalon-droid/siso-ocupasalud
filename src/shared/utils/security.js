// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Seguridad y Auditoría
// Extraído de src/App.jsx (FASE 4 — ETAPA A)
// Funciones: _auditLog (L100), _rl (L117), _resetSessionTimer (L142)
// ═══════════════════════════════════════════════════════════════

import { sanitizeInput } from './sanitize.js';
import { SESSION_TIMEOUT_MS } from './constants.js';

// ── AUDIT LOG ────────────────────────────────────────────────

/**
 * Registra un evento en el log de auditoría.
 * @param {string} action - Acción realizada
 * @param {string} user - Usuario que realizó la acción
 * @param {string} [detail=''] - Detalle adicional
 */
export const auditLog = (action, user, detail = '') => {
  try {
    const logs = JSON.parse(localStorage.getItem('siso_audit_log') || '[]');
    logs.push({
      ts: new Date().toISOString(),
      action: sanitizeInput(String(action)),
      user: sanitizeInput(String(user || 'anonymous')),
      detail: sanitizeInput(String(detail)),
      ua: navigator.userAgent.substring(0, 80),
    });
    // Mantener solo los últimos 200 registros
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    localStorage.setItem('siso_audit_log', JSON.stringify(logs));
  } catch (_) { /* Silencioso por diseño - fallo de auditoría no crítico */ }
};

// ── RATE LIMITING ─────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

const getRLData = () => {
  try {
    return JSON.parse(localStorage.getItem('siso_rl_login') || '{"attempts":0,"blockedUntil":0}');
  } catch(_) {
    return { attempts: 0, blockedUntil: 0 };
  }
};

const setRLData = (data) => {
  try {
    localStorage.setItem('siso_rl_login', JSON.stringify(data));
  } catch(_) { /* Silencioso */ }
};

/**
 * Verifica si el login está bloqueado.
 * @returns {boolean}
 */
export const isLoginBlocked = () => {
  const d = getRLData();
  return d.blockedUntil && Date.now() < d.blockedUntil;
};

/**
 * Obtiene los minutos restantes de bloqueo.
 * @returns {number}
 */
export const getLoginRemainingMin = () => {
  const d = getRLData();
  return Math.ceil(Math.max(0, d.blockedUntil - Date.now()) / 60000);
};

/**
 * Obtiene el número de intentos fallidos.
 * @returns {number}
 */
export const getLoginAttempts = () => {
  return getRLData().attempts || 0;
};

/**
 * Registra un intento de login fallido.
 * Si llega al máximo, bloquea por BLOCK_MINUTES.
 */
export const recordLoginFailure = () => {
  const d = getRLData();
  d.attempts = (d.attempts || 0) + 1;
  if (d.attempts >= MAX_LOGIN_ATTEMPTS) {
    d.blockedUntil = Date.now() + BLOCK_MINUTES * 60000;
    d.attempts = 0;
  }
  setRLData(d);
};

/**
 * Resetea el contador de intentos (login exitoso).
 */
export const resetLoginAttempts = () => {
  setRLData({ attempts: 0, blockedUntil: 0 });
};

// ── SESSION TIMEOUT ───────────────────────────────────────────

let _sessionTimer = null;

/**
 * Inicia el timer de sesión por inactividad.
 * @param {Function} logoutCallback - Función a ejecutar al expirar
 */
export const resetSessionTimer = (logoutCallback) => {
  if (_sessionTimer) clearTimeout(_sessionTimer);
  _sessionTimer = setTimeout(() => {
    if (logoutCallback) logoutCallback();
  }, SESSION_TIMEOUT_MS);
};

/**
 * Cancela el timer de sesión.
 */
export const clearSessionTimer = () => {
  if (_sessionTimer) {
    clearTimeout(_sessionTimer);
    _sessionTimer = null;
  }
};