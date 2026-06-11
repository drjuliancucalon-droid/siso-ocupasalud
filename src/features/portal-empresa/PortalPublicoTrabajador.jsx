// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalPublicoTrabajador Component
// FASE 4 — ETAPA P: Extraído de App.jsx L15485
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Portal público para trabajadores (consulta de HC).
 * @param {Object} props
 * @param {Function} props.onVolver
 * @param {boolean} props.autoLogin
 */
export const PortalPublicoTrabajador = ({ onVolver, autoLogin = false }) => {
  const [doc, setDoc] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!doc) return;
    setLoading(true);
    setError('');
    // Buscar paciente por documento
    try {
      const closed = JSON.parse(localStorage.getItem('siso_atenciones_cerradas') || '[]');
      const found = closed.filter(a => a.docNumero === doc);
      if (found.length > 0) {
        setPaciente(found[found.length - 1]);
      } else {
        setError('No se encontraron registros para este documento');
      }
    } catch (err) {
      setError('Error al buscar: ' + (err.message || ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Portal del Trabajador</h1>
          <p className="text-sm text-gray-500 mb-6">Consulte su historia clínica ocupacional</p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              placeholder="Número de documento"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              type="submit"
              disabled={loading || !doc}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {paciente && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Resultado</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Nombre:</span> {escapeHtml(paciente.nombres || '')}</div>
                <div><span className="font-medium">Documento:</span> {escapeHtml(paciente.docNumero || '')}</div>
                <div><span className="font-medium">Empresa:</span> {escapeHtml(paciente.empresaNombre || '')}</div>
                <div><span className="font-medium">Fecha:</span> {formatFechaCorta(paciente.fecha)}</div>
                <div><span className="font-medium">Concepto:</span> {escapeHtml(paciente.conceptoAptitud || '')}</div>
                <div><span className="font-medium">Tipo:</span> {escapeHtml(paciente.tipoExamen || '')}</div>
              </div>
            </div>
          )}

          {onVolver && (
            <button onClick={onVolver} className="mt-4 text-sm text-blue-600 hover:underline">
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};