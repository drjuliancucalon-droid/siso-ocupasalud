// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Tests: validators.js
// FASE 4 — ETAPA N
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { validatePasswordStrength, analyzeBP, analyzeHR, analyzeBMI, isValidEmail, isValidNIT } from './validators.js';

describe('validatePasswordStrength', () => {
  it('debe rechazar contraseña vacía', () => {
    const result = validatePasswordStrength('');
    expect(result.valid).toBe(false);
  });

  it('debe rechazar contraseña muy corta', () => {
    const result = validatePasswordStrength('abc');
    expect(result.valid).toBe(false);
  });

  it('debe aceptar contraseña fuerte', () => {
    const result = validatePasswordStrength('MiClave123!');
    expect(result.valid).toBe(true);
  });

  it('debe rechazar contraseña sin mayúscula', () => {
    const result = validatePasswordStrength('miclave123!');
    expect(result.valid).toBe(false);
  });

  it('debe rechazar contraseña sin número', () => {
    const result = validatePasswordStrength('MiClave!');
    expect(result.valid).toBe(false);
  });
});

describe('analyzeBP', () => {
  it('debe detectar presión normal', () => {
    const result = analyzeBP('120/80');
    expect(result).toBeTruthy();
  });

  it('debe detectar presión alta', () => {
    const result = analyzeBP('160/100');
    expect(result).toBeTruthy();
  });

  it('debe manejar valor inválido', () => {
    const result = analyzeBP('abc');
    expect(result).toBeTruthy();
  });
});

describe('analyzeHR', () => {
  it('debe detectar frecuencia normal', () => {
    const result = analyzeHR('72');
    expect(result).toBeTruthy();
  });

  it('debe detectar taquicardia', () => {
    const result = analyzeHR('120');
    expect(result).toBeTruthy();
  });

  it('debe manejar valor inválido', () => {
    const result = analyzeHR('abc');
    expect(result).toBeTruthy();
  });
});

describe('analyzeBMI', () => {
  it('debe calcular IMC normal', () => {
    const result = analyzeBMI('70', '170');
    expect(result).toBeTruthy();
  });

  it('debe calcular IMC sobrepeso', () => {
    const result = analyzeBMI('90', '170');
    expect(result).toBeTruthy();
  });

  it('debe manejar valores inválidos', () => {
    const result = analyzeBMI('abc', 'xyz');
    expect(result).toBeTruthy();
  });
});

describe('isValidEmail', () => {
  it('debe aceptar email válido', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('debe rechazar email inválido', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('debe rechazar email vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidNIT', () => {
  it('debe aceptar NIT válido', () => {
    expect(isValidNIT('900123456')).toBe(true);
  });

  it('debe rechazar NIT inválido', () => {
    expect(isValidNIT('12')).toBe(false);
  });

  it('debe rechazar NIT vacío', () => {
    expect(isValidNIT('')).toBe(false);
  });
});