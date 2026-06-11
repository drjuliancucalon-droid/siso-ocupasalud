// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Sanitización de Inputs
// Extraído de src/App.jsx (FASE 4 — ETAPA A)
// ═══════════════════════════════════════════════════════════════

/**
 * Sanitiza un string escapando caracteres HTML para prevenir XSS.
 * @param {*} str - Valor a sanitizar
 * @returns {string} String escapado
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[&]/g, '&')
    .replace(/[<]/g, '<')
    .replace(/[>]/g, '>')
    .replace(/["]/g, '"')
    .replace(/[']/g, '&#x27;')
    .replace(/[\/]/g, '&#x2F;')
    .trim();
};

/**
 * Escape suave: solo escapa &, <, > para HTML.
 * Función unificada (antes duplicada en _generarHCPortalHTML y _printHCClean).
 * @param {*} v - Valor a escapar
 * @returns {string} String escapado
 */
export const escapeHtml = (v) => {
  return String(v == null ? "" : v)
    .replace(/[&]/g, '&')
    .replace(/[<]/g, '<')
    .replace(/[>]/g, '>');
};

/**
 * Escape fuerte para atributos HTML (escapa también comillas).
 * @param {*} v - Valor a escapar
 * @returns {string} String escapado para atributos
 */
export const escapeAttr = (v) => {
  return String(v == null ? "" : v)
    .replace(/[&]/g, '&')
    .replace(/[<]/g, '<')
    .replace(/[>]/g, '>')
    .replace(/["]/g, '"')
    .replace(/[']/g, '&#x27;');
};

/**
 * Sanitización simple: solo trim y null safety.
 * @param {*} str - Valor a sanitizar
 * @returns {string} String trimmed
 */
export const sanitizeSimple = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};

/**
 * Convierte saltos de línea a br (con escape HTML previo).
 * @param {*} v - Valor a procesar
 * @returns {string} HTML con br
 */
export const nl2br = (v) => {
  return escapeHtml(v).replace(/\n/g, '<br/>');
};

/**
 * Limpia un string de caracteres de control para JSON.
 * @param {string} s - String a limpiar
 * @returns {string} String limpio
 */
export const cleanControlChars = (s) => {
  if (typeof s !== 'string') return s;
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};