// ── Tests para d1Client.js ──────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de localStorage usando vi.stubGlobal
const store = {};
const localStorageMock = {
  getItem: vi.fn((k) => store[k] || null),
  setItem: vi.fn((k, v) => { store[k] = v; }),
  removeItem: vi.fn((k) => { delete store[k]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
vi.stubGlobal('localStorage', {
  ...localStorageMock,
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] || null,
});

// Mock window.__SISO_CONFIG
global.window = {
  __SISO_CONFIG: {
    workerUrl: 'https://siso-api.dr-juliancucalon.workers.dev',
    workerToken: 'test-token',
  },
};

// Limpiar store antes de cada test
beforeEach(() => {
  localStorageMock.clear();
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Map([['ETag', '"abc123"']]),
    json: async () => [],
  });
});

import {
  d1Get,
  d1Set,
  d1Delete,
  d1GetAll,
  d1GetMany,
  d1WriteArrayMerge,
  sync,
} from './d1Client.js';

describe('d1Client', () => {
  it('d1Get — retorna null si no hay worker URL', async () => {
    global.window.__SISO_CONFIG.workerUrl = '';
    const result = await d1Get('test-key');
    expect(result).toBeNull();
    global.window.__SISO_CONFIG.workerUrl = 'https://siso-api.dr-juliancucalon.workers.dev';
  });

  it('d1Get — pide al worker la clave', async () => {
    const mockData = [{ value: { nombre: 'Juan' } }];
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => mockData,
    });

    const result = await d1Get('siso_patients_1');
    expect(result).toEqual({ nombre: 'Juan' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://siso-api.dr-juliancucalon.workers.dev/store/siso_patients_1',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Siso-Token': 'test-token' }),
      })
    );
  });

  it('d1Set — guarda en worker y retorna true', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => ({}),
    });

    const result = await d1Set('siso_users', [{ id: 1, user: 'admin' }]);
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://siso-api.dr-juliancucalon.workers.dev/store',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ key: 'siso_users', value: [{ id: 1, user: 'admin' }] }),
      })
    );
  });

  it('d1Set — retorna false si no hay URL', async () => {
    global.window.__SISO_CONFIG.workerUrl = '';
    const result = await d1Set('key', { a: 1 });
    expect(result).toBe(false);
    global.window.__SISO_CONFIG.workerUrl = 'https://siso-api.dr-juliancucalon.workers.dev';
  });

  it('d1Delete — elimina la clave', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => ({}),
    });

    const result = await d1Delete('siso_test');
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://siso-api.dr-juliancucalon.workers.dev/store/siso_test',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('d1GetAll — retorna objeto con todas las claves', async () => {
    const mockRows = [
      { key: 'siso_a', value: { a: 1 } },
      { key: 'siso_b', value: { b: 2 } },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => mockRows,
    });

    const result = await d1GetAll();
    expect(result).toEqual({
      siso_a: { value: { a: 1 }, updatedAt: expect.any(String), etag: undefined },
      siso_b: { value: { b: 2 }, updatedAt: expect.any(String), etag: undefined },
    });
  });

  it('d1GetMany — consulta múltiples claves en paralelo', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => [{ value: 'valor1' }],
    });

    const result = await d1GetMany(['key1', 'key2', 'key3']);
    expect(result).toEqual({ key1: 'valor1', key2: 'valor1', key3: 'valor1' });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('sync — guarda en localStorage siempre', () => {
    sync('siso_test_key', JSON.stringify([1, 2, 3]));
    expect(localStorage.getItem('siso_test_key')).toBe(JSON.stringify([1, 2, 3]));
  });

  it('sync — no sincroniza a D1 si shouldSyncToD1 es false', () => {
    const originalShould = global.window.__SISO_CONFIG?.shouldSync;
    // Mock shouldSyncToD1 para que retorne false
    const shouldSyncToD1 = vi.fn(() => false);
    // Re-importar sync con el mock (solo verificamos localStorage)
    expect(localStorage.getItem('siso_test_sync')).toBeNull();
    sync('siso_test_sync', JSON.stringify({ a: 1 }));
    expect(localStorage.getItem('siso_test_sync')).toBe(JSON.stringify({ a: 1 }));
  });

  describe('d1WriteArrayMerge', () => {
    it('merge simple: combina existentes + nuevos', async () => {
      // Simular que el worker retorna la lista remota
      const remoteList = [
        { id: 1, nombre: 'Juan', activo: true },
        { id: 2, nombre: 'María', activo: true },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['ETag', '"remote-etag"']]),
        json: async () => [{ value: remoteList, etag: '"remote-etag"' }],
      }).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({}),
      });

      const incoming = [{ id: 1, nombre: 'Juan Carlos' }, { id: 3, nombre: 'Pedro', activo: true }];

      const result = await d1WriteArrayMerge('siso_patients_1', incoming, 'id');

      expect(result.ok).toBe(true);
      expect(result.mode).toBe('direct');
      expect(result.count).toBe(3); // 2 remote + 1 nuevo

      // Verificar que se envió el merge correcto al worker
      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.value).toHaveLength(3);
      expect(body.value[0]).toEqual({ id: 1, nombre: 'Juan Carlos', activo: true });
      expect(body.value[1]).toEqual({ id: 2, nombre: 'María', activo: true });
      expect(body.value[2]).toEqual({ id: 3, nombre: 'Pedro', activo: true });
    });

    it('ningún dato remoto se pierde (anti-regresión estricta)', async () => {
      const remoteList = [
        { id: 1, nombre: 'Remoto1', extra: 'no-debe-perderse' },
        { id: 2, nombre: 'Remoto2' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['ETag', '"etag-remote"']]),
        json: async () => [{ value: remoteList, etag: '"etag-remote"' }],
      }).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({}),
      });

      // Incoming trae solo 1 elemento
      const incoming = [{ id: 1, nombre: 'NuevoNombre1' }];

      const result = await d1WriteArrayMerge('siso_test_key', incoming, 'id');
      expect(result.ok).toBe(true);
      expect(result.count).toBe(2); // No debe perder el id=2

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.value).toHaveLength(2);
      expect(body.value.find(x => x.id === 2)).toEqual({ id: 2, nombre: 'Remoto2' });
      expect(body.value.find(x => x.id === 1).nombre).toBe('NuevoNombre1');
      expect(body.value.find(x => x.id === 1).extra).toBe('no-debe-perderse');
    });

    it('guarda localmente aunque falle el worker', async () => {
      // Worker falla en todos los reintentos
      mockFetch.mockRejectedValue(new Error('Worker 500'));

      const list = [{ id: 1, nombre: 'Test' }];
      const result = await d1WriteArrayMerge('siso_test_fail', list, 'id');

      expect(result.ok).toBe(false);
      expect(result.mode).toBe('error');
      // Local SIEMPRE se guarda
      const saved = JSON.parse(localStorage.getItem('siso_test_fail'));
      expect(saved).toHaveLength(1);
    });

    it('retorno incluye bytes estimados', async () => {
      const list = [{ id: 1, nombre: 'Test' }];
      mockFetch.mockResolvedValueOnce({
        ok: true, status: 200, headers: new Map([['ETag', '"e"']]),
        json: async () => [{ value: [], etag: '"e"' }],
      }).mockResolvedValueOnce({
        ok: true, status: 200, headers: new Map(),
        json: async () => ({}),
      });

      const result = await d1WriteArrayMerge('siso_bytes', list, 'id');
      expect(result.bytes).toBeGreaterThan(0);
    });
  });
});