// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useHCGeneral
// FASE 4 — ETAPA E: Historia Clínica General (no ocupacional)
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';

const INITIAL_HC_GENERAL = {
  motivoConsulta: '', enfermedadActual: '', revisionSistemas: '',
  diagnostico: '', planManejo: '', concepto: '', observaciones: '',
  formulaMedicamentos: [], derivaciones: [], solicitudExamenes: [],
  _etapa: 'consulta', _autoSaved: null,
};

export const useHCGeneral = ({ userId, doctorSignature, onClose }) => {
  const [formData, setFormData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const autosaveRef = useRef(null);

  const startNewHC = useCallback((patient) => {
    setSelectedPatient(patient);
    setFormData({ ...INITIAL_HC_GENERAL, id: 'hcg_'+Date.now(), patientId: patient?.id,
      nombres: patient?.nombres, apellidos: patient?.apellidos, docNumero: patient?.docNumero,
      createdAt: new Date().toISOString(), createdBy: userId });
    setErrors([]);
  }, [userId]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => prev ? { ...prev, [field]: value, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const closeHC = useCallback(() => {
    if (!formData) return null;
    const errs = [];
    if (!formData.diagnostico) errs.push('Diagnóstico es obligatorio');
    if (!doctorSignature) errs.push('Debe cargar su firma digital');
    if (errs.length > 0) { setErrors(errs); return null; }
    setErrors([]);
    setSaving(true);
    try {
      const closed = { ...formData, fechaCierre: new Date().toISOString(), firmaDigital: { firma: doctorSignature, fecha: new Date().toISOString() }, _etapa: 'cerrada' };
      onClose?.(closed);
      setFormData(null);
      setSelectedPatient(null);
      return closed;
    } finally { setSaving(false); }
  }, [formData, doctorSignature, onClose]);

  const cancelHC = useCallback(() => { setFormData(null); setSelectedPatient(null); setErrors([]); }, []);

  return { formData, selectedPatient, saving, errors, startNewHC, updateField, closeHC, cancelHC, setErrors };
};