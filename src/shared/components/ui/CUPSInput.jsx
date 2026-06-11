// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — CUPSInput Component
// FASE 4 — ETAPA O: Extraído de App.jsx L7764
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Input autocompletado para códigos CUPS.
 * @param {Object} props
 * @param {string} props.value - Valor actual
 * @param {Function} props.onChange - Callback de cambio
 * @param {string} props.placeholder
 * @param {string} props.className
 */
export const CUPSInput = ({ value, onChange, placeholder = 'Código CUPS...', className = '' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const CUPS_CODES = [
    { code: '890201', desc: 'Examen médico de ingreso' },
    { code: '890202', desc: 'Examen médico de retiro' },
    { code: '890203', desc: 'Examen médico periódico' },
    { code: '890204', desc: 'Examen médico de cambio de puesto' },
    { code: '890205', desc: 'Examen médico de reingreso' },
    { code: '890206', desc: 'Examen médico de alta' },
    { code: '890207', desc: 'Examen médico de preempleo' },
    { code: '890208', desc: 'Examen médico de postempleo' },
    { code: '890209', desc: 'Examen médico de control' },
    { code: '890210', desc: 'Examen médico de vigilancia' },
  ];

  useEffect(() => {
    if (value && value.length >= 2) {
      const filtered = CUPS_CODES.filter(c =>
        c.code.includes(value) || c.desc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSelect = (code) => {
    onChange({ target: { value: code.code, name: 'cups' } });
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
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
              <span className="font-mono text-blue-600">{escapeHtml(s.code)}</span>
              <span className="ml-2 text-gray-600">{escapeHtml(s.desc)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};