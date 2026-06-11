// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Constantes de Claves de Almacenamiento
// FASE 4 — ETAPA A: Todas las claves en un solo lugar
// ═══════════════════════════════════════════════════════════════

// ── LOCALSTORAGE (persistente) ─────────────────────────────────

export const LS = {
  // Sesión y usuarios
  SESSION: 'siso_session',
  USERS: 'siso_users',
  ACTIVE_FORM: 'siso_active_form',
  AUTOSAVE_PREFIX: 'siso_autosave_',

  // Pacientes y empresas (per-user)
  PATIENTS_PREFIX: 'siso_db_patients_',
  COMPANIES_PREFIX: 'siso_companies_',

  // HC y atenciones
  ATENCIONES_CERRADAS: 'siso_atenciones_cerradas',
  ATENCIONES_VERSION: 'siso_atenciones_v',
  ATENCIONES_PREFIX: 'siso_atenciones_',

  // Portal
  PORTAL_PREFIX: 'siso_portal_',

  // Firma y configuración
  DOCTOR_SIGNATURE: 'siso_doctor_signature',
  AI_CONFIG_PROVIDER: 'siso_ai_config_provider',
  AI_CONFIG_VERSION: 'siso_ai_config_version',
  AI_CONFIG_PROVIDER_PREFIX: 'siso_ai_config_provider_',
  AI_KEYS_PREFIX: 'siso_ai_keys_',
  AI_KEYS: 'siso_ai_keys',
  AI_CALLS_COUNT: 'siso_ai_calls_count',
  EMAIL_CONFIG: 'siso_email_config',
  EMAIL_CONFIG_PREFIX: 'siso_email_config_',

  // Facturación e informes
  BILLS_PREFIX: 'siso_saved_bills_',
  BILLS: 'siso_saved_bills',
  REPORTS: 'siso_saved_reports',
  INFORMES: 'siso_informes',
  INFORMES_PREFIX: 'siso_informes_',

  // Caja
  CAJA: 'siso_caja',
  CAJA_PREFIX: 'siso_caja_',
  CAJA_MOVS: 'siso_caja_movs',

  // Cartas custodia
  CARTAS_CUSTODIA: 'siso_cartas_custodia',

  // Encuestas
  ENCUESTAS: 'siso_encuestas',

  // Seguridad
  AUDIT_LOG: 'siso_audit_log',
  ERROR_LOG: 'siso_error_log',
  RL_LOGIN: 'siso_rl_login',
  LOGIN_ATTEMPTS: 'siso_login_attempts',
  LOGIN_BLOCKED_UNTIL: 'siso_login_blocked_until',
  PRIVACIDAD_ACEPTADA: 'siso_privacidad_aceptada',
  ADMIN_CODE_HASH: 'siso_admin_code_hash',

  // Sincronización
  LAST_SYNC_TS: 'siso_last_sync_ts',
  D1_PUSH_FLAG_PREFIX: 'siso_d1_push_flag_',
  HC_PUSH_FLAG_PREFIX: 'siso_hc_push_flag_',
  DATA_FIX_V2: 'siso_data_fix_v2',

  // Medicamentos
  CUSTOM_MEDS: 'siso_custom_meds',

  // Otros
  HABEAS_REQUESTS: 'siso_habeas_requests',
  TELECONSULTAS: 'siso_teleconsultas',
  PORTAFOLIO: 'siso_portafolio',
  COTIZACIONES: 'siso_cotizaciones',
  MEDICO_TURNO: 'siso_medico_turno',
  ORGS_LIST: 'siso_orgs_list',
  COMPANIES: 'siso_companies',
  COMPANIES_SHARED: 'siso_companies_shared',
};

// ── SESSIONSTORAGE (se limpia al cerrar) ───────────────────────

export const SS = {
  AI_KEYS: 'siso_ai_keys',
  AI_KEYS_PREFIX: 'siso_ai_keys_',
  DIAN_APIKEY: 'siso_dian_apikey',
  ENCRYPT_KEY: 'siso_encrypt_key',
};

// ── INDEXEDDB ─────────────────────────────────────────────────

export const IDB = {
  DB_NAME: 'siso_offline_db',
  DB_VERSION: 1,
  STORES: {
    KV: 'kv_store',
    SYNC_QUEUE: 'sync_queue',
    AUDIT_QUEUE: 'audit_queue',
    SYNC_META: 'sync_meta',
  },
};

// ── D1 (Cloudflare) — Prefijos de claves ──────────────────────

export const D1 = {
  KEY_PREFIXES: [
    'siso_db_patients_',
    'siso_companies_',
    'siso_patients_',
    'siso_habeas_',
    'siso_portal_',
    'siso_adj_',
    'siso_ai_keys_',
    'siso_caja_',
    'siso_saved_bills_',
    'siso_informes_',
    'siso_atenciones_',
    'siso_encuestas_',
  ],
  SHARED_KEYS: [
    'siso_users',
    'siso_companies_shared',
    'siso_saved_bills',
    'siso_saved_reports',
    'siso_audit_log',
    'siso_mensajes',
    'siso_ai_config_provider',
    'siso_doctor_signature',
    'siso_privacidad_aceptada',
    'siso_atenciones_cerradas',
    'siso_arl_reportes',
    'siso_encuestas',
    'siso_cotizaciones',
    'siso_cartas_custodia',
  ],
};

// ── HELPERS ───────────────────────────────────────────────────

/**
 * Genera clave de pacientes para un usuario específico.
 * @param {string} userId
 * @returns {string} Clave localStorage
 */
export const patKey = (userId) => `${LS.PATIENTS_PREFIX}${userId}`;

/**
 * Genera clave cloud de pacientes para un usuario.
 * @param {string} userId
 * @returns {string} Clave D1/Supabase
 */
export const patKeyCloud = (userId) => `siso_patients_${userId}`;

/**
 * Genera clave de empresas para un usuario.
 * @param {string} userId
 * @returns {string} Clave localStorage
 */
export const compKey = (userId) => `${LS.COMPANIES_PREFIX}${userId}`;

/**
 * Genera clave cloud de empresas para un usuario.
 * @param {string} userId
 * @returns {string} Clave D1/Supabase
 */
export const compKeyCloud = (userId) => `siso_companies_${userId}`;

/**
 * Genera clave de autosave para un paciente.
 * @param {string} patientId
 * @returns {string} Clave localStorage
 */
export const autosaveKey = (patientId) => `${LS.AUTOSAVE_PREFIX}${patientId}`;

/**
 * Genera clave de facturas para un usuario.
 * @param {string} userId
 * @returns {string} Clave localStorage
 */
export const billsKey = (userId) => `${LS.BILLS_PREFIX}${userId}`;

/**
 * Genera clave de caja para un sufijo.
 * @param {string} suffix
 * @returns {string} Clave localStorage
 */
export const cajaKey = (suffix) => `${LS.CAJA_PREFIX}${suffix}`;

/**
 * Verifica si una clave debe sincronizarse con D1.
 * @param {string} key
 * @returns {boolean}
 */
export const shouldSyncToD1 = (key) => {
  return (
    D1.SHARED_KEYS.includes(key) ||
    D1.KEY_PREFIXES.some((p) => key.startsWith(p)) ||
    key.startsWith('siso_')
  );
};