// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useEncuestas
// FASE 4 — ETAPA L: Encuestas sociodemográficas
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';

export const useEncuestas = () => {
  const [encuestas, setEncuestas] = useState(() => sp(LS.ENCUESTAS, []));

  const saveEncuesta = useCallback((data) => {
    const entry = { ...data, id: 'enc_' + Date.now(), createdAt: new Date().toISOString() };
    const newList = [...encuestas, entry].slice(-500);
    _ls.setItem(LS.ENCUESTAS, JSON.stringify(newList));
    setEncuestas(newList);
    return newList;
  }, [encuestas]);

  const getEncuestasByPaciente = useCallback((pacienteId) => {
    return encuestas.filter(e => e.pacienteId === pacienteId);
  }, [encuestas]);

  return { encuestas, saveEncuesta, getEncuestasByPaciente };
};