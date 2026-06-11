// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — MedicamentoAutocomplete Component
// FASE 4 — ETAPA O: Extraído de App.jsx L11052
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Autocomplete de medicamentos.
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {Array} props.medicamentos - Lista de medicamentos
 * @param {string} props.placeholder
 */
export const MedicamentoAutocomplete = ({ value, onChange, medicamentos = [], placeholder = 'Buscar medicamento...' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value && value.length >= 2) {
      const filtered = medicamentos.filter(m =>
        (m.nombre || m).toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, medicamentos]);

  const handleSelect = (med) => {
    const name = typeof med === 'string' ? med : med.nombre || med;
    onChange({ target: { value: name, name: 'medicamento' } });
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
        onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
            >
              {escapeHtml(typeof s === 'string' ? s : s.nombre || s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};