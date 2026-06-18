// src/hooks/useBackendData.js — Hook para datos del backend/D1
// Proporciona datos sincronizados con localStorage como fallback
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Hook que obtiene datos de una clave de localStorage
 * con caché y refresco periódico
 */
export function useBackendData(key, defaultValue = null) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Si tiene _data, es un wrapper siso-format
        if (parsed && typeof parsed === 'object' && '_data' in parsed) {
          return parsed._data;
        }
        return parsed;
      }
    } catch { /* ignore */ }
    return defaultValue;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    try {
      setLoading(true);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        const value = parsed && typeof parsed === 'object' && '_data' in parsed ? parsed._data : parsed;
        setData(value);
        setError(null);
      } else {
        setData(defaultValue);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);

  // Sincronizar cambios desde otros tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, refresh]);

  return { data, loading, error, refresh, setData };
}

/**
 * Hook para obtener un objeto específico de una lista
 * Ej: doctor = useBackendObject('/data/doctor', 'siso_doctor_data', 'doctor')
 */
export function useBackendObject(path, key, field = null) {
  const { data, loading } = useBackendData(key, null);
  let value = data;
  if (field && data && typeof data === 'object') {
    value = data[field] || data;
  }
  return { data: value, loading };
}

/**
 * Hook para obtener una lista desde localStorage
 */
export function useBackendList(key, defaultValue = []) {
  const { data, loading, error, refresh, setData } = useBackendData(key, defaultValue);
  return { data: Array.isArray(data) ? data : [], loading, error, refresh, setData };
}