// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — DoctorSignature Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9345
// ═══════════════════════════════════════════════════════════════

import React from 'react';

export const DoctorSignature = ({ signature, data, showData = true }) => {
  if (!signature && !data) return null;
  return (
    <div className="border-t border-gray-200 pt-4 mt-6">
      <div className="flex items-start gap-4">
        {signature && (
          <div className="text-center">
            <img src={signature} alt="Firma" className="h-16 mx-auto" />
            <div className="w-48 border-t border-gray-400 mt-1 mx-auto"></div>
          </div>
        )}
        {showData && data && (
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{data.nombre || 'Dr(a).'}</p>
            <p>{data.especialidad || 'Médico Ocupacional'}</p>
            <p>{data.licencia ? `Lic. ${data.licencia}` : ''}</p>
            <p>{data.documento || ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};