// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — InputGroup Component
// FASE 4 — ETAPA O: Completación de funciones faltantes
// Extraído de App.jsx L9431
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Grupo de input con label y manejo de errores.
 * @param {Object} props
 * @param {string} props.label - Texto del label
 * @param {string} props.name - Nombre del campo
 * @param {string} props.value - Valor actual
 * @param {Function} props.onChange - Callback de cambio
 * @param {string} props.type - Tipo de input (text, number, email, etc.)
 * @param {string} props.placeholder - Placeholder
 * @param {boolean} props.required - Si es requerido
 * @param {string} props.error - Mensaje de error
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Si está deshabilitado
 */
export const InputGroup = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};