// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — ChangePasswordForm Component
// FASE 4 — ETAPA O: Extraído de App.jsx L16603
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { validatePasswordStrength } from '../../shared/utils/validators.js';

/**
 * Formulario de cambio de contraseña.
 * @param {Object} props
 * @param {Function} props.onChangePassword - Callback(newPassword)
 * @param {Function} props.onClose - Callback al cerrar
 */
export const ChangePasswordForm = ({ onChangePassword, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      setError(validation.message || 'Contraseña no válida');
      return;
    }

    try {
      onChangePassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError('Error al cambiar contraseña: ' + (err.message || ''));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cambiar Contraseña</h2>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium">Contraseña actualizada exitosamente</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Cambiar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};