// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — PrintStyles Component
// FASE 4 — ETAPA P: Extraído de App.jsx L9211
// ═══════════════════════════════════════════════════════════════

import React from 'react';

/**
 * Estilos CSS para impresión.
 */
export const PrintStyles = () => {
  return (
    <style>{`
      @media print {
        body { font-size: 10pt; margin: 0; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        @page { size: letter; margin: 1.5cm; }
        h1 { font-size: 13pt; color: #065f46; text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 8px; }
        h2 { font-size: 12pt; color: #065f46; margin-top: 12px; }
        h3 { font-size: 11pt; color: #374151; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th { background: #d1fae5; padding: 4px 6px; border: 1px solid #a7f3d0; text-align: left; font-size: 9pt; }
        td { padding: 4px 6px; border: 1px solid #ddd; font-size: 9pt; }
        .firma { text-align: center; margin-top: 30px; }
        .qr { text-align: center; margin-top: 15px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0; }
      }
    `}</style>
  );
};