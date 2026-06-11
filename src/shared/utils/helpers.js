// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Helper Functions
// FASE 4 — ETAPA O: Extraído de App.jsx (funciones misc)
// ═══════════════════════════════════════════════════════════════

import { escapeHtml } from './sanitize.js';

/**
 * Genera un ID de organización a partir del nombre.
 * Extraído de App.jsx L900
 */
export const genOrgId = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
};

/**
 * Verifica si un secretario puede acceder a una funcionalidad.
 * Extraído de App.jsx L998
 */
export const secretariaMedicoAsignado = (currentUser, medicoId, users) => {
  if (!currentUser || !users) return false;
  if (currentUser.role === 'admin') return true;
  if (currentUser.role === 'secretaria') {
    const medico = users.find(u => u.user === medicoId);
    return medico && medico.secretaria === currentUser.user;
  }
  return false;
};

/**
 * Detecta el tipo de examen a partir del nombre y texto.
 * Extraído de App.jsx L1798
 */
export const detectarTipoExamen = (fn, txt) => {
  const text = (fn || '') + ' ' + (txt || '');
  const lower = text.toLowerCase();
  if (lower.includes('ingreso') || lower.includes('preempleo')) return 'Ingreso';
  if (lower.includes('retiro') || lower.includes('postempleo')) return 'Retiro';
  if (lower.includes('cambio')) return 'Cambio de puesto';
  if (lower.includes('reingreso')) return 'Reingreso';
  if (lower.includes('periodico') || lower.includes('periódico')) return 'Periódico';
  if (lower.includes('control')) return 'Control';
  if (lower.includes('alta')) return 'Alta';
  return 'Ocupacional';
};

/**
 * Verifica si los datos necesitan corrección.
 * Extraído de App.jsx L18973
 */
export const needsDataFix = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) {
    return data.some(item => !item.id || !item.nombres);
  }
  return !data.id || !data.nombres;
};

/**
 * Aplica sync desde cloud.
 * Extraído de App.jsx L19023
 */
export const applyCloud = (key, setter, fallback, localKey) => {
  try {
    const cloudData = sp(key, null);
    if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
      setter(cloudData);
      if (localKey) {
        _ls.setItem(localKey, JSON.stringify(cloudData));
      }
      return true;
    }
    return false;
  } catch (e) {
    console.warn('applyCloud error:', e);
    return false;
  }
};

/**
 * Genera HTML de email.
 * Extraído de App.jsx L17262
 */
export const generarEmailHTML = (asunto, contenido, firma) => {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#065f46;color:white;padding:15px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:18px;">OCUPASALUD</h1>
        <p style="margin:5px 0 0;font-size:12px;">Sistema de Historias Clínicas Ocupacionales</p>
      </div>
      <div style="background:white;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
        <h2 style="color:#1f2937;font-size:16px;">${escapeHtml(asunto)}</h2>
        <div style="color:#374151;font-size:14px;line-height:1.6;">
          ${contenido}
        </div>
        ${firma ? `<div style="margin-top:20px;padding-top:15px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">${firma}</div>` : ''}
      </div>
    </div>
  `;
};