// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Company Helpers
// FASE 4 — ETAPA P: Extraído de App.jsx (funciones empresa)
// ═══════════════════════════════════════════════════════════════

import { escapeHtml } from './sanitize.js';

/**
 * Maneja la selección de empresa.
 * Extraído de App.jsx L22331
 */
export const handleCompanySelect = (empresa, setEmpresaSeleccionada, setEmpresaNombre) => {
  if (!empresa) return;
  setEmpresaSeleccionada(empresa);
  setEmpresaNombre(empresa.nombre || empresa.razonSocial || '');
};

/**
 * Sincroniza empresas desde cloud.
 * Extraído de App.jsx L21440
 */
export const syncCompanies = async (setEmpresas, setEmpresasLoading) => {
  if (setEmpresasLoading) setEmpresasLoading(true);
  try {
    const stored = localStorage.getItem('siso_empresas');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setEmpresas(parsed);
      }
    }
  } catch (e) {
    console.warn('syncCompanies error:', e);
  }
  if (setEmpresasLoading) setEmpresasLoading(false);
};

/**
 * Maneja la subida de firma.
 * Extraído de App.jsx L22400
 */
export const handleSignatureUpload = (file, setFirmaSrc, setFirmaError) => {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    if (setFirmaError) setFirmaError('El archivo debe ser una imagen');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    if (setFirmaError) setFirmaError('La imagen no debe superar 5MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    if (setFirmaSrc) setFirmaSrc(e.target.result);
    if (setFirmaError) setFirmaError('');
  };
  reader.onerror = () => {
    if (setFirmaError) setFirmaError('Error al leer el archivo');
  };
  reader.readAsDataURL(file);
};