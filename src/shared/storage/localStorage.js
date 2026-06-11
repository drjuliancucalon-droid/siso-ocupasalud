// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Wrapper localStorage
// FASE 4 — ETAPA B: Unificado desde App.jsx (L158) + utils/storage.js
// ═══════════════════════════════════════════════════════════════

const _memStore = {}; // fallback si localStorage no está disponible

/**
 * Wrapper seguro de localStorage con fallback en memoria.
 */
export const _ls = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return _memStore[k] ?? null;
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, String(v));
    } catch {
      _memStore[k] = String(v);
    }
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      delete _memStore[k];
    }
  },
};

/**
 * Lee y parsea JSON de localStorage.
 * @param {string} k - Clave
 * @param {*} fb - Valor por defecto si no existe o error
 * @returns {*} Valor parseado
 */
export const sp = (k, fb) => {
  const s = _ls.getItem(k);
  if (!s) return fb;
  try {
    return JSON.parse(s);
  } catch {
    return fb;
  }
};

/**
 * Verifica disponibilidad de localStorage.
 * @returns {boolean}
 */
export const isLocalStorageAvailable = () => {
  try {
    const k = '__siso_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtiene el uso actual de localStorage en bytes.
 * @returns {number} Bytes usados
 */
export const getLocalStorageSize = () => {
  let total = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += key.length + localStorage[key].length;
      }
    }
  } catch {}
  return total;
};

/**
 * Obtiene todas las claves que coinciden con un prefijo.
 * @param {string} prefix - Prefijo a buscar
 * @returns {string[]} Lista de claves
 */
export const getKeysByPrefix = (prefix) => {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
  } catch {}
  return keys;
};