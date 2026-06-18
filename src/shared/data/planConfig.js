// src/shared/data/planConfig.js — Configuración de planes/licencias
// Fuente de verdad para limitaciones por plan
// Replicado del monolito (líneas ~8930)

export const PLAN_CONFIG = {
  libre: {
    label: 'Libre',
    maxHC: 8,
    maxPacientes: 20,
    features: ['pacientes', 'hc-ocupacional', 'hc-general', 'agenda'],
  },
  basico: {
    label: 'Básico',
    maxHC: 50,
    maxPacientes: 100,
    features: ['pacientes', 'hc-ocupacional', 'hc-general', 'agenda', 'empresas'],
  },
  profesional: {
    label: 'Profesional',
    maxHC: 200,
    maxPacientes: 500,
    features: ['pacientes', 'hc-ocupacional', 'hc-general', 'agenda', 'empresas', 'facturacion', 'caja', 'reportes'],
  },
  clinica: {
    label: 'Clínica',
    maxHC: 9999,
    maxPacientes: 99999,
    features: ['*'], // Todas las features
  },
};

export const SECRETARIA_PERMISOS_DEFAULT = {
  agenda: false,
  bill: false,
  propuestas: false,
  telemedicina: false,
  empresas: false,
  pacientes_lista: false,
  reporte: false,
  sve: false,
  caja: false,
  adjuntos: false,
  cuentas_cobro: false,
  pacientes_crear: false,
};

/**
 * Verifica si un usuario puede usar una feature según su plan
 */
export function _canUse(feature, user) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;

  const plan = user.license || 'libre';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.libre;

  if (config.features.includes('*')) return true;
  return config.features.includes(feature);
}

/**
 * Verifica si una secretaria puede acceder a un módulo
 */
export function _secretariaPuede(feature, user, usersList = []) {
  if (!user) return false;
  if (user.role !== 'secretaria') return true;

  const userObj = usersList?.find(u => u.user === user.user || u.id === user.id);
  const permisos = userObj?.secretariaPermisos || user?.secretariaPermisos || SECRETARIA_PERMISOS_DEFAULT;
  return permisos[feature] === true;
}