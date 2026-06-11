# ═══════════════════════════════════════════════════════════════
# ETAPA D — Extracción de Feature "HC Ocupacional"
# Esfuerzo: XL (5-7 días) | Riesgo: 🔴 ALTO
# ═══════════════════════════════════════════════════════════════

## ⚠️ ADVERTENCIA
Esta es la etapa de **MAYOR RIESGO**. HC Ocupacional es el corazón del sistema.
Cualquier error aquí afecta a pacientes reales y HCs cerradas existentes.

## Objetivo
Extraer toda la lógica de HC Ocupacional desde App.jsx hacia `features/hc-ocupacional/`.

## Prerrequisitos
- [ ] Etapa A completada (utils)
- [ ] Etapa B completada (storage)
- [ ] Etapa C completada (pacientes)
- [ ] Snapshot D1 realizado

## Archivos a Crear

| Archivo | Líneas estimadas | Contenido |
|---------|-----------------|-----------|
| features/hc-ocupacional/useHCOcupacional.js | ~300 | Hook: estado del formulario, validación, autosave, cierre |
| features/hc-ocupacional/HCOcupacionalForm.jsx | ~350 | Formulario principal que orquesta las secciones |
| features/hc-ocupacional/sections/AnamnesisSection.jsx | ~200 | Antecedentes, motivo consulta, enfermedad actual |
| features/hc-ocupacional/sections/ExamenFisicoSection.jsx | ~250 | Signos vitales, examen físico por sistemas |
| features/hc-ocupacional/sections/SistemasSection.jsx | ~200 | Revisión por sistemas |
| features/hc-ocupacional/sections/RestriccionesSection.jsx | ~200 | Checklist restricciones (desde RestriccionesChecklistPanel) |
| features/hc-ocupacional/sections/RecomendacionesSection.jsx | ~200 | Checklist recomendaciones (desde RecomendacionesChecklistPanel) |
| features/hc-ocupacional/sections/FormulaDerivacionSection.jsx | ~250 | Fórmula médica, derivaciones (desde TabFormulaDerivacion) |
| features/hc-ocupacional/HCOcupacionalPrint.jsx | ~400 | Impresión de HC (desde _printHCClean + handlePrint) |
| features/hc-ocupacional/HCOcupacionalClose.jsx | ~200 | Validación + firma + persistencia + portal |

## Funciones a Mover desde App.jsx

| Función | Línea Origen | Archivo Destino |
|---------|-------------|----------------|
| `handleNewOccupHistory` | ~21222 | useHCOcupacional.js |
| `handleCloseHistory` | ~21515 | HCOcupacionalClose.jsx |
| `handleEditHistory` | ~22021 | useHCOcupacional.js |
| `_printHCClean` | ~23014 | HCOcupacionalPrint.jsx |
| `checkAlertasObligatorias` | ~21467 | useHCOcupacional.js |
| `RestriccionesChecklistPanel` | ~5956 | RestriccionesSection.jsx |
| `RecomendacionesChecklistPanel` | ~10902 | RecomendacionesSection.jsx |
| `TabFormulaDerivacion` | ~11197 | FormulaDerivacionSection.jsx |
| `RestriccionesChecklistPanel` interna | ~5956 | RestriccionesSection.jsx |

## Estrategia de Migración (por sub-etapas)

### D.1 Hook useHCOcupacional.js (día 1)
1. Extraer estado del formulario HC a un hook
2. Extraer `checkAlertasObligatorias`
3. Extraer `handleNewOccupHistory`, `handleEditHistory`
4. **Commit**: `refactor(etapa-D1): extraer useHCOcupacional hook`

### D.2 Secciones del formulario (días 2-3)
1. Extraer cada sección a su archivo individual
2. Mantener los imports en App.jsx durante la transición
3. **Commit**: `refactor(etapa-D2): extraer secciones de HC Ocupacional`

### D.3 Impresión (día 4)
1. Extraer `_printHCClean` + `handlePrint` a HCOcupacionalPrint.jsx
2. Extraer helpers de template HTML a shared/utils/portalTemplates.js
3. **Commit**: `refactor(etapa-D3): extraer impresión HC`

### D.4 Cierre de HC (día 5)
1. Extraer `handleCloseHistory` a HCOcupacionalClose.jsx
2. Separar en funciones puras: validar → firmar → persistir → portal → feedback
3. **Commit**: `refactor(etapa-D4): extraer cierre de HC`

## Tests Obligatorios
- `features/hc-ocupacional/useHCOcupacional.test.js`: validación, autosave
- `features/hc-ocupacional/HCOcupacionalClose.test.js`: flujo completo de cierre
- Comparación de conteos D1 pre vs post etapa

## Criterios de Aceptación
- [ ] Build exitoso
- [ ] Todas las HCs cerradas existentes siguen accesibles
- [ ] Nueva HC ocupacional: crear → llenar → cerrar → verificar D1
- [ ] Portal empresa: ver HC cerrada
- [ ] Portal trabajador: ver HC por código
- [ ] Sin cambios visuales en UI
- [ ] Conteos D1 coinciden pre vs post etapa

## Rollback Plan
```bash
git tag pre-etapa-D-YYYYMMDD
scripts/snapshot.mjs
# Si falla: git checkout -- . && restore D1
# Si pasa: git commit -m "refactor(etapa-D): extraer HC Ocupacional"