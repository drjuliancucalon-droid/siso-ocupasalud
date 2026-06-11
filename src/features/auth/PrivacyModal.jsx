// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PrivacyModal Component
// FASE 4 — ETAPA O: Extraído de App.jsx L16471
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Modal de política de privacidad y tratamiento de datos.
 * @param {Object} props
 * @param {Function} props.onAccept - Callback al aceptar
 */
export const PrivacyModal = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Política de Privacidad</h2>
          
          <div className="text-sm text-gray-700 space-y-3 mb-6">
            <p>
              <strong>OCUPASALUD</strong> respeta su privacidad y se compromete a proteger sus datos personales
              de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013.
            </p>
            <p>
              <strong>Finalidad:</strong> Los datos personales recopilados serán utilizados exclusivamente para
              la prestación de servicios de salud ocupacional, gestión de historias clínicas,
              generación de certificados de aptitud y reportes a empresas contratantes.
            </p>
            <p>
              <strong>Derechos:</strong> Usted tiene derecho a acceder, rectificar, suprimir y solicitar
              la portabilidad de sus datos personales, así como a revocar el consentimiento otorgado.
            </p>
            <p>
              <strong>Contacto:</strong> Para ejercer sus derechos puede contactar a nuestro
              Encargado de Protección de Datos a través de los canales oficiales de OCUPASALUD.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onAccept}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Acepto la Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};