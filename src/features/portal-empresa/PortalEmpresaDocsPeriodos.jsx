// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalEmpresaDocsPeriodos Component
// FASE 4 — ETAPA O: Extraído de App.jsx L15297
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Visor de documentos por período para el portal de empresa.
 * @param {Object} props
 * @param {string} props.nitBusq
 * @param {Array} props.resultadosEmpresa
 */
export const PortalEmpresaDocsPeriodos = ({ nitBusq, resultadosEmpresa = [] }) => {
  if (!nitBusq) return null;

  const agrupados = {};
  resultadosEmpresa.forEach(r => {
    const periodo = r.periodo || 'Sin período';
    if (!agrupados[periodo]) agrupados[periodo] = [];
    agrupados[periodo].push(r);
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        Documentos por Período — NIT: {escapeHtml(nitBusq)}
      </h3>

      {Object.keys(agrupados).length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No se encontraron documentos</p>
      ) : (
        Object.entries(agrupados).map(([periodo, docs]) => (
          <div key={periodo} className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">{escapeHtml(periodo)}</h4>
            <div className="space-y-2">
              {docs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{escapeHtml(doc.tipo || 'Documento')}</p>
                    <p className="text-xs text-gray-500">{formatFechaCorta(doc.fecha)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    doc.estado === 'pagada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.estado || 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};