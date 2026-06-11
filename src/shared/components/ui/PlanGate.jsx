// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PlanGate Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9556
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Gate de control de acceso por plan/rol.
 * @param {Object} props
 * @param {string} props.feature - Nombre de la funcionalidad requerida
 * @param {string} props.userRole - Rol del usuario actual
 * @param {Object} props.user - Objeto usuario completo
 * @param {React.ReactNode} props.children - Contenido a renderizar si tiene acceso
 * @param {React.ReactNode} props.fallback - Contenido si NO tiene acceso
 */
export const PlanGate = ({ feature, userRole, user, children, fallback = null }) => {
  const ROLES_WITH_ACCESS = {
    admin: ['usuarios', 'informes', 'facturacion', 'agenda', 'caja', 'custodia', 'contabilidad', 'encuestas', 'portal', 'configuracion'],
    medico: ['usuarios', 'informes', 'facturacion', 'agenda', 'caja', 'custodia', 'contabilidad', 'encuestas', 'portal'],
    digitador: ['informes', 'agenda'],
    empresa: ['portal'],
    recepcion: ['agenda'],
  };

  const allowedRoles = ROLES_WITH_ACCESS[feature] || [];
  const hasAccess = userRole === 'admin' || allowedRoles.includes(userRole);

  if (!hasAccess) return fallback;
  return children;
};