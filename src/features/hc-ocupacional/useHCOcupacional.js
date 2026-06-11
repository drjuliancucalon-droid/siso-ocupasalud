// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useHCOcupacional
// FASE 4 — ETAPA D: Lógica de Historia Clínica Ocupacional
// Extraído de App.jsx: handleNewOccupHistory, handleEditHistory,
//   checkAlertasObligatorias, _generarCodigoQR, _formatFirmaDigital
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { sync } from '../../shared/storage/d1Client.js';
import { patKey, LS } from '../../shared/storage/storageKeys.js';
import { escapeHtml } from '../../shared/utils/sanitize.js';
import { CONCEPTOS_APTITUD, TIPOS_EXAMEN } from '../../shared/utils/constants.js';

/**
 * Estado inicial del formulario de HC Ocupacional.
 */
const INITIAL_HC_FORM = {
  // Datos del paciente
  nombres: '',
  apellidos: '',
  docTipo: 'CC',
  docNumero: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',

  // Datos laborales
  empresaId: '',
  empresaNombre: '',
  empresaNit: '',
  cargo: '',
  antiguedad: '',
  tipoContrato: '',

  // Tipo de examen
  tipoExamen: '',
  enfasisExamen: 'GENERAL',

  // Anamnesis
  motivoConsulta: '',
  enfermedadActual: '',
  antecedentesPersonales: '',
  antecedentesFamiliares: '',
  antecedentesLaborales: '',
  habitos: '',
  medicamentosActuales: '',

  // Signos vitales
  presionArterial: '',
  frecuenciaCardiaca: '',
  frecuenciaRespiratoria: '',
  temperatura: '',
  peso: '',
  talla: '',
  imc: '',
  saturacionOxigeno: '',

  // Examen físico
  examenFisicoCabeza: '',
  examenFisicoCuello: '',
  examenFisicoTorax: '',
  examenFisicoAbdomen: '',
  examenFisicoColumna: '',
  examenFisicoMMSS: '',
  examenFisicoMMII: '',
  examenFisicoNeurologico: '',
  examenFisicoPiel: '',
  examenFisicoVisual: '',
  examenFisicoAuditivo: '',

  // Sistemas
  sistemasOsteomuscular: '',
  sistemasCardiovascular: '',
  sistemasRespiratorio: '',
  sistemasDigestivo: '',
  sistemasNeurologico: '',
  sistemasGenitourinario: '',
  sistemasEndocrino: '',
  sistemasPsiquiatrico: '',

  // Restricciones y recomendaciones
  restricciones: [],
  recomendaciones: [],

  // Fórmula y derivaciones
  formulaMedicamentos: [],
  derivaciones: [],
  solicitudExamenes: [],

  // Concepto
  conceptoAptitud: '',
  observaciones: '',

  // Control
  _autoSaved: null,
  _etapa: 'anamnesis', // anamnesis | examen | sistemas | restricciones | formula | cierre
};

/**
 * Hook para manejar la Historia Clínica Ocupacional.
 * @param {Object} options
 * @param {string} options.userId - ID del médico
 * @param {string} options.doctorSignature - Firma del médico en base64
 * @param {Function} options.onSave - Callback al guardar
 * @param {Function} options.onClose - Callback al cerrar HC
 * @returns {Object} Estado y métodos del formulario
 */
