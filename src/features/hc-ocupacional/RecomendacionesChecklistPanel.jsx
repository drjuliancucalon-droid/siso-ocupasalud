// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — RecomendacionesChecklistPanel Component
// FASE 4 — ETAPA P: Extraído de App.jsx L10902
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';

/**
 * Panel de checklist de recomendaciones médicas.
 * @param {Object} props
 * @param {Array} props.recomendaciones
 * @param {Array} props.selected
 * @param {Function} props.onChange
 * @param {string} props.title
 */
export const RecomendacionesChecklistPanel = ({
  recomendaciones = [],
  selected = [],
  onChange,
  title = 'Recomendaciones Médicas'
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
        {recomendaciones.map((r, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selected.includes(r)}
              onChange={() => toggleItem(r)}
              className="h-4 w-4 text-green-600 rounded"
            />
            <span className="text-sm text-gray-700">{escapeHtml(r)}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {selected.length} recomendación(es) seleccionada(s)
        </div>
      )}
    </div>
  );
};