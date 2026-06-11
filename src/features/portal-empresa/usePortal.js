// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook usePortal (Portal Empresa)
// FASE 4 — ETAPA F: Certificados, cuentas de cobro, custodia
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { getSpanishDate } from '../../shared/utils/formatters.js';
import { d1Get } from '../../shared/storage/d1Client.js';

export const usePortal = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState('');

  /**
   * Busca empresa por NIT en los datos del portal.
   */
  const buscarEmpresa = useCallback(async (nit) => {
    setLoading(true);
    setError('');
    setResultados(null);
    try {
      const clean = nit.replace(/[^0-9]/g, '');
      if (clean.length < 3) { setError('NIT debe tener al menos 3 dígitos'); setLoading(false); return; }

      // Buscar en atenciones cerradas
      const closed = sp(LS.ATENCIONES_CERRADAS, []);
      const atenciones = closed.filter(a => (a.empresaNit || '').replace(/[^0-9]/g, '').includes(clean));
      const empresas = [...new Set(atenciones.map(a => a.empresaNombre).filter(Boolean))];

      // Buscar en portal por userId
      let portalData = [];
      if (userId) {
        const portalKey = `siso_portal_${userId}`;
        portalData = sp(portalKey, []);
      }

      setResultados({ atenciones, empresas, portalData, nit: clean });
    } catch (e) { setError('Error al buscar: ' + e.message); }
    setLoading(false);
  }, [userId]);

  /**
   * Genera HTML de certificado de aptitud.
   * Extraído de App.jsx: _generarCertificadoHTMLNormalizado (L13177)
   */
  const generarCertificado = useCallback((atencion, medicoData) => {
    const e = escapeHtml;
    const fecha = atencion.fecha ? getSpanishDate(atencion.fecha) : getSpanishDate(new Date().toISOString());
    const firma = atencion.firmaDigital?.firma || '';
    const codigoQR = atencion.firmaDigital?.codigoQR || atencion.codigoVerificacion || '';

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Certificado Aptitud - ${e(atencion.nombres)}</title>
<style>body{font-family:Arial,sans-serif;font-size:10pt;margin:30px}@media print{@page{size:letter;margin:1.5cm}}
h1{font-size:13pt;color:#065f46;text-align:center;border-bottom:2px solid #065f46;padding-bottom:8px}
table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#d1fae5;padding:5px 8px;border:1px solid #a7f3d0;text-align:left;width:30%}
td{padding:5px 8px;border:1px solid #ddd}.firma{text-align:center;margin-top:30px}
.qr{text-align:center;margin-top:15px}</style></head><body>
<h1>CERTIFICADO DE APTITUD OCUPACIONAL</h1>
<p style="text-align:center;font-size:8pt;color:#666">${e(fecha)}</p>
<table><tr><th>Paciente</th><td>${e(atencion.nombres)} ${e(atencion.apellidos || '')}</td></tr>
<tr><th>Documento</th><td>${e(atencion.docNumero)}</td></tr>
<tr><th>Empresa</th><td>${e(atencion.empresaNombre)}</td></tr>
<tr><th>Tipo Examen</th><td>${e(atencion.tipoExamen)}</td></tr>
<tr><th>Concepto</th><td><strong>${e(atencion.conceptoAptitud)}</strong></td></tr></table>
${codigoQR ? `<div class="qr">${codigoQR}</div>` : ''}
${firma ? `<div class="firma"><img src="${e(firma)}" style="max-height:60px"/><br/><span style="font-size:8pt;color:#666">Firma digital</span></div>` : ''}
</body></html>`;
    return html;
  }, []);

  /**
   * Abre el certificado en ventana de impresión.
   */
  const imprimirCertificado = useCallback((atencion, medicoData) => {
    const html = generarCertificado(atencion, medicoData);
    const w = window.open('', '_blank', 'width=800,height=600');
    if (w) { w.document.write(html); w.document.close(); }
  }, [generarCertificado]);

  return { loading, resultados, error, buscarEmpresa, generarCertificado, imprimirCertificado };
};