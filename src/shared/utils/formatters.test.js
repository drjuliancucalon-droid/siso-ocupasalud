// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Tests: formatters.js
// FASE 4 — ETAPA N
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { formatMoneda, formatNumero, formatFechaCorta, formatISO, getSpanishDate, numeroALetras } from './formatters.js';

describe('formatMoneda', () => {
  it('debe formatear moneda colombiana', () => {
    const result = formatMoneda(1234567);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('debe manejar 0', () => {
    const result = formatMoneda(0);
    expect(result).toBeTruthy();
  });

  it('debe manejar null', () => {
    const result = formatMoneda(null);
    expect(result).toBeTruthy();
  });
});

describe('formatNumero', () => {
  it('debe formatear número con separadores', () => {
    const result = formatNumero(1234567);
    expect(result).toContain('1');
  });

  it('debe manejar 0', () => {
    const result = formatNumero(0);
    expect(result).toBeTruthy();
  });
});

describe('formatFechaCorta', () => {
  it('debe formatear fecha ISO', () => {
    const result = formatFechaCorta('2024-01-15');
    expect(result).toBeTruthy();
  });

  it('debe manejar null', () => {
    const result = formatFechaCorta(null);
    expect(result).toBe('');
  });
});

describe('formatISO', () => {
  it('debe formatear fecha a ISO', () => {
    const result = formatISO(new Date('2024-01-15'));
    expect(result).toContain('2024');
  });
});

describe('getSpanishDate', () => {
  it('debe retornar fecha en español', () => {
    const result = getSpanishDate('2024-01-15');
    expect(result).toBeTruthy();
  });

  it('debe manejar null', () => {
    const result = getSpanishDate(null);
    expect(result).toBeTruthy();
  });
});

describe('numeroALetras', () => {
  it('debe convertir 0 a letras', () => {
    const result = numeroALetras(0);
    expect(result).toBeTruthy();
  });

  it('debe convertir 100 a letras', () => {
    const result = numeroALetras(100);
    expect(result).toBeTruthy();
  });

  it('debe convertir 1000000 a letras', () => {
    const result = numeroALetras(1000000);
    expect(result).toBeTruthy();
  });

  it('debe manejar null', () => {
    const result = numeroALetras(null);
    expect(result).toBe('');
  });
});