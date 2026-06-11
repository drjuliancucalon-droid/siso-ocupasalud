// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Tests: sanitize.js
// FASE 4 — ETAPA N
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { sanitizeInput, escapeHtml, escapeAttr, sanitizeSimple, nl2br, cleanControlChars } from './sanitize.js';

describe('sanitizeInput', () => {
  it('debe escapar caracteres HTML peligrosos', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('<script>alert("xss")<&#x2F;script>');
  });

  it('debe escapar &', () => {
    expect(sanitizeInput('a & b')).toBe('a & b');
  });

  it('debe recortar espacios', () => {
    expect(sanitizeInput('  hola  ')).toBe('hola');
  });

  it('debe retornar el mismo valor si no es string', () => {
    expect(sanitizeInput(123)).toBe(123);
    expect(sanitizeInput(null)).toBe(null);
    expect(sanitizeInput(undefined)).toBe(undefined);
  });

  it('debe escapar comillas simples', () => {
    expect(sanitizeInput("it's")).toBe('it&#x27;s');
  });

  it('debe escapar barras', () => {
    expect(sanitizeInput('path/to/file')).toBe('path&#x2F;to&#x2F;file');
  });
});

describe('escapeHtml', () => {
  it('debe escapar &, <, >', () => {
    expect(escapeHtml('<b>Hola & Adiós</b>')).toBe('<b>Hola & Adiós</b>');
  });

  it('debe manejar null como string vacío', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('debe retornar string normal sin cambios', () => {
    expect(escapeHtml('Hola mundo')).toBe('Hola mundo');
  });
});

describe('escapeAttr', () => {
  it('debe escapar comillas dobles', () => {
    expect(escapeAttr('valor "especial"')).toBe('valor "especial"');
  });

  it('debe escapar comillas simples', () => {
    expect(escapeAttr("it's")).toBe('it&#x27;s');
  });
});

describe('sanitizeSimple', () => {
  it('debe recortar espacios', () => {
    expect(sanitizeSimple('  texto  ')).toBe('texto');
  });

  it('debe retornar string vacío para no-string', () => {
    expect(sanitizeSimple(null)).toBe('');
    expect(sanitizeSimple(undefined)).toBe('');
  });
});

describe('nl2br', () => {
  it('debe convertir saltos de línea a <br/>', () => {
    expect(nl2br('line1\nline2')).toBe('line1<br/>line2');
  });

  it('debe escapar HTML antes de convertir', () => {
    expect(nl2br('<script>\n</script>')).toBe('<script><br/></script>');
  });
});

describe('cleanControlChars', () => {
  it('debe eliminar caracteres de control', () => {
    expect(cleanControlChars('hola\x00mundo\x1Ftest')).toBe('holamundotest');
  });

  it('debe mantener texto normal', () => {
    expect(cleanControlChars('Hola mundo')).toBe('Hola mundo');
  });
});