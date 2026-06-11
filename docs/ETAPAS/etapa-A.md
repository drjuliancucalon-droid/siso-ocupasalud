# ═══════════════════════════════════════════════════════════════
# ETAPA A — Extracción de Utils Puros y Constantes
# Esfuerzo: S (1 día) | Riesgo: 🟢 BAJO
# ═══════════════════════════════════════════════════════════════

## Objetivo
Extraer funciones de utilidad pura (sin efectos secundarios ni dependencias de React) desde App.jsx hacia `shared/utils/`.

## Checklist de Archivos a Crear

| Archivo | Contenido (funciones de App.jsx) |
|---------|----------------------------------|
| shared/utils/constants.js | `_sisoStableOrigin`, `SESSION_TIMEOUT_MS`, `AI_CONFIG_VERSION`, `MEDICAMENTOS_CO_BASE`, constantes CIE-10, CUPS |
| shared/utils/sanitize.js | `sanitizeInput` (L77), `_sanitize` (L2148), `_e` (L1548 + L23015) → unificadas |
| shared/utils/validators.js | `validatePasswordStrength`, `analyzeBP`, `analyzeHR`, `analyzeBMI`, `_validarContrasena` |
| shared/utils/formatters.js | `numeroALetras`, `getSpanishDate`, `fmtFechaCorta`, `fmtList` |
| shared/utils/security.js | `_auditLog`, `_rl` (rate limiting completo), `_resetSessionTimer`, `_clearSessionTimer` |
| shared/storage/storageKeys.js | OBJETO `STORAGE_KEYS` con TODAS las claves como constantes |
| shared/utils/totp.js (mejora) | Revisar que importe correctamente, no duplicar |

## Cambios en App.jsx
1. **ELIMINAR líneas 72-226**: `sanitizeInput`, `validatePasswordStrength`, `_auditLog`, `_rl`, `_resetSessionTimer`, `_clearSessionTimer`, `_ls`, `_ss`, `sp`, `sps`
2. **AGREGAR imports**: `import { sanitizeInput } from './shared/utils/sanitize'`, etc.
3. **ELIMINAR `_e` duplicado** (L1548 y L23015): importar desde sanitize.js
4. **ELIMINAR `fetchWithTimeout`** (L6315): importar desde aiProviders.js
5. **ELIMINAR `parseAIJSON`** (L6635): importar desde aiProviders.js

## Tests Obligatorios
- `shared/utils/sanitize.test.js`: testear XSS escape, trim, casos borde
- `shared/utils/validators.test.js`: testear password strength, BP/HR/BMI
- `shared/utils/formatters.test.js`: testear numeroALetras, fechas
- `shared/utils/security.test.js`: testear audit log, rate limiting

## Criterios de Aceptación
- [ ] Build: `npm run build` → exitoso
- [ ] `import { sanitizeInput } from './shared/utils/sanitize'` funciona en App.jsx
- [ ] `import { STORAGE_KEYS } from './shared/storage/storageKeys'` funciona
- [ ] Tests unitarios pasan: `npx vitest run shared/utils/`
- [ ] Sin cambios en lógica de negocio
- [ ] App.jxs eliminó TODAS las funciones duplicadas (D01-D06 del diagnóstico)

## Rollback Plan
```bash
git tag pre-etapa-A-YYYYMMDD
# Si falla: git checkout -- . && git checkout pre-etapa-A-YYYYMMDD
# Si pasa: git add . && git commit -m "refactor(etapa-A): extraer utils puros y constantes"
git tag post-etapa-A-YYYYMMDD