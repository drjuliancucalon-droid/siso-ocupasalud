// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useBills
// FASE 4 — ETAPA I: Facturación y cuentas de cobro
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { sync } from '../../shared/storage/d1Client.js';
import { LS, billsKey } from '../../shared/storage/storageKeys.js';
import { formatMoneda } from '../../shared/utils/formatters.js';

export const useBills = ({ userId }) => {
  const [bills, setBills] = useState(() => sp(billsKey(userId), []));
  const [loading, setLoading] = useState(false);

  const loadBills = useCallback(() => {
    const data = sp(billsKey(userId), []);
    setBills(data);
    return data;
  }, [userId]);

  const saveBill = useCallback((billData) => {
    const now = new Date().toISOString();
    const entry = { ...billData, id: billData.id || 'bill_' + Date.now(), updatedAt: now };
    const idx = bills.findIndex(b => b.id === entry.id);
    let newList;
    if (idx >= 0) { newList = [...bills]; newList[idx] = entry; }
    else newList = [...bills, entry];
    const key = billsKey(userId);
    _ls.setItem(key, JSON.stringify(newList));
    sync(key, JSON.stringify(newList));
    setBills(newList);
    return newList;
  }, [bills, userId]);

  const deleteBill = useCallback((id) => {
    const newList = bills.filter(b => b.id !== id);
    const key = billsKey(userId);
    _ls.setItem(key, JSON.stringify(newList));
    setBills(newList);
    return newList;
  }, [bills, userId]);

  const getBillTotal = useCallback((items) => {
    return (items || []).reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0);
  }, []);

  const getBillTotalFormatted = useCallback((items) => {
    return formatMoneda(getBillTotal(items));
  }, [getBillTotal]);

  // Obtener atenciones disponibles para facturar
  const getAvailableAttentions = useCallback(() => {
    const closed = sp(LS.ATENCIONES_CERRADAS, []);
    const billedIds = new Set((bills || []).flatMap(b => (b.atencionIds || [])));
    return closed.filter(a => !billedIds.has(a.id));
  }, [bills]);

  return { bills, loading, loadBills, saveBill, deleteBill, getBillTotal, getBillTotalFormatted, getAvailableAttentions };
};