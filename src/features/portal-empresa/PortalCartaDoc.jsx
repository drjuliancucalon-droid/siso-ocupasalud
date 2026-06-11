// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PortalCartaDoc Component
// FASE 4 — ETAPA P: Extraído de App.jsx L14128
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

/**
 * Documento de carta para el portal.
 * @param {Object} props
 * @param {string} props.docNombre
 * @param {string} props.docTitulo
 * @param {string} props.docLicencia
 * @param {string} props.docCC
 * @param {string} props.docCel
 * @param {string} props.docEmail
 * @param {string} props.docCiudad
 * @param {string} props.firmaSrc
 * @param {string} props.fechaTexto
 * @param {string} props.empresaNombre
 * @param {string} props.ciudadDest
 * @param {string} props.mes
 */
export const PortalCartaDoc = ({
  docNombre, docTitulo, docLicencia, docCC, docCel, docEmail,
  docCiudad, firmaSrc, fechaTexto, empresaNombre, ciudadDest, mes
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Carta de Custodia</h3>
        <p className="text-sm text-gray-500">{escapeHtml(empresaNombre)}</p>
      </div>

      <div className="text-sm text-gray-700 space-y-3">
        <p><strong>Fecha:</strong> {escapeHtml(fechaTexto || formatFechaCorta(new Date().toISOString()))}</p>
        <p><strong>Señor(a):</strong> {escapeHtml(docNombre || '')}</p>
        <p><strong>Cargo:</strong> {escapeHtml(docTitulo || '')}</p>
        <p><strong>Licencia:</strong> {escapeHtml(docLicencia || '')}</p>
        <p><strong>CC:</strong> {escapeHtml(docCC || '')}</p>
        <p><strong>Celular:</strong> {escapeHtml(docCel || '')}</p>
        <p><strong>Email:</strong> {escapeHtml(docEmail || '')}</p>
        <p><strong>Ciudad:</strong> {escapeHtml(docCiudad || '')}</p>
        <p><strong>Empresa:</strong> {escapeHtml(empresaNombre || '')}</p>
        <p><strong>Ciudad Destino:</strong> {escapeHtml(ciudadDest || '')}</p>
        <p><strong>Período:</strong> {escapeHtml(mes || '')}</p>
      </div>

      {firmaSrc && (
        <div className="mt-6 text-center">
          <img src={firmaSrc} alt="Firma" className="h-16 mx-auto" />
          <div className="w-48 border-t border-gray-400 mt-1 mx-auto"></div>
        </div>
      )}
    </div>
  );
};