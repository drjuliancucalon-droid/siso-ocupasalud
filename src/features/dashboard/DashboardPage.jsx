// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Dashboard Principal
// FASE 4 — ETAPA H
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { useDashboard } from './useDashboard.js';
import { formatMoneda } from '../../shared/utils/formatters.js';

export const DashboardPage = ({ userId }) => {
  const { stats } = useDashboard({ userId });

  const cards = useMemo(() => [
    { label: 'Total Pacientes', value: stats.totalPatients, color: 'bg-blue-500' },
    { label: 'HC Cerradas', value: stats.totalClosed, color: 'bg-green-500' },
    { label: 'HC Abiertas', value: stats.openHC, color: 'bg-yellow-500' },
    { label: 'Empresas', value: stats.totalCompanies, color: 'bg-purple-500' },
    { label: 'Aptos', value: stats.aptos, color: 'bg-emerald-500' },
    { label: 'No Aptos', value: stats.noAptos, color: 'bg-red-500' },
  ], [stats]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className={`w-3 h-3 rounded-full ${card.color} mb-2`}></div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};