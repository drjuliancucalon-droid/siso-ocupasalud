// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Cliente Worker D1 (Cloudflare)
// FASE 4 — ETAPA B: Extraído de syncManager.js + App.jsx
// ═══════════════════════════════════════════════════════════════

import { shouldSyncToD1 } from './storageKeys.js';
import { _ls } from './localStorage.js';

/**
 * Obtiene la URL del Worker D1 desde configuración.
 * @returns {string} URL base del Worker
 */
const getWorkerUrl = () => {
  return (typeof window !== 'undefined' && window.__SISO_CONFIG?.workerUrl) || '';
};

/**
 * Obtiene el token de autenticación para D1.
 * @returns {string} Token de acceso
 */
const getWorkerToken = () => {
  return (typeof window !== 'undefined' && window.__SISO_CONFIG?.workerToken) || '';
};

/**
 * Obtiene headers comunes para requests a D1.
 * @returns {Object} Headers
 */
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-Siso-Token': getWorkerToken(),
  };
};

/**
 * Descarga TODAS las claves siso_* de Worker D1.
 * @returns {Promise<Object|null>} { key: { value, updatedAt } }
 */
export const d1GetAll = async () => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return null;
  try {
    const r = await fetch(`${W}/store/prefix/siso_`, {
      headers: { 'X-Siso-Token': TOK },
    });
    if (!r.ok) return null;
    const rows = await r.json();
    const out = {};
    for (const row of (rows || [])) {
      out[row.key] = {
        value: row.value,
        updatedAt:
          (row.value && typeof row.value === 'object' && row.value.updatedAt) ||
          row.ts ||
          row.updatedAt ||
          new Date().toISOString(),
      };
    }
    return out;
  } catch {
    return null;
  }
};

/**
 * Lee una clave específica de D1.
 * @param {string} key - Clave a leer
 * @returns {Promise<*>} Valor o null
 */
export const d1Get = async (key) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return null;
  try {
    const r = await fetch(`${W}/store/${encodeURIComponent(key)}`, {
      headers: { 'X-Siso-Token': TOK },
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d[0]?.value ?? null;
  } catch {
    return null;
  }
};

/**
 * Envía datos a D1 (upsert).
 * @param {string} key - Clave
 * @param {*} value - Valor (será JSON.stringify)
 * @returns {Promise<boolean>} true si éxito
 */
export const d1Set = async (key, value) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return false;
  try {
    const r = await fetch(`${W}/store`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ key, value }),
    });
    return r.ok;
  } catch {
    return false;
  }
};

/**
 * Elimina una clave de D1.
 * @param {string} key - Clave a eliminar
 * @returns {Promise<boolean>}
 */
export const d1Delete = async (key) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return false;
  try {
    const r = await fetch(`${W}/store/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { 'X-Siso-Token': TOK },
    });
    return r.ok;
  } catch {
    return false;
  }
};

/**
 * Sincroniza un valor a D1 (con fallback a localStorage).
 * @param {string} key - Clave
 * @param {string} jsonValue - Valor serializado como JSON
 */
export const sync = (key, jsonValue) => {
  // Siempre guardar local primero
  _ls.setItem(key, jsonValue);

  // Verificar si debe sincronizar a D1
  if (!shouldSyncToD1(key)) return;

  let parsed;
  try {
    parsed = JSON.parse(jsonValue);
  } catch {
    parsed = jsonValue;
  }

  // Enviar a D1 de forma asíncrona
  setTimeout(() => {
    d1Set(key, parsed).catch(() => {
      // Si falla D1, queda en localStorage (se sincronizará después)
    });
  }, 0);
};