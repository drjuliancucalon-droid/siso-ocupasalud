// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalInformeViewer Component
// FASE 4 — ETAPA O: Extraído de App.jsx L15028
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Visor de informes para el portal de empresa.
 * @param {Object} props
 * @param {Object} props.informe
 * @param {string} props.empresaNombre
 */
export const PortalInformeViewer = ({ informe, empresaNombre }) => {
  if (!informe) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Informe Periódico</h3>
        <p className="text-sm text-gray-500">{escapeHtml(empresaNombre)}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Periodo:</span>
            <span className="ml-2">{escapeHtml(informe.periodo || '')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Fecha:</span>
            <span className="ml-2">{formatFechaCorta(informe.fecha)}</span>
          </div>
        </div>

        {informe.resumen && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Resumen:</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">{escapeHtml(informe.resumen)}</p>
            </div>
          </div>
        )}

        {informe.estadisticas && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Estadísticas:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-lg font-bold text-blue-700">{informe.estadisticas.total || 0}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-lg font-bold text-green-700">{informe.estadisticas.aptos || 0}</div>
                <div className="text-xs text-green-600">Aptos</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="text-lg font-bold text-red-700">{informe.estadisticas.noAptos || 0}</div>
                <div className="text-xs text-red-600">No Aptos</div>
              </div>
            </div>
          </div>
        )}

        {informe.observaciones && (
          <div className="mt-4">
            <span className="font-medium text-gray-700">Observaciones:</span>
            <p className="mt-1 text-gray-600">{escapeHtml(informe.observaciones)}</p>
          </div>
        )}
      </div>
    </div>
  );
};