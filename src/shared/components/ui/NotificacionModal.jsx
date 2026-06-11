// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — NotificacionModal Component
// FASE 4 — ETAPA O: Extraído de App.jsx L12649
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Modal de notificación para el usuario.
 * @param {Object} props
 * @param {Object} props.data - { titulo, mensaje, tipo }
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export const NotificacionModal = ({ data, onCerrar }) => {
  if (!data) return null;

  const tipoStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const tipo = data.tipo || 'info';
  const style = tipoStyles[tipo] || tipoStyles.info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className={`p-6 rounded-t-xl border ${style}`}>
          <h2 className="text-lg font-bold mb-2">{escapeHtml(data.titulo || 'Notificación')}</h2>
          <p className="text-sm">{escapeHtml(data.mensaje)}</p>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};