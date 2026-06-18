# 🏥 Estado del Refactor SISO OcupaSalud
_Actualizado por el agente al final de cada paso. No editar manualmente._

---

## ⚡ Identificación de Sesión
| Campo | Valor |
|-------|-------|
| **Sprint Activo** | 1 |
| **Paso Actual** | 1 de 9 |
| **Última actualización** | 2026-06-18 13:14 |
| **Sesiones completadas** | 1 |
| **Modo** | 🟢 Sprint 1 — D1 Client |

---

## 📊 Progreso General

- [x] Sprint 0 — Fusión de bases (7/7 pasos) ✅
- [ ] Sprint 1 — D1 Client completo (0/9 pasos)
- [ ] Sprint 2 — Auth + Router + Usuarios (0/9 pasos)
- [ ] Sprint 3 — HC Ocupacional ⚠️ CRÍTICO (0/13 pasos)
- [ ] Sprint 4 — HC General + Fórmula + Derivaciones (0/7 pasos)
- [ ] Sprint 5 — Portales Trabajador + Empresa (0/7 pasos)
- [ ] Sprint 6 — Encuestas + Agenda + Pacientes (0/7 pasos)
- [ ] Sprint 7 — Facturación + Caja + Informes (0/6 pasos)
- [ ] Sprint 8 — IA + Teleconsulta + SGSST (0/6 pasos)
- [ ] Sprint 9 — Cartas + Comunicaciones (0/7 pasos)
- [ ] Sprint 10 — QA Final + Producción (0/11 pasos)

---

## ✅ SPRINT 0 — FUSIÓN DE BASES — COMPLETADO

- Marco 0, Pasos 1-7: ✅ commit `69fef09` — 130 archivos integrados.

---

## 📋 SPRINT 1 — D1 CLIENT COMPLETO

### Paso 1: 🔄 LEER Y ANALIZAR d1Client.js EXISTENTE
> **Estado:** Archivo encontrado en `src/shared/storage/d1Client.js`. Contiene: d1Get, d1Set, d1Delete, d1GetAll.
> **Falta:** merge anti-regresión, auto-chunking, retries, If-Match.

### Paso 2: ⬜ Implementar `d1WriteArrayMerge` — CRÍTICO
> **Acción exacta:** Actualizar `src/shared/storage/d1Client.js` para añadir:
> - `d1WriteArrayMerge(key, list, idField='id')` — lee valor remoto, hace MERGE por id, POST con If-Match.
> - Auto-chunking >500KB (split en chunks con prefijo `__chunk_`).
> - Retries (3 intentos, backoff exponencial).
> - If-Match en POST headers para locking optimista.

### Paso 3: ⬜ Integrar VersionWatcher + D1ChangesWatcher en App.jsx
### Paso 4: ⬜ Crear tests `d1Client.test.js`
### Paso 5: ⬜ `npm run build && npm test`
### Paso 6: ⬜ Commit `sprint1: d1Client completo con merge anti-regresion`

---

## 🔧 Notas Técnicas

- Worker URL y Token se obtienen de `window.__SISO_CONFIG`.
- `shouldSyncToD1(key)` decide si una clave va a D1.

## → CONTINUAR AQUÍ
**Sprint:** 1
**Paso pendiente:** Paso 2 — Implementar `d1WriteArrayMerge`, auto-chunking, retries, If-Match en `src/shared/storage/d1Client.js`