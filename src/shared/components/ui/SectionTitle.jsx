// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — SectionTitle Component
// FASE 4 — ETAPA O: Extraído de App.jsx L9530
// ═══════════════════════════════════════════════════════════════

import React from 'react';

export const SectionTitle = ({ title, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-700 border-blue-200 bg-blue-50',
    green: 'text-green-700 border-green-200 bg-green-50',
    red: 'text-red-700 border-red-200 bg-red-50',
    purple: 'text-purple-700 border-purple-200 bg-purple-50',
    yellow: 'text-yellow-700 border-yellow-200 bg-yellow-50',
    gray: 'text-gray-700 border-gray-200 bg-gray-50',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border mb-4 ${cls}`}>
      {Icon && <Icon size={18} />}
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
  );
};