// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useCustodia
// FASE 4 — ETAPA L: Cartas de custodia
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';

export const useCustodia = () => {
  const [cartas, setCartas] = useState(() => sp(LS.CARTAS_CUSTODIA, []));

  const saveCarta = useCallback((cartaData) => {
    const entry = { ...cartaData, id: cartaData.id || 'cust_' + Date.now(), createdAt: new Date().toISOString() };
    const idx = cartas.findIndex(c => c.id === entry.id);
    const newList = idx >= 0 ? cartas.map((c, i) => i === idx ? entry : c) : [...cartas, entry];
    _ls.setItem(LS.CARTAS_CUSTODIA, JSON.stringify(newList));
    setCartas(newList);
    return newList;
  }, [cartas]);

  const deleteCarta = useCallback((id) => {
    const newList = cartas.filter(c => c.id !== id);
    _ls.setItem(LS.CARTAS_CUSTODIA, JSON.stringify(newList));
    setCartas(newList);
    return newList;
  }, [cartas]);

  const getCartasByCompany = useCallback((empresaId) => {
    return cartas.filter(c => c.empresaId === empresaId);
  }, [cartas]);

  return { cartas, saveCarta, deleteCarta, getCartasByCompany };
};