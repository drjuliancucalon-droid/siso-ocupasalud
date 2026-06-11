// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — TextAreaGroup Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9508
// ═══════════════════════════════════════════════════════════════

import React from 'react';

export const TextAreaGroup = ({
  label, name, value, onChange, rows = 4,
  placeholder = '', required = false, error = '',
  disabled = false, className = '', ...rest
}) => (
  <div className={`mb-3 ${className}`}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      id={name} name={name} value={value || ''} onChange={onChange}
      rows={rows} placeholder={placeholder} required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100' : ''}`}
      {...rest}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);