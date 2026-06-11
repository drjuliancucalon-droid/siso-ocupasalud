// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — RecuperarAcceso Component
// FASE 4 — ETAPA O: Extraído de App.jsx L12568
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';

/**
 * Formulario de recuperación de acceso.
 * @param {Object} props
 * @param {Function} props.onRecuperado - Callback al enviar solicitud
 */
export const RecuperarAcceso = ({ onRecuperado }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (onRecuperado) onRecuperado(email);
      setSent(true);
    } catch (err) {
      setError('Error al enviar: ' + (err.message || ''));
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-green-700 mb-2">Solicitud Enviada</h2>
            <p className="text-green-600 text-sm">
              Si el correo electrónico está registrado, recibirá instrucciones para recuperar su acceso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Recuperar Acceso</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ingrese su correo electrónico para recibir instrucciones de recuperación.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="correo@ejemplo.com"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">Volver al inicio de sesión</a>
        </div>
      </div>
    </div>
  );
};