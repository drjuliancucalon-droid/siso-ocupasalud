// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Formulario de Login
// FASE 4 — ETAPA G: Extraído de App.jsx L12482
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { isLoginBlocked, getLoginRemainingMin } from '../../shared/utils/security.js';

/**
 * Formulario de inicio de sesión.
 * @param {Object} props
 * @param {Function} props.onLogin - Función de login(username, password) => {ok, error, user}
 * @param {Function} props.onRecuperar - Callback para recuperar acceso
 */
export const LoginForm = ({ onLogin, onRecuperar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (isLoginBlocked()) {
      const t = setInterval(() => {
        const min = getLoginRemainingMin();
        setRemaining(min);
        if (min <= 0) clearInterval(t);
      }, 1000);
      return () => clearInterval(t);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = onLogin(username, password);
      if (!result.ok) setError(result.error || 'Error de autenticación');
    } catch (err) {
      setError('Error de conexión: ' + (err.message || ''));
    }
    setLoading(false);
  };

  if (isLoginBlocked()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-700 mb-2">Acceso Bloqueado</h2>
            <p className="text-red-600">Demasiados intentos fallidos de inicio de sesión.</p>
            {remaining > 0 && (
              <p className="text-sm text-red-500 mt-2">
                Espere aproximadamente {remaining} minuto(s) para intentar de nuevo.
              </p>
            )}
          </div>
          <button onClick={onRecuperar} className="mt-4 text-sm text-blue-600 hover:underline">
            ¿Olvidó su acceso?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">OCUPASALUD</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema de Historias Clínicas Ocupacionales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Nombre de usuario"
              autoFocus
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Contraseña"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {onRecuperar && (
          <div className="mt-4 text-center">
            <button onClick={onRecuperar} className="text-sm text-blue-600 hover:underline">
              ¿Olvidó su acceso?
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            v{new Date().getFullYear()} &middot; OcupaSalud SISO
          </p>
        </div>
      </div>
    </div>
  );
};