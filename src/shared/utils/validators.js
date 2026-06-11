// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Validadores
// Extraído de src/App.jsx (FASE 4 — ETAPA A)
// ═══════════════════════════════════════════════════════════════

/**
 * Valida la fortaleza de una contraseña.
 * @param {string} password - Contraseña a validar
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  if (!password || password.length < 8) errors.push('Minimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayuscula');
  if (!/[a-z]/.test(password)) errors.push('Al menos una minuscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un numero');
  return { valid: errors.length === 0, errors };
};

/**
 * Analiza valor de presión arterial y devuelve clasificación.
 * @param {string} v - Valor en formato "120/80"
 * @returns {string} Clasificación
 */
export const analyzeBP = (v) => {
  if (!v || !v.includes('/')) return 'No registrada';
  const [s, d] = v.split('/').map(Number);
  if (s >= 180 || d >= 120) return 'Crisis hipertensiva';
  if (s >= 140 || d >= 90) return 'Hipertension etapa 2';
  if (s >= 130 || d >= 80) return 'Hipertension etapa 1';
  if (s >= 120) return 'Presion elevada';
  if (s < 90 || d < 60) return 'Hipotension';
  return 'Normal';
};

/**
 * Analiza frecuencia cardíaca.
 * @param {string|number} v - Valor numérico
 * @returns {string} Clasificación
 */
export const analyzeHR = (v) => {
  const n = Number(v);
  if (!n) return 'No registrada';
  if (n > 100) return 'Taquicardia';
  if (n < 60) return 'Bradicardia';
  return 'Normal';
};

/**
 * Calcula y clasifica IMC.
 * @param {string|number} v - Valor numérico
 * @returns {string} Clasificación
 */
export const analyzeBMI = (v) => {
  const n = Number(v);
  if (!n) return 'No registrado';
  if (n >= 40) return 'Obesidad grado III (morbida)';
  if (n >= 35) return 'Obesidad grado II';
  if (n >= 30) return 'Obesidad grado I';
  if (n >= 27) return 'Sobrepeso (riesgo)';
  if (n >= 25) return 'Sobrepeso';
  if (n >= 18.5) return 'Normal';
  if (n < 18) return 'Bajo peso (delgadez)';
  return 'Bajo peso';
};

/**
 * Valida formato de correo electrónico básico.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * Valida NIT colombiano (formato básico).
 * @param {string} nit
 * @returns {boolean}
 */
export const isValidNIT = (nit) => {
  if (!nit) return false;
  const clean = nit.replace(/[^0-9]/g, '');
  return clean.length >= 5 && clean.length <= 15;
};

/**
 * Valida número de documento colombiano (cédula).
 * @param {string} doc
 * @returns {boolean}
 */
export const isValidDocument = (doc) => {
  if (!doc) return false;
  const clean = doc.replace(/[^0-9]/g, '');
  return clean.length >= 5 && clean.length <= 12;
};

/**
 * Valida que un string no esté vacío después de trim.
 * @param {*} v
 * @returns {boolean}
 */
export const isNotEmpty = (v) => {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  return true;
};

/**
 * Valida fecha de nacimiento (no futura, rango razonable).
 * @param {string} fechaStr - Formato YYYY-MM-DD
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBirthDate = (fechaStr) => {
  if (!fechaStr) return { valid: false, error: 'Fecha requerida' };
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return { valid: false, error: 'Fecha invalida' };
  if (d > new Date()) return { valid: false, error: 'Fecha futura' };
  if (d < new Date('1900-01-01')) return { valid: false, error: 'Fecha muy antigua' };
  return { valid: true };
};