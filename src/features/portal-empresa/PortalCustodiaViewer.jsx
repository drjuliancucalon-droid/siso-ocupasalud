// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalCustodiaViewer Component
// FASE 4 — ETAPA O: Extraído de App.jsx L14194
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Visor de cartas de custodia para el portal de empresa.
 * @param {Object} props
 * @param {Object} props.custodia - Datos de la carta
 * @param {string} props.empresaNombre
 * @param {string} props.periodo
 */
export const PortalCustodiaViewer = ({ custodia, empresaNombre, periodo }) => {
  if (!custodia) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Carta de Custodia</h3>
        <p className="text-sm text-gray-500">{escapeHtml(empresaNombre)} - {escapeHtml(periodo)}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Fecha:</span>
            <span className="ml-2">{formatFechaCorta(custodia.fecha)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Responsable:</span>
            <span className="ml-2">{escapeHtml(custodia.responsable || '')}</span>
          </div>
        </div>

        {custodia.items && custodia.items.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Elementos entregados:</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border">Descripción</th>
                  <th className="text-left p-2 border">Cantidad</th>
                  <th className="text-left p-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {custodia.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{escapeHtml(item.descripcion || '')}</td>
                    <td className="p-2 border">{item.cantidad || 1}</td>
                    <td className="p-2 border">{escapeHtml(item.estado || 'Bueno')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {custodia.observaciones && (
          <div className="mt-4">
            <span className="font-medium text-gray-700">Observaciones:</span>
            <p className="mt-1 text-gray-600">{escapeHtml(custodia.observaciones)}</p>
          </div>
        )}
      </div>
    </div>
  );
};