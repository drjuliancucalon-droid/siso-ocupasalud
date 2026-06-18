// src/stores/authStore.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de d1WriteArrayMerge
const mockD1WriteArrayMerge = vi.fn();
vi.mock('../shared/storage/d1Client.js', () => ({
  d1WriteArrayMerge: (...args) => mockD1WriteArrayMerge(...args),
}));

import { useAuthStore } from '../stores/authStore.js';

describe('authStore', () => {
  beforeEach(() => {
    mockD1WriteArrayMerge.mockReset();
    useAuthStore.setState({
      currentUser: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLocalAuth: false,
      loginAttempts: 0,
      blockedUntil: null,
      lastActivity: null,
      privacidadAceptada: false,
      mustChangePassword: false,
      twoFARequired: false,
    });
  });

  it('loginLocal — setea estado y sincroniza a D1', async () => {
    const user = { id: 'u1', user: 'juan', role: 'medico' };
    await useAuthStore.getState().loginLocal(user);
    const state = useAuthStore.getState();
    expect(state.currentUser).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLocalAuth).toBe(true);
    expect(mockD1WriteArrayMerge).toHaveBeenCalledWith('siso_auth_sessions', [expect.objectContaining({ id: 'u1' })], 'id');
  });

  it('loginLocal — si D1 falla, no bloquea', async () => {
    mockD1WriteArrayMerge.mockRejectedValue(new Error('D1 down'));
    const user = { id: 'u2', user: 'maria', role: 'administrador' };
    await useAuthStore.getState().loginLocal(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('logout — limpia estado y sincroniza a D1', async () => {
    useAuthStore.setState({
      currentUser: { id: 'u3', user: 'x' },
      isAuthenticated: true,
    });
    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.currentUser).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(mockD1WriteArrayMerge).toHaveBeenCalledWith('siso_auth_sessions', [], 'id');
  });

  it('isAdmin / isMedico / isSecretaria — por rol', () => {
    useAuthStore.setState({ currentUser: { role: 'administrador' } });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
    expect(useAuthStore.getState().isMedico()).toBe(true);
    expect(useAuthStore.getState().isSecretaria()).toBe(false);

    useAuthStore.setState({ currentUser: { role: 'medico' } });
    expect(useAuthStore.getState().isAdmin()).toBe(false);
    expect(useAuthStore.getState().isMedico()).toBe(true);

    useAuthStore.setState({ currentUser: { role: 'secretaria' } });
    expect(useAuthStore.getState().isSecretaria()).toBe(true);
  });

  it('canUse / canAccess / canAccessModule — segun planConfig', () => {
    useAuthStore.setState({ currentUser: { role: 'super_admin' } });
    expect(useAuthStore.getState().canUse('agenda')).toBe(true);
    expect(useAuthStore.getState().canAccess('agenda')).toBe(true);
  });
});