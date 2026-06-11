// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — SelectGroup Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9472
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Grupo select con label y opciones.
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {Array} props.options - [{value, label}]
 * @param {boolean} props.required
 * @param {string} props.error
 * @param {string} props.placeholder - Opción por defecto
 * @param {boolean} props.disabled
 */
export const SelectGroup = ({
  label, name, value, onChange, options = [],
  required = false, error = '', placeholder = 'Seleccione...',
  disabled = false, className = '', ...rest
}) => (
  <div className={`mb-3 ${className}`}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      id={name} name={name} value={value || ''} onChange={onChange}
      required={required} disabled={disabled}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100' : ''}`}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);