// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useInformes
// FASE 4 — ETAPA J: Informes periódicos
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { sync } from '../../shared/storage/d1Client.js';
import { LS } from '../../shared/storage/storageKeys.js';
import { formatFechaCorta } from '../../shared/utils/formatters.js';

export const useInformes = ({ userId }) => {
  const [informes, setInformes] = useState(() => sp(LS.INFORMES, []));

  const loadInformes = useCallback(() => {
    const data = sp(LS.INFORMES, []);
    setInformes(data);
    return data;
  }, []);

  const saveInforme = useCallback((informeData) => {
    const now = new Date().toISOString();
    const entry = { ...informeData, id: informeData.id || 'inf_' + Date.now(), updatedAt: now };
    const idx = informes.findIndex(i => i.id === entry.id);
    let newList = idx >= 0 ? informes.map((i, pos) => pos === idx ? entry : i) : [...informes, entry];
    _ls.setItem(LS.INFORMES, JSON.stringify(newList));
    _ls.setItem(`${LS.INFORMES_PREFIX}${userId}`, JSON.stringify(newList));
    sync(LS.INFORMES, JSON.stringify(newList));
    setInformes(newList);
    return newList;
  }, [informes, userId]);

  const deleteInforme = useCallback((id) => {
    const newList = informes.filter(i => i.id !== id);
    _ls.setItem(LS.INFORMES, JSON.stringify(newList));
    setInformes(newList);
    return newList;
  }, [informes]);

  const getInformesByCompany = useCallback((empresaId) => {
    return informes.filter(i => i.empresaId === empresaId);
  }, [informes]);

  return { informes, loadInformes, saveInforme, deleteInforme, getInformesByCompany };
};