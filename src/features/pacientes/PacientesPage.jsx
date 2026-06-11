// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Página de Pacientes
// FASE 4 — ETAPA C: Vista de lista y gestión de pacientes
// ═══════════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { usePacientes } from './usePacientes.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Página principal de gestión de pacientes.
 * @param {Object} props
 * @param {Array} props.initialPatients - Lista inicial
 * @param {string} props.userId - Usuario actual
 * @param {Function} props.onSelectPatient - Callback al seleccionar paciente
 */
export const PacientesPage = ({ initialPatients = [], userId, onSelectPatient }) => {
  const {
    patients,
    loading,
    searchQuery,
    setSearchQuery,
    savePatient,
    deletePatient,
    loadPatients,
    filteredPatients,
    getPatientByDocument,
    exportData,
  } = usePacientes({ userId, initialPatients });

  const filtered = filteredPatients();

  // Cargar pacientes al montar
  useEffect(() => {
    if (initialPatients.length === 0 && userId) {
      loadPatients(userId);
    }
  }, [userId]);

  return (
    <div className="p-4">
      {/* Barra de búsqueda y acciones */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar paciente (nombre, documento, empresa)..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={() => exportData()}
          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
          title="Exportar pacientes"
        >
          Exportar
        </button>
        <button
          onClick={() => {/* handleNewOccupHistory */}}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Nueva HC
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-8 text-gray-500">
          Cargando pacientes...
        </div>
      )}

      {/* Lista de pacientes */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {searchQuery
            ? 'No se encontraron pacientes con ese criterio de búsqueda'
            : 'No hay pacientes registrados. Cree una nueva historia clínica para comenzar.'}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient?.(patient)}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {patient.nombres || 'Sin nombre'} {patient.apellidos || ''}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {patient.docTipo || 'CC'}: {patient.docNumero || '—'}
                    {patient.empresaNombre && (
                      <> &middot; {patient.empresaNombre}</>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {patient.fechaNacimiento && (
                      <>Nac: {formatFechaCorta(patient.fechaNacimiento)}</>
                    )}
                    {patient.conceptoAptitud && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium
                        ${patient.conceptoAptitud.toLowerCase().includes('no apto')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'}`}>
                        {patient.conceptoAptitud}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Eliminar paciente?')) {
                      deletePatient(patient.id);
                    }
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Eliminar paciente"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Contador */}
          <div className="text-xs text-gray-400 text-center pt-2">
            {filtered.length} paciente{filtered.length !== 1 ? 's' : ''}
            {searchQuery && patients.length !== filtered.length && (
              <> (de {patients.length})</>
            )}
          </div>
        </div>
      )}
    </div>
  );
};