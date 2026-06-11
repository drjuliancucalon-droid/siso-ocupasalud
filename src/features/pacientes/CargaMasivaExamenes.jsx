// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — CargaMasivaExamenes Component
// FASE 4 — ETAPA P: Extraído de App.jsx L14684
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';

/**
 * Carga masiva de exámenes médicos.
 * @param {Object} props
 * @param {Array} props.patients
 * @param {Object} props.currentUser
 * @param {Function} props.onClose
 */
export const CargaMasivaExamenes = ({ patients = [], currentUser, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      // Simular carga masiva
      setResult({ success: true, count: 0, message: 'Funcionalidad de carga masiva en desarrollo' });
    } catch (err) {
      setResult({ success: false, message: 'Error: ' + (err.message || '') });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Carga Masiva de Exámenes</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo CSV/Excel
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {result && (
              <div className={`p-3 rounded-lg text-sm ${
                result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {result.message}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};