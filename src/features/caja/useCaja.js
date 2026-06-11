// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useCaja
// FASE 4 — ETAPA L: Caja menor
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';

export const useCaja = ({ userId }) => {
  const suf = userId || 'shared';
  const [movimientos, setMovimientos] = useState(() => sp(`siso_caja_${suf}`, []));

  const addMovimiento = useCallback((mov) => {
    const entry = { ...mov, id: 'caj_' + Date.now(), fecha: mov.fecha || new Date().toISOString().slice(0, 10) };
    const newList = [...movimientos, entry];
    _ls.setItem(`siso_caja_${suf}`, JSON.stringify(newList));
    setMovimientos(newList);
    return newList;
  }, [movimientos, suf]);

  const deleteMovimiento = useCallback((id) => {
    const newList = movimientos.filter(m => m.id !== id);
    _ls.setItem(`siso_caja_${suf}`, JSON.stringify(newList));
    setMovimientos(newList);
    return newList;
  }, [movimientos, suf]);

  const getSaldo = useCallback(() => {
    return movimientos.reduce((sum, m) => {
      const val = parseFloat(m.valor) || 0;
      return m.tipo === 'ingreso' ? sum + val : sum - val;
    }, 0);
  }, [movimientos]);

  return { movimientos, addMovimiento, deleteMovimiento, getSaldo };
};