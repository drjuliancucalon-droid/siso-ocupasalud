// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — CIE11Badge Component
// FASE 4 — ETAPA P: Extraído de App.jsx L7286
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Badge que muestra código CIE-10/11 con estilo.
 * @param {Object} props
 * @param {string} props.cie10value - Código CIE
 * @param {string} props.className
 */
export const CIE11Badge = ({ cie10value, className = '' }) => {
  if (!cie10value) return null;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
      {cie10value}
    </span>
  );
};