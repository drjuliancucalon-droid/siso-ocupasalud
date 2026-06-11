// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — FormulaDerivacionSection Component
// FASE 4 — ETAPA P: Extraído de App.jsx L11197
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';

/**
 * Sección de fórmula médica y derivación.
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Function} props.onChange
 */
export const FormulaDerivacionSection = ({ formData, onChange }) => {
  const [medicamentos, setMedicamentos] = useState(formData?.medicamentos || []);
  const [newMed, setNewMed] = useState('');

  const addMedicamento = () => {
    if (!newMed.trim()) return;
    const updated = [...medicamentos, newMed.trim()];
    setMedicamentos(updated);
    setNewMed('');
    if (onChange) onChange({ ...formData, medicamentos: updated });
  };

  const removeMedicamento = (index) => {
    const updated = medicamentos.filter((_, i) => i !== index);
    setMedicamentos(updated);
    if (onChange) onChange({ ...formData, medicamentos: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fórmula Médica</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            placeholder="Agregar medicamento..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicamento())}
          />
          <button
            type="button"
            onClick={addMedicamento}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            +
          </button>
        </div>
        {medicamentos.length > 0 && (
          <div className="mt-2 space-y-1">
            {medicamentos.map((med, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{escapeHtml(med)}</span>
                <button
                  type="button"
                  onClick={() => removeMedicamento(i)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Derivación</label>
        <textarea
          value={formData?.derivacion || ''}
          onChange={(e) => onChange && onChange({ ...formData, derivacion: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="Especificaciones de derivación..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
        <textarea
          value={formData?.indicaciones || ''}
          onChange={(e) => onChange && onChange({ ...formData, indicaciones: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="Indicaciones adicionales..."
        />
      </div>
    </div>
  );
};