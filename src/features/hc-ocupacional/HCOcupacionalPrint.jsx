// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — HCOcupacionalPrint Component
// FASE 4 — ETAPA P: Extraído de App.jsx L23014
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Impresión limpia de la HC Ocupacional.
 * @param {Object} props
 * @param {Object} props.paciente
 * @param {Object} props.medico
 * @param {Function} props.onClose
 */
export const HCOcupacionalPrint = ({ paciente, medico, onClose }) => {
  if (!paciente) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="no-print flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Impresión HC Ocupacional</h2>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Imprimir
          </button>
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Cerrar
            </button>
          )}
        </div>
      </div>

      <div className="print-only">
        <h1 style={{ fontSize: '13pt', color: '#065f46', textAlign: 'center', borderBottom: '2px solid #065f46', paddingBottom: '8px' }}>
          HISTORIA CLÍNICA OCUPACIONAL
        </h1>
        <p style={{ textAlign: 'center', fontSize: '8pt', color: '#666' }}>{formatFechaCorta(paciente.fecha)}</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
          <tbody>
            <tr><th style={{ background: '#d1fae5', padding: '4px 6px', border: '1px solid #a7f3d0', textAlign: 'left', width: '30%' }}>Paciente</th><td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{escapeHtml(paciente.nombres)} {escapeHtml(paciente.apellidos || '')}</td></tr>
            <tr><th style={{ background: '#d1fae5', padding: '4px 6px', border: '1px solid #a7f3d0', textAlign: 'left' }}>Documento</th><td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{escapeHtml(paciente.docNumero)}</td></tr>
            <tr><th style={{ background: '#d1fae5', padding: '4px 6px', border: '1px solid #a7f3d0', textAlign: 'left' }}>Empresa</th><td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{escapeHtml(paciente.empresaNombre)}</td></tr>
            <tr><th style={{ background: '#d1fae5', padding: '4px 6px', border: '1px solid #a7f3d0', textAlign: 'left' }}>Concepto</th><td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>{escapeHtml(paciente.conceptoAptitud)}</strong></td></tr>
            <tr><th style={{ background: '#d1fae5', padding: '4px 6px', border: '1px solid #a7f3d0', textAlign: 'left' }}>Tipo Examen</th><td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{escapeHtml(paciente.tipoExamen)}</td></tr>
          </tbody>
        </table>

        {medico && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ fontSize: '9pt' }}>{escapeHtml(medico.nombres)} {escapeHtml(medico.apellidos || '')}</p>
            <p style={{ fontSize: '8pt', color: '#666' }}>Lic. {escapeHtml(medico.licencia || '')}</p>
          </div>
        )}
      </div>
    </div>
  );
};