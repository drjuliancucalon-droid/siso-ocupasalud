// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Cierre de HC Ocupacional
// FASE 4 — ETAPA D: Validación + firma + persistencia + portal
// Extraído de App.jsx: handleCloseHistory (L21515)
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { useHCOcupacional } from './useHCOcupacional.js';

/**
 * Componente de cierre de HC Ocupacional.
 * @param {Object} props
 * @param {string} props.userId - ID del médico
 * @param {string} props.doctorSignature - Firma en base64
 * @param {Function} props.onCloseComplete - Callback al cerrar exitosamente
 * @param {Function} props.onCloseError - Callback si hay error
 * @param {Function} props.onCancel - Callback al cancelar
 */
export const HCOcupacionalClose = ({
  userId,
  doctorSignature,
  onCloseComplete,
  onCloseError,
  onCancel,
}) => {
  const hc = useHCOcupacional({ userId, doctorSignature });
  const { formData, errors, saving, closeHC, prepareClose, cancelHC } = hc;

  if (!formData) return null;

  const handleClose = async () => {
    const result = closeHC();
    if (result) {
      // Persistir en pacientes
      try {
        const patKey = `siso_db_patients_${userId}`;
        const patients = JSON.parse(localStorage.getItem(patKey) || '[]');
        const idx = patients.findIndex(p => p.id === result.patientId);
        let updatedPatients;
        if (idx >= 0) {
          updatedPatients = [...patients];
          updatedPatients[idx] = {
            ...updatedPatients[idx],
            ...result,
            _activeHC: undefined,
            ultimaAtencion: result.fechaCierre,
            conceptoAptitud: result.conceptoAptitud,
          };
        } else {
          updatedPatients = [...patients, { id: result.patientId, ...result }];
        }
        localStorage.setItem(patKey, JSON.stringify(updatedPatients));

        // Agregar a atenciones cerradas
        const closedKey = 'siso_atenciones_cerradas';
        const closed = JSON.parse(localStorage.getItem(closedKey) || '[]');
        closed.push({
          id: result.id,
          pacienteId: result.patientId,
          nombres: result.nombres,
          apellidos: result.apellidos,
          docNumero: result.docNumero,
          empresaNit: result.empresaNit,
          empresaNombre: result.empresaNombre,
          fecha: result.fechaCierre,
          tipoExamen: result.tipoExamen,
          conceptoAptitud: result.conceptoAptitud,
          firmaDigital: result.firmaDigital,
          codigoVerificacion: result.codigoVerificacion,
        });
        localStorage.setItem(closedKey, JSON.stringify(closed));
        localStorage.setItem('siso_atenciones_v', '2');

        // Publicar al portal
        const portalKey = `siso_portal_${userId}`;
        const portalData = JSON.parse(localStorage.getItem(portalKey) || '[]');
        portalData.push({
          id: result.id,
          pacienteId: result.patientId,
          nombres: result.nombres,
          apellidos: result.apellidos,
          docNumero: result.docNumero,
          empresaNit: result.empresaNit,
          codigoVerificacion: result.codigoVerificacion,
          fecha: result.fechaCierre,
          tipoExamen: result.tipoExamen,
          conceptoAptitud: result.conceptoAptitud,
          firmaDigital: result.firmaDigital,
        });
        localStorage.setItem(portalKey, JSON.stringify(portalData));

        // Llamar callback de éxito
        onCloseComplete?.(result, updatedPatients, closed);
      } catch (err) {
        onCloseError?.(err);
      }
    } else {
      onCloseError?.(new Error('Error en validación'));
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Cierre de Historia Clínica</h2>

      {/* Resumen de datos */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-green-800 mb-2">Resumen</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>Paciente: <strong>{formData.nombres} {formData.apellidos}</strong></p>
          <p>Documento: {formData.docTipo} {formData.docNumero}</p>
          <p>Examen: {formData.tipoExamen}</p>
          <p>Aptitud: <strong>{formData.conceptoAptitud}</strong></p>
        </div>
      </div>

      {/* Errores de validación */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-red-800 mb-2">Campos obligatorios faltantes</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel || cancelHC}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          onClick={handleClose}
          disabled={saving}
          className="px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Cerrando...' : 'Cerrar Historia Clínica'}
        </button>
      </div>

      {/* Advertencia */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Al cerrar la HC se generará la firma digital, código QR y se publicará en el portal.
        Esta acción no se puede deshacer.
      </p>
    </div>
  );
};