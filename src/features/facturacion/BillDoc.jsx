// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — BillDoc Component
// FASE 4 — ETAPA P: Extraído de App.jsx L14481
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta, formatMoneda } from '../../shared/utils/formatters.js';

/**
 * Documento de factura para impresión.
 * @param {Object} props
 * @param {Object} props.cuenta
 * @param {string} props.empresaNombre
 */
export const BillDoc = ({ cuenta, empresaNombre }) => {
  if (!cuenta) return null;

  const total = (cuenta.items || []).reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">FACTURA</h2>
        <p className="text-sm text-gray-500">{escapeHtml(empresaNombre)}</p>
        <p className="text-xs text-gray-400">No. {escapeHtml(cuenta.numero || cuenta.id || '')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p><strong>Fecha:</strong> {formatFechaCorta(cuenta.fecha)}</p>
          <p><strong>Empresa:</strong> {escapeHtml(empresaNombre)}</p>
        </div>
        <div>
          <p><strong>NIT:</strong> {escapeHtml(cuenta.nit || '')}</p>
          <p><strong>Estado:</strong> {escapeHtml(cuenta.estado || 'Pendiente')}</p>
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

      {cuenta.observaciones && (
        <div className="text-sm text-gray-600">
          <strong>Observaciones:</strong> {escapeHtml(cuenta.observaciones)}
        </div>
      )}
    </div>
  );
};