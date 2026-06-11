// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useContabilidad
// FASE 4 — ETAPA L
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';

export const useContabilidad = ({ userId }) => {
  const key = `siso_contabilidad_${userId || 'shared'}`;
  const [cuentas, setCuentas] = useState(() => sp(key, []));

  const generarReporte = useCallback((periodo, data) => {
    const entry = { id: 'cta_' + Date.now(), periodo, data, createdAt: new Date().toISOString() };
    const newList = [...cuentas, entry];
    _ls.setItem(key, JSON.stringify(newList));
    setCuentas(newList);
    return newList;
  }, [cuentas, key]);

  const getCuentasByPeriodo = useCallback((periodo) => {
    return cuentas.filter(c => c.periodo === periodo);
  }, [cuentas]);

  return { cuentas, generarReporte, getCuentasByPeriodo };
};