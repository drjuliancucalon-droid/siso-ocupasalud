// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — AgendaFieldF Component
// FASE 4 — ETAPA O: Extraído de App.jsx L16560
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Campo de agenda para mostrar citas médicas.
 * @param {Object} props
 * @param {Array} props.citas - Lista de citas
 * @param {Function} props.onSelect - Callback al seleccionar cita
 * @param {Function} props.onStatusChange - Callback al cambiar estado
 */
export const AgendaFieldF = ({ citas = [], onSelect, onStatusChange }) => {
  const estadoColors = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmada: 'bg-blue-100 text-blue-800 border-blue-300',
    en_progreso: 'bg-green-100 text-green-800 border-green-300',
    completada: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelada: 'bg-red-100 text-red-800 border-red-300',
  };

  const getEstadoColor = (estado) => {
    return estadoColors[estado] || estadoColors.pendiente;
  };

  return (
    <div className="space-y-2">
      {citas.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No hay citas programadas</p>
      ) : (
        citas.map((cita, index) => (
          <div
            key={cita.id || index}
            className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getEstadoColor(cita.estado)}`}
            onClick={() => onSelect && onSelect(cita)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{escapeHtml(cita.pacienteNombre || 'Sin nombre')}</p>
                <p className="text-xs opacity-75">{escapeHtml(cita.tipo || 'Consulta')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono">{formatFechaCorta(cita.fecha)}</p>
                <p className="text-xs opacity-75">{cita.hora || ''}</p>
              </div>
            </div>
            {onStatusChange && (
              <div className="mt-2 flex gap-2">
                {['pendiente', 'confirmada', 'completada', 'cancelada'].map(estado => (
                  <button
                    key={estado}
                    onClick={(e) => { e.stopPropagation(); onStatusChange(cita.id, estado); }}
                    className={`text-xs px-2 py-1 rounded ${
                      cita.estado === estado 
                        ? 'bg-white bg-opacity-50 font-bold' 
                        : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                    }`}
                  >
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};