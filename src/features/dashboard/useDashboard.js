// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useDashboard
// FASE 4 — ETAPA H: Estadísticas del dashboard
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo } from 'react';
import { sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';

export const useDashboard = ({ userId }) => {
  const [period, setPeriod] = useState('all');

  const stats = useMemo(() => {
    const patients = sp(`siso_db_patients_${userId}`, []);
    const closed = sp(LS.ATENCIONES_CERRADAS, []);
    const companies = sp(`siso_companies_${userId}`, []);

    const totalPatients = patients.length;
    const totalClosed = closed.length;
    const totalCompanies = companies.length;
    const openHC = patients.filter(p => !p.fechaCierre).length;
    const aptos = closed.filter(a => (a.conceptoAptitud || '').toLowerCase().includes('apto') && !(a.conceptoAptitud || '').toLowerCase().includes('no apto')).length;
    const noAptos = closed.filter(a => (a.conceptoAptitud || '').toLowerCase().includes('no apto')).length;

    return { totalPatients, totalClosed, totalCompanies, openHC, aptos, noAptos };
  }, [userId]);

  const refresh = useCallback(() => {
    // Forzar recarga
    setPeriod(p => p === 'all' ? 'month' : 'all');
  }, []);

  return { stats, period, setPeriod, refresh };
};