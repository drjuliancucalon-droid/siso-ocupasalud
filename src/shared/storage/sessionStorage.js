// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Wrapper sessionStorage
// FASE 4 — ETAPA B: Unificado desde App.jsx (L183) + utils/storage.js
// ═══════════════════════════════════════════════════════════════

const _memStore = {}; // fallback si sessionStorage no está disponible

/**
 * Wrapper seguro de sessionStorage con fallback en memoria.
 * Los datos se limpian automáticamente al cerrar la pestaña.
 */
export const _ss = {
  getItem: (k) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return _memStore["_ss_" + k] ?? null;
    }
  },
  setItem: (k, v) => {
    try {
      sessionStorage.setItem(k, String(v));
    } catch {
      _memStore["_ss_" + k] = String(v);
    }
  },
  removeItem: (k) => {
    try {
      sessionStorage.removeItem(k);
    } catch {
      delete _memStore["_ss_" + k];
    }
  },
};

/**
 * Lee y parsea JSON de sessionStorage.
 * @param {string} k - Clave
 * @param {*} fb - Valor por defecto si no existe o error
 * @returns {*} Valor parseado
 */
export const sps = (k, fb) => {
  const s = _ss.getItem(k);
  if (!s) return fb;
  try {
    return JSON.parse(s);
  } catch {
    return fb;
  }
};

/**
 * Verifica disponibilidad de sessionStorage.
 * @returns {boolean}
 */
export const isSessionStorageAvailable = () => {
  try {
    const k = '__siso_test__';
    sessionStorage.setItem(k, '1');
    sessionStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
};