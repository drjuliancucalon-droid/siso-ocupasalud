// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalCuentaCobroCard Component
// FASE 4 — ETAPA O: Extraído de App.jsx L14407
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta, formatMoneda } from '../../shared/utils/formatters.js';

/**
 * Tarjeta de cuenta de cobro para el portal.
 * @param {Object} props
 * @param {Object} props.cuenta
 * @param {string} props.empresaNombre
 * @param {string} props.periodo
 */
export const PortalCuentaCobroCard = ({ cuenta, empresaNombre, periodo }) => {
  if (!cuenta) return null;

  const total = (cuenta.items || []).reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Cuenta de Cobro</h3>
          <p className="text-sm text-gray-500">{escapeHtml(empresaNombre)} - {escapeHtml(periodo)}</p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            cuenta.estado === 'pagada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {cuenta.estado || 'Pendiente'}
          </span>
        </div>
      </div>

      {cuenta.items && cuenta.items.length > 0 && (
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border">Descripción</th>
              <th className="text-right p-2 border">Valor</th>
            </tr>
          </thead>
          <tbody>
            {cuenta.items.map((item, i) => (
              <tr key={i}>
                <td className="p-2 border">{escapeHtml(item.descripcion || '')}</td>
                <td className="p-2 border text-right">{formatMoneda(item.valor)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td className="p-2 border">Total</td>
              <td className="p-2 border text-right">{formatMoneda(total)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className="text-xs text-gray-500">
        <p>Fecha de emisión: {formatFechaCorta(cuenta.fecha)}</p>
        {cuenta.fechaVencimiento && <p>Vencimiento: {formatFechaCorta(cuenta.fechaVencimiento)}</p>}
      </div>
    </div>
  );
};