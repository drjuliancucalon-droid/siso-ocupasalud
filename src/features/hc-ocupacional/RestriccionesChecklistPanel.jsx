// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — RestriccionesChecklistPanel Component
// FASE 4 — ETAPA P: Extraído de App.jsx L5956
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';

/**
 * Panel de checklist de restricciones médicas.
 * @param {Object} props
 * @param {Array} props.restricciones - Lista de restricciones disponibles
 * @param {Array} props.selected - Restricciones seleccionadas
 * @param {Function} props.onChange - Callback al cambiar selección
 * @param {string} props.title
 */
export const RestriccionesChecklistPanel = ({
  restricciones = [],
  selected = [],
  onChange,
  title = 'Restricciones Médicas'
}) => {
  const toggleItem = (item) => {
    const newList = selected.includes(item)
      ? selected.filter(s => s !== item)
      : [...selected, item];
    if (onChange) onChange(newList);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {restricciones.map((r, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selected.includes(r)}
              onChange={() => toggleItem(r)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">{escapeHtml(r)}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {selected.length} restricción(es) seleccionada(s)
        </div>
      )}
    </div>
  );
};