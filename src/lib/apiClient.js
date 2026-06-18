// src/lib/apiClient.js — Cliente API universal
// Modo transición: intenta backend, fallback a localStorage
const API_BASE = import.meta.env.VITE_WORKER_URL || '';

const _ls = typeof localStorage !== 'undefined' ? localStorage : null;

class ApiClient {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    const token = _ls?.getItem('siso-auth') ? JSON.parse(_ls.getItem('siso-auth'))?.token : null;

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      if (this.baseUrl) {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
      
      // Sin backend: mock response para desarrollo
      return this._mockResponse(method, path, body);
    } catch (error) {
      console.warn(`[API] Fallback: ${method} ${path}`, error.message);
      return this._mockResponse(method, path, body);
    }
  }

  _mockResponse(method, path, body) {
    if (path === '/auth/login') {
      const { username, password } = body || {};
      const users = JSON.parse(_ls?.getItem('siso_users') || '[]');
      const user = users.find(u => u.user === username && u.pass === password);
      
      if (username === 'admin' && password === 'admin123') {
        return {
          user: { user: 'admin', role: 'administrador', nombre: 'Administrador' },
          token: 'mock-token-admin',
          refreshToken: 'mock-refresh',
        };
      }
      
      if (user) {
        return {
          user,
          token: 'mock-token-' + user.user,
          refreshToken: 'mock-refresh',
        };
      }
      
      throw new Error('Credenciales inválidas');
    }
    
    if (path.startsWith('/data/') && method === 'GET') {
      const key = path.replace('/data/', '');
      return JSON.parse(_ls?.getItem(key) || 'null') || {};
    }
    
    return { ok: true, mock: true };
  }

  get(path) { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  put(path, body) { return this.request('PUT', path, body); }
  delete(path) { return this.request('DELETE', path); }
}

export const apiClient = new ApiClient();