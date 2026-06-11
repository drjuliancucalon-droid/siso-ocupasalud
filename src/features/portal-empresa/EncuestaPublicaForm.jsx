// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — EncuestaPublicaForm Component
// FASE 4 — ETAPA O: Extraído de App.jsx L13584
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';

/**
 * Formulario de encuesta pública para trabajadores.
 * @param {Object} props
 * @param {string} props.token - Token de autenticación
 * @param {Function} props.onVolver - Callback al volver
 */
export const EncuestaPublicaForm = ({ token, onVolver }) => {
  const [formData, setFormData] = useState({
    satisfaction: '',
    comments: '',
    recommend: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar encuesta
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-green-700 mb-2">¡Gracias!</h2>
            <p className="text-green-600 text-sm">Su encuesta ha sido registrada exitosamente.</p>
          </div>
          {onVolver && (
            <button onClick={onVolver} className="mt-4 text-sm text-blue-600 hover:underline">
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Encuesta de Satisfacción</h2>
        <p className="text-sm text-gray-500 mb-6">Su opinión nos ayuda a mejorar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo calificaría el servicio recibido?
            </label>
            <div className="flex gap-2">
              {['1', '2', '3', '4', '5'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData({ ...formData, satisfaction: val })}
                  className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                    formData.satisfaction === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Recomendaría nuestro servicio?
            </label>
            <select
              value={formData.recommend}
              onChange={(e) => setFormData({ ...formData, recommend: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="quizas">Quizás</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentarios adicionales
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Escriba sus comentarios..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Enviar Encuesta
          </button>
        </form>
      </div>
    </div>
  );
};