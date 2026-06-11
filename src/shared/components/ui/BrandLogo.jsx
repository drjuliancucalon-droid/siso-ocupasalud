// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — BrandLogo Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9394
// ═══════════════════════════════════════════════════════════════

import React from 'react';

export const BrandLogo = ({ data }) => {
  return (
    <div className="text-center mb-4">
      <h1 className="text-xl font-bold text-blue-700">OCUPASALUD</h1>
      <p className="text-xs text-gray-500">Sistema de Historias Clínicas Ocupacionales</p>
      {data?.empresaNombre && (
        <p className="text-sm font-semibold text-gray-700 mt-1">{data.empresaNombre}</p>
      )}
    </div>
  );
};