// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — ConsentimientoModal Component
// FASE 4 — ETAPA O: Extraído de App.jsx L12274
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * Modal de consentimiento informado del paciente.
 * @param {Object} props
 * @param {Object} props.paciente - Datos del paciente
 * @param {Function} props.onAccept - Callback al aceptar
 * @param {Function} props.onClose - Callback al cerrar
 * @param {boolean} props.show - Si se muestra el modal
 */
export const ConsentimientoModal = ({ paciente, onAccept, onClose, show = false }) => {
  const [accepted, setAccepted] = useState(false);

  if (!show) return null;

  const handleAccept = () => {
    if (accepted && onAccept) {
      onAccept({
        pacienteId: paciente?.id,
        fecha: new Date().toISOString(),
        tipo: 'consentimiento_informado'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Consentimiento Informado</h2>
          
          <div className="text-sm text-gray-700 space-y-3 mb-4">
            <p>
              Yo, <strong>{escapeHtml(paciente?.nombres)} {escapeHtml(paciente?.apellidos)}</strong>,
              identificado(a) con {escapeHtml(paciente?.docTipo)} No. {escapeHtml(paciente?.docNumero)},
            </p>
            <p>
              Manifiesto que he sido informado(a) por el médico tratante sobre los procedimientos
              médicos ocupacionales que se van a realizar, sus beneficios, riesgos y alternativas.
            </p>
            <p>
              De manera libre y voluntaria doy mi consentimiento para la realización de los
              exámenes médicos ocupacionales correspondientes.
            </p>
          </div>

          <label className="flex items-start gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              He leído y acepto el consentimiento informado
            </span>
          </label>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              disabled={!accepted}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};