export const useHCOcupacional = ({ userId, doctorSignature, onSave, onClose }) => {
  const [formData, setFormData] = useState(null); // null = sin HC activa
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const autosaveRef = useRef(null);

  // ── Inicialización ───────────────────────────────────────

  /**
   * Inicia una nueva HC Ocupacional para un paciente.
   * @param {Object} patient - Paciente seleccionado
   */
  const startNewHC = useCallback((patient) => {
    setSelectedPatient(patient);
    const now = new Date().toISOString();
    const id = 'hc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    setFormData({
      ...INITIAL_HC_FORM,
      id,
      patientId: patient?.id || '',
      // Copiar datos del paciente
      nombres: patient?.nombres || '',
      apellidos: patient?.apellidos || '',
      docTipo: patient?.docTipo || 'CC',
      docNumero: patient?.docNumero || '',
      fechaNacimiento: patient?.fechaNacimiento || '',
      genero: patient?.genero || '',
      telefono: patient?.telefono || '',
      email: patient?.email || '',
      empresaId: patient?.empresaId || '',
      empresaNombre: patient?.empresaNombre || '',
      empresaNit: patient?.empresaNit || '',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });
    setErrors([]);
    return id;
  }, [userId]);

  /**
   * Carga una HC existente para edición.
   * @param {Object} patient - Paciente con datos de HC
   */
  const loadExistingHC = useCallback((patient) => {
    setSelectedPatient(patient);
    // Extraer datos de HC del paciente (si tiene una abierta)
    const hcData = patient._activeHC || patient;
    setFormData({
      ...INITIAL_HC_FORM,
      ...hcData,
      patientId: patient.id,
    });
  }, []);

  // ── Manejo de Formulario ─────────────────────────────────

  /**
   * Actualiza un campo del formulario.
   * @param {string} field - Nombre del campo
   * @param {*} value - Nuevo valor
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value, updatedAt: new Date().toISOString() };

      // Calcular IMC automáticamente si cambia peso o talla
      if ((field === 'peso' || field === 'talla') && updated.peso && updated.talla) {
        const peso = parseFloat(updated.peso);
        const talla = parseFloat(updated.talla) / 100; // cm a m
        if (peso && talla) {
          updated.imc = (peso / (talla * talla)).toFixed(1);
        }
      }

      return updated;
    });
  }, []);

  /**
   * Actualiza múltiples campos a la vez.
   * @param {Object} fields - Objeto { campo: valor }
   */
  const updateFields = useCallback((fields) => {
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, ...fields, updatedAt: new Date().toISOString() };
    });
  }, []);

  /**
   * Cambia la etapa activa del formulario.
   * @param {string} etapa
   */
  const setEtapa = useCallback((etapa) => {
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, _etapa: etapa };
    });
  }, []);

  // ── Autosave ─────────────────────────────────────────────

  /**
   * Inicia el autosave periódico.
   * @param {number} intervalMs - Intervalo en ms
   */
  const startAutosave = useCallback((intervalMs = 30000) => {
    if (autosaveRef.current) clearInterval(autosaveRef.current);
    autosaveRef.current = setInterval(() => {
      if (formData?.id) {
        saveDraft(formData);
      }
    }, intervalMs);
  }, [formData]);

  /**
   * Detiene el autosave.
   */
  const stopAutosave = useCallback(() => {
    if (autosaveRef.current) {
      clearInterval(autosaveRef.current);
      autosaveRef.current = null;
    }
  }, []);

  /**
   * Guarda un borrador del formulario.
   * @param {Object} data - Datos a guardar
   */
  const saveDraft = useCallback((data) => {
    const draft = { ...data, _autoSaved: new Date().toISOString() };
    const key = `${LS.AUTOSAVE_PREFIX}${draft.id}`;
    _ls.setItem(key, JSON.stringify(draft));
    _ls.setItem(LS.ACTIVE_FORM, JSON.stringify({ id: draft.id, patientId: draft.patientId }));
  }, []);

  /**
   * Recupera un borrador guardado.
   * @param {string} id - ID de la HC
   * @returns {Object|null}
   */
  const loadDraft = useCallback((id) => {
    const key = `${LS.AUTOSAVE_PREFIX}${id}`;
    return sp(key, null);
  }, []);

  // ── Validación ───────────────────────────────────────────

  /**
   * Verifica campos obligatorios antes de cerrar.
   * @param {Object} data - Datos del formulario
   * @returns {string[]} Lista de errores
   */
  const validateRequired = useCallback((data) => {
    const errs = [];
    const required = {
      'Tipo de examen': data.tipoExamen,
      'Concepto de aptitud': data.conceptoAptitud,
      'Presión arterial': data.presionArterial,
      'Frecuencia cardíaca': data.frecuenciaCardiaca,
      'Peso': data.peso,
      'Talla': data.talla,
    };

    Object.entries(required).forEach(([label, value]) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        errs.push(`${label} es obligatorio`);
      }
    });

    // Validar firma del médico
    if (!doctorSignature) {
      errs.push('Debe cargar su firma digital antes de cerrar la HC');
    }

    return errs;
  }, [doctorSignature]);

  // ── Cierre de HC ─────────────────────────────────────────

  /**
   * Genera código QR para la HC.
   * @param {string} id - ID de la HC
   * @param {string} hash - Hash de verificación
   * @param {string} fecha - Fecha ISO
   * @returns {string} HTML del QR
   */
  const generarCodigoQR = (id, hash, fecha) => {
    const fechaShort = (fecha || new Date().toISOString()).slice(0, 10).replace(/-/g, '');
    const codigo = `${id.slice(-8)}-${fechaShort}-${hash.slice(0, 4)}`.toUpperCase();
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(codigo)}`;
    const style = 'display:inline-block;width:100px;height:100px;border:2px solid #065f46;border-radius:8px;padding:4px';
    return `<div style="${style}"><img src="${url}" alt="QR: ${escapeHtml(codigo)}" style="width:100%;height:100%"/></div><div style="font-size:7pt;text-align:center;margin-top:2px;font-family:monospace">${escapeHtml(codigo)}</div>`;
  };

  /**
   * Formatea la firma digital con timestamp.
   * @param {Object} firma - Datos de firma
   * @returns {Object} Firma formateada
   */
  const formatFirmaDigital = (firma) => {
    const now = new Date();
    return {
      firma: firma || doctorSignature || '',
      fecha: now.toISOString(),
      timestamp: now.getTime(),
      hash: btoa(String(now.getTime())).slice(0, 12),
      codigoQR: '',
    };
  };

  /**
   * Prepara los datos para cerrar la HC.
   * @returns {Object|null} Datos de HC cerrada o null si hay errores
   */
  const prepareClose = useCallback(() => {
    if (!formData) return null;

    // Validar
    const errs = validateRequired(formData);
    if (errs.length > 0) {
      setErrors(errs);
      return null;
    }
    setErrors([]);

    // Generar firma y QR
    const firmaDigital = formatFirmaDigital(doctorSignature);
    const hcId = formData.id;
    const hash = firmaDigital.hash;
    const fecha = new Date().toISOString();
    firmaDigital.codigoQR = generarCodigoQR(hcId, hash, fecha);

    // Determinar tipo de consulta
    const tipoExamen = (formData.tipoExamen || '').toUpperCase();
    const tipoConsulta = tipoExamen.includes('INGRESO') ? 'INGRESO'
      : tipoExamen.includes('EGRESO') ? 'EGRESO'
      : tipoExamen.includes('PERIODICO') ? 'PERIODICO'
      : 'OCUPACIONAL';

    // Construir estructura de HC cerrada
    const closedHC = {
      ...formData,
      firmaDigital,
      codigoVerificacion: firmaDigital.codigoQR,
      fechaCierre: fecha,
      tipoConsulta,
      _slim: true,
      _etapa: 'cerrada',
    };

    return closedHC;
  }, [formData, doctorSignature, validateRequired]);

  /**
   * Ejecuta el cierre de HC.
   * @returns {Object|null} HC cerrada o null
   */
  const closeHC = useCallback(() => {
    setSaving(true);
    try {
      const closed = prepareClose();
      if (!closed) {
        setSaving(false);
        return null;
      }

      // Generar HTML del portal
      const portalHTML = generarHCPortalHTML(closed);

      // Callback de cierre
      onClose?.(closed, portalHTML);

      // Limpiar estado
      stopAutosave();
      setFormData(null);
      setSelectedPatient(null);

      return closed;
    } finally {
      setSaving(false);
    }
  }, [prepareClose, onClose, stopAutosave]);

  // ── Reset ────────────────────────────────────────────────

  /**
   * Cancela la HC actual.
   */
  const cancelHC = useCallback(() => {
    stopAutosave();
    setFormData(null);
    setSelectedPatient(null);
    setErrors([]);
  }, [stopAutosave]);

  return {
    // Estado
    formData,
    selectedPatient,
    saving,
    errors,
    setErrors,

    // Inicialización
    startNewHC,
    loadExistingHC,
    cancelHC,

    // Formulario
    updateField,
    updateFields,
    setEtapa,

    // Autosave
    startAutosave,
    stopAutosave,
    saveDraft,
    loadDraft,

    // Cierre
    prepareClose,
    closeHC,

    // Constantes
    INITIAL_HC_FORM,
    CONCEPTOS_APTITUD,
    TIPOS_EXAMEN,
  };
};

// ═══════════════════════════════════════════════════════════════
// Helper: Generar HTML de portal para HC cerrada
// Extraído de App.jsx: _generarHCPortalHTML (L1546)
// ═══════════════════════════════════════════════════════════════

/**
 * Genera HTML del portal público para una HC cerrada.
 * @param {Object} p - HC cerrada
 * @returns {string} HTML string
 */
function generarHCPortalHTML(p) {
  const e = (v) => escapeHtml(v);
  const nl = (v) => e(v).replace(/\n/g, '<br/>');

  const sec = (icon, title) => `<div style="background:#ecfdf5;border-left:4px solid #065f46;padding:6px 12px;margin:14px 0 8px;font-weight:700;font-size:9pt;color:#065f46">${icon} ${title}</div>`;
  const r2 = (l1, v1, l2, v2) => `<tr><th style="background:#d1fae5;font-weight:700;width:22%;font-size:8.5pt;padding:4px 8px;border:1px solid #a7f3d0">${e(l1)}</th><td style="padding:4px 8px;border:1px solid #d1d5db;font-size:8.5pt">${nl(v1)}</td><th style="background:#d1fae5;font-weight:700;width:22%;font-size:8.5pt;padding:4px 8px;border:1px solid #a7f3d0">${e(l2)}</th><td style="padding:4px 8px;border:1px solid #d1d5db;font-size:8.5pt">${nl(v2)}</td></tr>`;
  const tb = (rows) => `<table style="width:100%;border-collapse:collapse;margin-bottom:6px">${rows.join('')}</table>`;

  const fechaStr = p.fechaCierre ? new Date(p.fechaCierre).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO');
  const codigoQR = p.firmaDigital?.codigoQR || '';

  let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>HC Ocupacional - ${e(p.nombres)} ${e(p.apellidos)}</title>`;
  html += `<style>body{font-family:Arial,sans-serif;font-size:10pt;color:#1f2937;margin:20px}@media print{@page{size:letter;margin:1.5cm}}.no-apto{color:#dc2625;font-weight:700}</style></head><body>`;
  html += `<div style="text-align:center;margin-bottom:16px"><h1 style="font-size:14pt;color:#065f46;margin:0">HISTORIA CLINICA OCUPACIONAL</h1><div style="font-size:8pt;color:#6b7280">${e(fechaStr)}</div></div>`;

  // Datos del paciente
  html += sec('👤', 'DATOS DEL PACIENTE');
  html += tb([r2('Nombres', p.nombres, 'Apellidos', p.apellidos), r2('Documento', `${p.docTipo || 'CC'} ${p.docNumero}`, 'Fecha Nac.', p.fechaNacimiento), r2('Empresa', p.empresaNombre, 'Cargo', p.cargo)]);

  // Signos vitales
  if (p.presionArticial || p.frecuenciaCardiaca || p.peso) {
    html += sec('❤️', 'SIGNOS VITALES');
    html += tb([r2('PA', p.presionArterial, 'FC', p.frecuenciaCardiaca), r2('Peso', p.peso + ' kg', 'Talla', p.talla + ' cm'), r2('IMC', p.imc, 'Sat O2', p.saturacionOxigeno)]);
  }

  // Concepto
  html += sec('📋', 'CONCEPTO DE APTITUD');
  const aptClass = (p.conceptoAptitud || '').toLowerCase().includes('no apto') ? ' class="no-apto"' : '';
  html += `<div${aptClass} style="font-size:12pt;font-weight:700;text-align:center;padding:8px;background:#f0fdf4;border:2px solid #065f46;border-radius:8px">${e(p.conceptoAptitud)}</div>`;

  // Código QR
  if (codigoQR) {
    html += `<div style="text-align:center;margin-top:12px">${codigoQR}</div>`;
  }

  html += '</body></html>';
  return html;
}