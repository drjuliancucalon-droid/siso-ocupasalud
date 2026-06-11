// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — CIE10Input Component
// FASE 4 — ETAPA O: Extraído de App.jsx L8329
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Input autocompletado para códigos CIE-10.
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {string} props.name
 * @param {string} props.placeholder
 * @param {string} props.className
 */
export const CIE10Input = ({ value, onChange, name = 'cie10', placeholder = 'Código CIE-10...', className = '' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const CIE10_CODES = [
    { code: 'Z00.0', desc: 'Examen médico general' },
    { code: 'Z01.0', desc: 'Examen de ojos y vista' },
    { code: 'Z01.1', desc: 'Examen de oídos' },
    { code: 'Z01.2', desc: 'Examen odontológico' },
    { code: 'Z01.3', desc: 'Examen de presión sanguínea' },
    { code: 'Z01.8', desc: 'Otros exámenes especiales' },
    { code: 'Z02.0', desc: 'Examen de admisión' },
    { code: 'Z02.1', desc: 'Examen de preempleo' },
    { code: 'Z02.2', desc: 'Examen de admisión a la escuela' },
    { code: 'Z02.3', desc: 'Examen de admisión a la institución' },
    { code: 'Z02.4', desc: 'Examen de licencia de conducir' },
    { code: 'Z02.5', desc: 'Examen de participación en deportes' },
    { code: 'Z02.6', desc: 'Examen de aseguramiento' },
    { code: 'Z02.7', desc: 'Examen de discapacidad' },
    { code: 'Z02.8', desc: 'Otros exámenes de admisión' },
    { code: 'Z02.9', desc: 'Examen de admisión, sin especificación' },
    { code: 'Z71.0', desc: 'Asesoría sobre dieta' },
    { code: 'Z71.2', desc: 'Asesoría médica' },
    { code: 'Z71.3', desc: 'Asesoría sobre hábitos alimentarios' },
    { code: 'Z71.4', desc: 'Asesoría sobre abuso de alcohol' },
    { code: 'Z71.5', desc: 'Asesoría sobre abuso de drogas' },
    { code: 'Z71.6', desc: 'Asesoría sobre tabaquismo' },
    { code: 'Z71.7', desc: 'Asesoría sobre VIH' },
    { code: 'Z71.8', desc: 'Otras asesorías' },
    { code: 'Z71.9', desc: 'Asesoría, sin especificación' },
  ];

  useEffect(() => {
    if (value && value.length >= 2) {
      const filtered = CIE10_CODES.filter(c =>
        c.code.toLowerCase().includes(value.toLowerCase()) ||
        c.desc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSelect = (code) => {
    onChange({ target: { value: code.code, name } });
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        name={name}
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
              <span className="font-mono text-blue-600">{escapeHtml(s.code)}</span>
              <span className="ml-2 text-gray-600">{escapeHtml(s.desc)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};