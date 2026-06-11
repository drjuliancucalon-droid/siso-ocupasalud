// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Configuración de Vitest
// FASE 4 — ETAPA N: Tests Unitarios y de Integración
// ═══════════════════════════════════════════════════════════════

export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/shared/**/*.js', 'src/features/**/*.js'],
      exclude: ['src/test/'],
    },
  },
};
