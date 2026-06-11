// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — FHIR/RIPS Utilities
// FASE 4 — ETAPA O: Extraído de App.jsx L6789-L7064
// ═══════════════════════════════════════════════════════════════

import { escapeHtml } from './sanitize.js';

/**
 * Genera un recurso FHIR Patient.
 * Extraído de App.jsx L6789
 */
export const generarFHIRPatient = (paciente) => {
  if (!paciente) return null;
  return {
    resourceType: 'Patient',
    id: paciente.id || undefined,
    identifier: [{
      type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'NI' }] },
      system: 'urn:oid:2.16.840.1.113883.19.5',
      value: paciente.docNumero || ''
    }],
    name: [{ family: paciente.apellidos || '', given: [paciente.nombres || ''], use: 'official' }],
    gender: paciente.sexo === 'M' ? 'male' : paciente.sexo === 'F' ? 'female' : 'other',
    birthDate: paciente.fechaNacimiento || '',
    telecom: paciente.celular ? [{ system: 'phone', value: paciente.celular, use: 'mobile' }] : [],
    address: paciente.direccion ? [{ text: paciente.direccion }] : [],
  };
};

/**
 * Genera un recurso FHIR Practitioner.
 * Extraído de App.jsx L6830
 */
export const generarFHIRPractitioner = (medico) => {
  if (!medico) return null;
  return {
    resourceType: 'Practitioner',
    identifier: [{ system: 'urn:oid:2.16.840.1.113883.19.5', value: medico.documento || '' }],
    name: [{ family: medico.apellidos || '', given: [medico.nombres || ''], use: 'official' }],
    qualification: [{
      code: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MD' }] },
      issuer: { display: medico.entidad || 'MINISTERIO DE SALUD' }
    }],
  };
};

/**
 * Genera un recurso FHIR Observation.
 * Extraído de App.jsx L6865
 */
export const generarFHIRObservation = (obs, patientRef, practitionerRef) => {
  if (!obs) return null;
  return {
    resourceType: 'Observation',
    status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: obs.code || '8310-5', display: obs.nombre || 'Signos vitales' }] },
    subject: { reference: `Patient/${patientRef}` },
    performer: [{ reference: `Practitioner/${practitionerRef}` }],
    effectiveDateTime: obs.fecha || new Date().toISOString(),
    valueString: obs.valor || '',
    interpretation: obs.interpretacion ? [{ coding: [{ display: obs.interpretacion }] }] : [],
  };
};

/**
 * Genera un Bundle FHIR.
 * Extraído de App.jsx L6900
 */
export const generarFHIRBundle = (entries) => {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    meta: { lastUpdated: new Date().toISOString() },
    entry: (entries || []).filter(Boolean).map(e => ({ resource: e })),
  };
};

/**
 * Genera JSON RIPS.
 * Extraído de App.jsx L6955
 */
export const generarRIPSJson = (atencion, paciente, medico) => {
  if (!atencion || !paciente) return null;
  return {
    tipoDocumento: paciente.docTipo || 'CC',
    numDocumento: paciente.docNumero || '',
    apellido1: paciente.apellidos || '',
    nombre1: (paciente.nombres || '').split(' ')[0] || '',
    nombre2: (paciente.nombres || '').split(' ')[1] || '',
    sexo: paciente.sexo || '',
    fechaNacimiento: paciente.fechaNacimiento || '',
    codEps: atencion.empresaNit || '',
    razonSocial: atencion.empresaNombre || '',
    conceptoAptitud: atencion.conceptoAptitud || '',
    tipoExamen: atencion.tipoExamen || '',
    fechaInicio: atencion.fecha || '',
    fechaFin: atencion.fechaCierre || atencion.fecha || '',
    medico: medico ? `${medico.nombres || ''} ${medico.apellidos || ''}` : '',
    licencia: medico?.licencia || '',
    usuario: medico?.user || '',
  };
};

/**
 * Genera Reporte Diario de Atención (RDA).
 * Extraído de App.jsx L7064
 */
export const generarRDA = (atenciones, fecha) => {
  const fechaStr = fecha || new Date().toISOString().slice(0, 10);
  const atencionesDia = (atenciones || []).filter(a => (a.fecha || '').startsWith(fechaStr));

  return {
    fecha: fechaStr,
    totalAtenciones: atencionesDia.length,
    porTipo: {
      ocupacional: atencionesDia.filter(a => a.tipoExamen?.toLowerCase().includes('ocupacional')).length,
      ingreso: atencionesDia.filter(a => a.tipoExamen?.toLowerCase().includes('ingreso')).length,
      retiro: atencionesDia.filter(a => a.tipoExamen?.toLowerCase().includes('retiro')).length,
      cambio: atencionesDia.filter(a => a.tipoExamen?.toLowerCase().includes('cambio')).length,
      Periodico: atencionesDia.filter(a => a.tipoExamen?.toLowerCase().includes('periodico')).length,
    },
    porConcepto: {
      apto: atencionesDia.filter(a => (a.conceptoAptitud || '').toLowerCase().includes('apto') && !(a.conceptoAptitud || '').toLowerCase().includes('no apto')).length,
      noApto: atencionesDia.filter(a => (a.conceptoAptitud || '').toLowerCase().includes('no apto')).length,
      apF: atencionesDia.filter(a => (a.conceptoAptitud || '').toLowerCase().includes('apto con')).length,
    },
    detalles: atencionesDia.map(a => ({
      documento: a.docNumero || '',
      nombres: a.nombres || '',
      empresa: a.empresaNombre || '',
      concepto: a.conceptoAptitud || '',
    })),
  };
};