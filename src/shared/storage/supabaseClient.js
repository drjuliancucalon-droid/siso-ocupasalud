// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Cliente Supabase REST
// FASE 4 — ETAPA B: Extraído de utils/supabase.js
// ═══════════════════════════════════════════════════════════════

import { _ls } from './localStorage.js';

// ── Configuración ─────────────────────────────────────────────
const _cfgRaw = (typeof window !== 'undefined' && window.__SISO_CONFIG) || {};

const _cfgSafeUrl = (v) =>
  typeof v === 'string' && v.startsWith('https://') && v.length < 200 ? v : null;
const _cfgSafeKey = (v) =>
  typeof v === 'string' && v.length > 20 && v.length < 200 ? v : null;

const _SB_URL =
  _cfgSafeUrl(_cfgRaw.sbUrl) ||
  _cfgSafeUrl(import.meta.env?.VITE_SUPABASE_URL) ||
  '';
const _SB_KEY =
  _cfgSafeKey(_cfgRaw.sbKey) ||
  _cfgSafeKey(import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

const _SB_HEADERS = {
  apikey: _SB_KEY,
  Authorization: `Bearer ${_SB_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=minimal',
};

// ── Claves compartidas y prefijos ─────────────────────────────
const _SB_KEYS = [
  'siso_db_patients', 'siso_companies', 'siso_users',
  'siso_saved_bills', 'siso_saved_reports', 'siso_audit_log',
  'siso_mensajes', 'siso_agendados', 'siso_ai_config_provider',
  'siso_doctor_signature', 'siso_privacidad_aceptada',
  'siso_atenciones_cerradas', 'siso_arl_reportes',
];

const _SB_KEY_PREFIXES = [
  'siso_db_patients_', 'siso_companies_', 'siso_habeas_',
  'siso_patients_', 'siso_portal_', 'siso_adj_',
];

// ── Rate Limiting ─────────────────────────────────────────────
const _sbRl = { count: 0, reset: Date.now() + 60000 };

const _rlCheck = () => {
  const now = Date.now();
  if (now > _sbRl.reset) { _sbRl.count = 0; _sbRl.reset = now + 60000; }
  _sbRl.count++;
  if (_sbRl.count > 120) { console.warn('[SISO] Rate limit Supabase'); return false; }
  return true;
};

// ── Operaciones CRUD ──────────────────────────────────────────

/**
 * Upsert en Supabase siso_store.
 * @param {string} key
 * @param {*} value
 * @returns {Promise<boolean>}
 */
export const sbSet = async (key, value) => {
  if (!_rlCheck()) return false;
  try {
    const r = await fetch(`${_SB_URL}/rest/v1/siso_store`, {
      method: 'POST',
      headers: _SB_HEADERS,
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
    });
    return r.ok;
  } catch { return false; }
};

/**
 * Obtiene datos de Supabase para un usuario.
 * @param {string|null} userId
 * @returns {Promise<Object|null>}
 */
export const sbGetAll = async (userId) => {
  try {
    let url = `${_SB_URL}/rest/v1/siso_store?select=key,value,updated_at`;
    if (userId === 'all_patients') {
      url += '&key=ilike.siso_patients_%25';
    } else {
      let uList = userId ? (Array.isArray(userId) ? userId : [userId]) : [];
      if (uList.length === 0) {
        try {
          const s = _ls.getItem('siso_session');
          const session = s ? JSON.parse(s) : null;
          if (session?.user) uList.push(session.user);
        } catch {}
      }
      if (uList.length > 0) {
        const sharedKeys = ['siso_users', 'siso_companies_shared', 'siso_saved_bills',
          'siso_saved_reports', 'siso_audit_log', 'siso_mensajes', 'siso_ai_config_provider',
          'siso_doctor_signature', 'siso_privacidad_aceptada', 'siso_atenciones_cerradas',
          'siso_arl_reportes', 'siso_encuestas', 'siso_cotizaciones', 'siso_cartas_custodia'];
        const orParts = [
          `key.in.(${sharedKeys.join(',')})`,
          ...uList.map(u => `key.ilike.%25_${encodeURIComponent(u)}`),
        ];
        url += `&or=(${orParts.join(',')})`;
      }
    }
    const r = await fetch(url, { headers: _SB_HEADERS });
    if (!r.ok) return null;
    const rows = await r.json();
    const result = {};
    rows.forEach(row => { result[row.key] = { value: row.value, updatedAt: row.updated_at }; });
    return result;
  } catch { return null; }
};

/**
 * Elimina una clave de Supabase.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const sbDelete = async (key) => {
  try {
    const r = await fetch(`${_SB_URL}/rest/v1/siso_store?key=eq.${encodeURIComponent(key)}`, {
      method: 'DELETE', headers: _SB_HEADERS,
    });
    return r.ok;
  } catch { return false; }
};

/**
 * Marca una cita de agenda como "visto" desde HC.
 * @param {string} agendaId
 * @returns {Promise<boolean>}
 */
export const marcarAgendaVisto = async (agendaId) => {
  if (!agendaId) return false;
  try {
    const r = await fetch(`${_SB_URL}/rest/v1/siso_agendados?select=id`, {
      method: 'PATCH', headers: _SB_HEADERS,
      body: JSON.stringify({ estado: 'visto' }),
    });
    return r.ok;
  } catch { return false; }
};

/**
 * Guarda array completo en Supabase + localStorage.
 * @param {string} supabaseKey
 * @param {Array} data
 */
export const syncArrayToSupabase = async (supabaseKey, data) => {
  try { localStorage.setItem(supabaseKey, JSON.stringify(data)); } catch {}
  const ok = await sbSet(supabaseKey, data);
  return { ok: !!ok, source: ok ? 'supabase' : 'local-only' };
};

/**
 * Lee array desde Supabase con fallback localStorage.
 * @param {string} supabaseKey
 * @param {string} localKey
 */
export const readArrayFromSupabase = async (supabaseKey, localKey) => {
  try {
    const r = await fetch(`${_SB_URL}/rest/v1/siso_store?key=eq.${encodeURIComponent(supabaseKey)}&select=value`, {
      headers: { apikey: _SB_KEY, Authorization: `Bearer ${_SB_KEY}` },
    });
    if (r.ok) {
      const rows = await r.json();
      if (rows?.[0]?.value && Array.isArray(rows[0].value)) {
        try { localStorage.setItem(localKey || supabaseKey, JSON.stringify(rows[0].value)); } catch {}
        return rows[0].value;
      }
    }
  } catch {}
  try {
    const stored = JSON.parse(localStorage.getItem(localKey || supabaseKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch { return []; }
};

export { _SB_URL, _SB_KEY, _SB_HEADERS };