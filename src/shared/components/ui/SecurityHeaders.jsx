// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — SecurityHeaders Component
// FASE 4 — ETAPA P: Funciones restantes (100%)
// Extraído de App.jsx L9203
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Componente que inyecta meta tags de seguridad en el head.
 */
export const SecurityHeaders = () => {
  return (
    <>
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      <meta name="robots" content="noindex, nofollow" />
    </>
  );
};