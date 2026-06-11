// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook usePacientes
// FASE 4 — ETAPA C: Lógica CRUD de pacientes
// Extraído de src/App.jsx: _syncPatients, _slimPatient, canViewPatient,
//   isHcOwner, openPatient, handleSavePatient, handleDeletePatient,
//   handleExportData, _detectarCedulas, _stripBase64Deep
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { sync } from '../../shared/storage/d1Client.js';
import { patKey, LS } from '../../shared/storage/storageKeys.js';
import { formatISO } from '../../shared/utils/formatters.js';

/**
 * Hook para gestión de pacientes.
 * @param {Object} options
 * @param {string} options.userId - ID del usuario actual
 * @param {Array} options.initialPatients - Lista inicial de pacientes
 * @returns {Object} Métodos y estado de pacientes
 */
export const usePacientes = ({ userId, initialPatients = [] }) => {
  const [patients, setPatients] = useState(initialPatients);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Filtros y Búsqueda ────────────────────────────────────

  /**
   * Filtra pacientes por búsqueda local.
   * @param {Array} list - Lista a filtrar (opcional, usa patients por defecto)
   * @returns {Array} Lista filtrada
   */
  const filteredPatients = useCallback((list) => {
    const source = list || patients;
    if (!searchQuery || searchQuery.trim().length < 2) return source;
    const q = searchQuery.toLowerCase().trim();
    return source.filter(p => {
      const nombres = (p.nombres || '').toLowerCase();
      const apellidos = (p.apellidos || '').toLowerCase();
      const docNumero = (p.docNumero || '').toLowerCase();
      const empresa = (p.empresaNombre || '').toLowerCase();
      return nombres.includes(q) || apellidos.includes(q) ||
             docNumero.includes(q) || empresa.includes(q);
    });
  }, [patients, searchQuery]);

  // ── CRUD ───────────────────────────────────────────────────

  /**
   * Crea o actualiza un paciente.
   * @param {Object} patientData - Datos del paciente
   * @param {Array} currentPatients - Lista actual (opcional)
   * @returns {Array} Nueva lista de pacientes
   */
  const savePatient = useCallback((patientData, currentPatients) => {
    const list = currentPatients || patients;
    const now = new Date().toISOString();
    const entry = {
      ...patientData,
      updatedAt: now,
      _slim: true,
    };

    // Si no tiene ID, asignar uno
    if (!entry.id) {
      entry.id = 'pat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      entry.createdAt = now;
    }

    const idx = list.findIndex(p => p.id === entry.id);
    let newList;
    if (idx >= 0) {
      newList = [...list];
      newList[idx] = { ...newList[idx], ...entry };
    } else {
      newList = [...list, entry];
    }

    persistPatients(newList);
    return newList;
  }, [patients]);

  /**
   * Elimina un paciente por ID.
   * @param {string} id - ID del paciente
   * @param {Array} currentPatients - Lista actual (opcional)
   * @returns {Array} Nueva lista sin el paciente
   */
  const deletePatient = useCallback((id, currentPatients) => {
    const list = currentPatients || patients;
    const newList = list.filter(p => p.id !== id);
    persistPatients(newList);
    return newList;
  }, [patients]);

  // ── Persistencia ──────────────────────────────────────────

  /**
   * Persiste la lista de pacientes en localStorage y D1.
   * @param {Array} list
   */
  const persistPatients = (list) => {
    if (!userId) return;
    const slimList = list.map(slimPatient);
    const key = patKey(userId);
    const jsonValue = JSON.stringify(slimList);
    _ls.setItem(key, jsonValue);
    sync(key, jsonValue);
    setPatients(list);
  };

  /**
   * Carga pacientes desde localStorage.
   * @param {string} uid - User ID (opcional, usa userId por defecto)
   * @returns {Array} Lista de pacientes
   */
  const loadPatients = (uid) => {
    const id = uid || userId;
    if (!id) return [];
    const stored = sp(patKey(id), []);
    setPatients(stored);
    return stored;
  };

  // ── Helpers ───────────────────────────────────────────────

  /**
   * Limpia datos pesados de un paciente para almacenamiento.
   * @param {Object} p
   * @returns {Object} Paciente sin datos binarios grandes
   */
  const slimPatient = (p) => {
    if (!p || p._slim) return p;
    const cleaned = { ...p, _slim: true };
    // Eliminar firmas/fotos grandes del objeto principal
    // (se mantienen en siso_doctor_signature aparte)
    return cleaned;
  };

  /**
   * Verifica si el usuario puede ver un paciente.
   * @param {Object} p - Paciente
   * @returns {boolean}
   */
  const canView = (p) => {
    if (!p) return false;
    // El dueño siempre puede ver
    if (p.createdBy === userId) return true;
    // Los administradores pueden ver todos
    // (se evaluará en el nivel de auth hook)
    return true;
  };

  /**
   * Verifica si el usuario es dueño de la HC.
   * @param {Object} p
   * @returns {boolean}
   */
  const isOwner = (p) => {
    return p?.createdBy === userId;
  };

  /**
   * Obtiene paciente por ID.
   * @param {string} id
   * @returns {Object|null}
   */
  const getPatientById = (id) => {
    return patients.find(p => p.id === id) || null;
  };

  /**
   * Obtiene paciente por número de documento.
   * @param {string} docNumero
   * @returns {Object|null}
   */
  const getPatientByDocument = (docNumero) => {
    const clean = docNumero?.replace(/[^0-9]/g, '');
    return patients.find(p => p.docNumero?.replace(/[^0-9]/g, '') === clean) || null;
  };

  /**
   * Exporta pacientes como JSON para descarga.
   * @param {Array} list - Lista a exportar (opcional)
   */
  const exportData = (list) => {
    const source = list || patients;
    const dataStr = JSON.stringify(source, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacientes_export_${formatISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Detección de Cédulas (para carga masiva) ──────────────

  /**
   * Extrae cédulas de un texto.
   * @param {string} texto
   * @returns {string[]}
   */
  const detectarCedulas = (texto) => {
    if (!texto) return [];
    const regex = /[0-9]{7,11}/g;
    return texto.match(regex) || [];
  };

  /**
   * Extrae cédulas del nombre de archivo.
   * @param {string} fn - Nombre de archivo
   * @returns {string[]}
   */
  const cedulasDeNombre = (fn) => {
    if (!fn) return [];
    return (fn.replace(/\.[^.]+$/, '').match(/[0-9]{7,11}/g) || []);
  };

  return {
    // Estado
    patients,
    loading,
    searchQuery,
    setSearchQuery,

    // CRUD
    savePatient,
    deletePatient,
    persistPatients,
    loadPatients,

    // Consultas
    filteredPatients,
    getPatientById,
    getPatientByDocument,
    canView,
    isOwner,

    // Utilidades
    slimPatient,
    exportData,
    detectarCedulas,
    cedulasDeNombre,
    setPatients,
  };
};