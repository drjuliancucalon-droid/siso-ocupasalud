// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Constantes Globales
// Extraído de src/App.jsx (FASE 4 — ETAPA A)
// ═══════════════════════════════════════════════════════════════

// ── Sesión y Timeout ──────────────────────────────────────────
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos

// ── IA ────────────────────────────────────────────────────────
export const AI_CONFIG_VERSION = "2026-03-v2";

// ── Almacenamiento ────────────────────────────────────────────
export const LS_MAX_QUOTA_MB = 5;

// ── URLs y Orígenes ───────────────────────────────────────────
export const SISO_DEFAULT_ORIGIN = "https://ocupasaludparadesplegar.pages.dev";

/**
 * Obtiene el origen estable del portal
 * @returns {string} URL base del portal
 */
export const sisoStableOrigin = () => {
  const u = typeof window !== 'undefined' ? window.location.origin : SISO_DEFAULT_ORIGIN;
  return u;
};

// ── Medicamentos Base Colombia ────────────────────────────────
export const MEDICAMENTOS_CO_BASE = [
  { nombre: "Acetaminofén", presentacion: "500 mg", dosis: "1 cada 8 horas" },
  { nombre: "Ibuprofeno", presentacion: "400 mg", dosis: "1 cada 8 horas" },
  { nombre: "Loratadina", presentacion: "10 mg", dosis: "1 cada 24 horas" },
  { nombre: "Omeprazol", presentacion: "20 mg", dosis: "1 cada 24 horas" },
  { nombre: "Losartán", presentacion: "50 mg", dosis: "1 cada 12 horas" },
  { nombre: "Metformina", presentacion: "850 mg", dosis: "1 cada 12 horas" },
  { nombre: "Enalapril", presentacion: "10 mg", dosis: "1 cada 12 horas" },
  { nombre: "Amlodipino", presentacion: "5 mg", dosis: "1 cada 24 horas" },
  { nombre: "Atorvastatina", presentacion: "10 mg", dosis: "1 cada 24 horas" },
  { nombre: "Salbutamol", presentacion: "100 mcg inhalador", dosis: "2 puff cada 6-8 horas PRN" },
];

// ── Meses en Español ──────────────────────────────────────────
export const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

// ── Tipos de Examen ───────────────────────────────────────────
export const TIPOS_EXAMEN = [
  "INGRESO", "PERIODICO", "EGRESO", "POST-INCAPACIDAD",
  "ALTERNANCIA", "PUESTO TRABAJO", "PRUEBA PSICOLOGICA",
  "OSTEO-MUSCULAR", "VISIOMETRIA", "CARDIOVASCULAR",
  "NEUROLOGICO", "CONDICIONES FISICAS",
];

// ── Conceptos de Aptitud ──────────────────────────────────────
export const CONCEPTOS_APTITUD = [
  "APTO",
  "APTO CON RECOMENDACIONES",
  "APTO CON RESTRICCIONES",
  "APTO CON RECOMENDACIONES Y RESTRICCIONES",
  "NO APTO",
  "APTO CON OBSERVACIONES",
  "PENDIENTE",
];

// ── Roles de Usuario ──────────────────────────────────────────
export const ROLES = {
  ADMIN: "administrador",
  SUPER_ADMIN: "super_admin",
  MEDICO: "medico",
  ADMIN_EMPRESA: "admin_empresa",
  SECRETARIA: "secretaria",
};

// ── Features del Sistema ──────────────────────────────────────
export const FEATURES = {
  PACIENTES: "pacientes",
  HC_OCUPACIONAL: "hc-ocupacional",
  HC_GENERAL: "hc-general",
  PORTAL_EMPRESA: "portal-empresa",
  FACTURACION: "facturacion",
  INFORMES: "informes",
  AGENDA: "agenda",
  CAJA: "caja",
  CUSTODIA: "custodia",
  CONTABILIDAD: "contabilidad",
  USERS: "users",
  DASHBOARD: "dashboard",
  PLANES: "planes",
  ANALISIS_DOCS: "analisis-docs",
};

// ── Versiones de Datos ────────────────────────────────────────
export const ATENCIONES_VERSION = "2";

// ═══════════════════════════════════════════════════════════════
// Fin de constants.js
// ═══════════════════════════════════════════════════════════════