// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — AIConfigPanel Component
// FASE 4 — ETAPA P: Extraído de App.jsx L10445
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';

/**
 * Panel de configuración de IA.
 * @param {Object} props
 * @param {Object} props.aiConfig - Configuración actual de IA
 * @param {Function} props.onSave - Callback al guardar
 * @param {Function} props.onClose - Callback al cerrar
 */
export const AIConfigPanel = ({ aiConfig = {}, onSave, onClose }) => {
  const [config, setConfig] = useState({
    provider: aiConfig.provider || 'openai',
    model: aiConfig.model || 'gpt-3.5-turbo',
    apiKey: aiConfig.apiKey || '',
    temperature: aiConfig.temperature || 0.7,
    maxTokens: aiConfig.maxTokens || 1000,
    enabled: aiConfig.enabled !== false,
  });

  const handleSave = () => {
    if (onSave) onSave(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Configuración de IA</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="local">Local</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="sk-..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura</label>
                <input
                  type="number"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  min="0" max="2" step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                  min="100" max="4000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Habilitar IA</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};