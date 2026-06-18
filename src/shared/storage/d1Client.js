// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Cliente Worker D1 (Cloudflare) — Sprint 1
// Ahora con: merge anti-regresión, auto-chunking, retries, If-Match
// ═══════════════════════════════════════════════════════════════

import { shouldSyncToD1 } from './storageKeys.js';
import { _ls } from './localStorage.js';

// ── Configuración ────────────────────────────────────────────
const CHUNK_SIZE = 500 * 1024; // 500KB por chunk
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // backoff exponencial

// ── Helpers de configuración ─────────────────────────────────
const getWorkerUrl = () => {
  return typeof window !== 'undefined' && window.__SISO_CONFIG?.workerUrl ? window.__SISO_CONFIG.workerUrl : '';
};

const getWorkerToken = () => {
  return typeof window !== 'undefined' && window.__SISO_CONFIG?.workerToken ? window.__SISO_CONFIG.workerToken : '';
};

const getHeaders = (etag = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Siso-Token': getWorkerToken(),
  };
  if (etag) {
    headers['If-Match'] = etag;
  }
  return headers;
};

const getBaseHeaders = () => ({
  'X-Siso-Token': getWorkerToken(),
});

// ── Request con retries y backoff exponencial ────────────────
async function _requestWithRetry(url, options = {}, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        if (res.status >= 500 && i < retries - 1) {
          const delay = RETRY_DELAYS[i];
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      if (i < retries - 1 && err.message.includes('fetch')) {
        const delay = RETRY_DELAYS[i];
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

// ── d1GetAll ─────────────────────────────────────────────────
export const d1GetAll = async () => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return null;
  try {
    const r = await _requestWithRetry(`${W}/store/prefix/siso_`, {
      headers: getBaseHeaders(),
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
        etag: row.etag,
      };
    }
    return out;
  } catch {
    return null;
  }
};

// ── d1Get ────────────────────────────────────────────────────
export const d1Get = async (key) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return null;
  try {
    const r = await _requestWithRetry(`${W}/store/${encodeURIComponent(key)}`, {
      headers: getBaseHeaders(),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d[0]?.value ?? null;
  } catch {
    return null;
  }
};

// ── d1Set (con If-Match opcional) ───────────────────────────
export const d1Set = async (key, value, etag = null) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return false;
  try {
    const r = await _requestWithRetry(`${W}/store`, {
      method: 'POST',
      headers: getHeaders(etag),
      body: JSON.stringify({ key, value }),
    });
    if (r.status === 412) {
      throw new Error('Conflict: ETag mismatch');
    }
    return r.ok;
  } catch {
    return false;
  }
};

// ── d1Delete ─────────────────────────────────────────────────
export const d1Delete = async (key) => {
  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) return false;
  try {
    const r = await _requestWithRetry(`${W}/store/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: getBaseHeaders(),
    });
    return r.ok;
  } catch {
    return false;
  }
};

// ── Serialización segura ─────────────────────────────────────
function serialize(value) {
  try {
    const json = JSON.stringify(value);
    return json;
  } catch {
    return JSON.stringify({ error: 'Serialization failed', fallback: String(value) });
  }
}

function estimateSize(value) {
  try {
    return new Blob([serialize(value)]).size;
  } catch {
    return 0;
  }
}

// ── d1WriteArrayMerge — CRÍTICO ────────────────────────────
/**
 * Escribe una lista en D1 haciendo MERGE anti-regresión por campo id.
 * - Lee el valor remoto actual (si existe)
 * - Hace merge por id: combina existentes + nuevos, sin perder datos
 * - Nunca puede quedar menor que el remoto
 * - Auto-chunking si >500KB
 * - Usa If-Match para locking optimista
 */
export async function d1WriteArrayMerge(key, list, idField = 'id') {
  // Validar que sea array
  const incoming = Array.isArray(list) ? list : [];
  const size = estimateSize(incoming);

  // Local store siempre (fallback)
  _ls.setItem(key, serialize(incoming));

  // Si no debe sincronizar a D1, retornamos
  if (!shouldSyncToD1(key)) {
    return { ok: true, mode: 'local-only', bytes: size };
  }

  const W = getWorkerUrl();
  const TOK = getWorkerToken();
  if (!W || !TOK) {
    return { ok: true, mode: 'local-fallback', bytes: size };
  }

  try {
    // 1. Leer valor remoto actual para merge
    let remoteValue = [];
    let etag = null;
    try {
      const r = await _requestWithRetry(`${W}/store/${encodeURIComponent(key)}`, {
        headers: getBaseHeaders(),
      });
      if (r.ok) {
        const data = await r.json();
        const parsed = data[0]?.value;
        if (Array.isArray(parsed)) {
          remoteValue = parsed;
        }
        etag = r.headers.get('ETag') || data[0]?.etag || null;
      }
    } catch (e) {
      console.warn('[D1] No se pudo leer valor remoto, sobrescribiendo:', e.message);
    }

    // 2. Merge anti-regresión por id
    const remoteMap = new Map(remoteValue.map(item => [item[idField], item]));
    const incomingIds = new Set();

    for (const item of incoming) {
      const id = item[idField];
      incomingIds.add(id);
      const existing = remoteMap.get(id);
      if (existing) {
        // Merge: priorizar entrada no vacía del usuario, conservar remoto como fallback
        const merged = { ...existing };
        for (const k of Object.keys(item)) {
          if (item[k] !== undefined && item[k] !== '' && item[k] !== null) {
            merged[k] = item[k];
          }
        }
        remoteMap.set(id, merged);
      } else {
        remoteMap.set(id, item);
      }
    }

    // 3. Asegurar que NO se pierde ningún dato remoto (anti-regresión estricta)
    // remoteMap ya tiene todos: remote + merge de nuevos

    const mergedList = Array.from(remoteMap.values());

    // 4. Serializar
    const serialized = serialize(mergedList);

    // 5. Auto-chunking si >500KB
    if (new Blob([serialized]).size > CHUNK_SIZE) {
      return await _writeChunked(W, TOK, key, mergedList, null);
    }

    // 6. Escribir con If-Match
    const r = await _requestWithRetry(`${W}/store`, {
      method: 'POST',
      headers: getHeaders(etag),
      body: JSON.stringify({ key, value: mergedList }),
    });

    if (r.status === 412) {
      // Conflicto de versión: reintentar leyendo de nuevo
      console.warn('[D1] ETag conflict en merge, reintentando...');
      return await d1WriteArrayMerge(key, list, idField);
    }

    return { ok: r.ok, mode: 'direct', bytes: new Blob([serialized]).size, count: mergedList.length };
  } catch (e) {
    console.error('[D1] Error en merge:', e);
    return { ok: false, error: e.message, mode: 'error', localFallback: true };
  }
}

// ── Escritura con chunking ───────────────────────────────────
async function _writeChunked(W, TOK, baseKey, list, parentEtag) {
  const CHUNK_PREFIX = '__chunk_';
  const chunks = [];
  let current = [];
  let currentSize = 0;

  for (const item of list) {
    const itemSize = estimateSize(item);
    if (currentSize + itemSize > CHUNK_SIZE && current.length > 0) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(item);
    currentSize += itemSize;
  }
  if (current.length > 0) chunks.push(current);

  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkKey = `${CHUNK_PREFIX}${baseKey}_${i}`;
    const serialized = serialize(chunks[i]);
    const size = new Blob([serialized]).size;

    try {
      const r = await _requestWithRetry(`${W}/store`, {
        method: 'POST',
        headers: getHeaders(parentEtag),
        body: JSON.stringify({ key: chunkKey, value: chunks[i] }),
      });
      results.push({ ok: r.ok, key: chunkKey, bytes: size, count: chunks[i].length });
    } catch (e) {
      results.push({ ok: false, key: chunkKey, error: e.message });
    }
  }

  // Metadata de chunking
  try {
    await _requestWithRetry(`${W}/store`, {
      method: 'POST',
      headers: getHeaders(null),
      body: JSON.stringify({
        key: `${baseKey}__meta`,
        value: {
          chunked: true,
          totalChunks: chunks.length,
          totalItems: list.length,
          chunkPrefix: CHUNK_PREFIX,
          baseKey,
        },
      }),
    });
  } catch {
    // No crítico
  }

  const totalOk = results.filter(r => r.ok).length;
  return { ok: totalOk === chunks.length, mode: 'chunked', chunks: results, totalBytes: results.reduce((s, r) => s + (r.bytes || 0), 0) };
}

// ── d1GetMany (lectura de múltiples claves) ─────────────────
export async function d1GetMany(keys) {
  const results = {};
  await Promise.all(
    keys.map(async k => {
      const v = await d1Get(k);
      results[k] = v;
    })
  );
  return results;
}

// ── sync (legacy, mantener compatibilidad) ───────────────────
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

export default {
  d1GetAll,
  d1Get,
  d1Set,
  d1Delete,
  d1GetMany,
  d1WriteArrayMerge,
  sync,
};