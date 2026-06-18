# 🏥 Estado del Refactor SISO OcupaSalud
_Actualizado por el agente al final de cada paso. No editar manualmente._
_Leer este archivo AL INICIO de cada sesión ANTES de escribir código._

---

## ⚡ Identificación de Sesión
| Campo | Valor |
|-------|-------|
| **Sprint Activo** | 0 |
| **Paso Actual** | 2 de 7 |
| **Última actualización** | 2026-06-18 12:53 |
| **Sesiones completadas** | 1 |
| **Modo** | 🟢 Integración y conexión |

---

## 📊 Progreso General

- [ ] Sprint 0 — Fusión de bases (1/7 pasos)
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

## 📋 SPRINT 0 — FUSIÓN DE BASES (1 día estimado)

### Paso 1: ✅ Clonar/actualizar REPO B localmente
> **Estado:** Ya existe estructura fusionada. Se detectaron 31 páginas, 72 módulos/features, stores, shared components.

### Paso 2: 🔄 INTEGRAR APP.JSX CON TODAS LAS PÁGINAS Y MÓDULOS EXISTENTES (ACTUAL)
> **Acción:** Actualizar App.jsx para usar react-router-dom con todas las rutas de las 31 páginas en `src/pages/`. Conectar stores (authStore, aiStore, uiStore), agregar VersionWatcher + D1ChangesWatcher + StorageHealth.

### Paso 3: ⬜ Conectar stores (authStore, aiStore, uiStore) a App.jsx

### Paso 4: ⬜ Activar componentes transversales: VersionWatcher, D1ChangesWatcher, StorageHealth

### Paso 5: ⬜ Verificar que `npm install && npm run build` pasa

### Paso 6: ⬜ Verificar que `npm test` pasa

### Paso 7: ⬜ Commit: `sprint0: integracion completa app.jsx con todas las paginas y modulos`

---

## 📂 Diagnóstico del Estado Actual del Código

### Lo que YA EXISTE en `src/` de refactorizacion total:

| Componente | Estado | App.jsx lo usa? |
|------------|--------|----------------|
| `src/App.jsx` (128 líneas) | ⚠️ Básico, sin router | — |
| `src/main.jsx` | ✅ OK | — |
| `src/stores/authStore.js` | ✅ Creado | ❌ No integrado |
| `src/stores/aiStore.js` | ✅ Creado | ❌ No integrado |
| `src/stores/uiStore.js` | ✅ Creado | ❌ No integrado |
| `src/components/VersionWatcher.jsx` | ✅ Creado | ❌ No integrado |
| `src/components/D1ChangesWatcher.jsx` | ✅ Creado | ❌ No integrado |
| `src/components/StorageHealth.jsx` | ✅ Creado | ❌ No integrado |
| `src/app/Layout.jsx` | ✅ Creado | ❌ No integrado |
| **31 páginas en `src/pages/`** | ✅ Creadas | ❌ No integradas |
| **Features en `src/features/`** | ✅ Creados | ❌ Parcial |
| **Modules en `src/modules/`** | ✅ Creados | ❌ No integrados |
| **Shared components** | ✅ Creados | ❌ No integrados |
| **Shared storage (d1Client, etc.)** | ✅ Creados | ❌ No integrados |
| **Tests** | ⚠️ Solo 3 archivos test | — |

### Lo que FALTA hacer en Sprint 0:
1. **App.jsx** → Refactorizar para usar React Router con TODAS las rutas
2. **Layout.jsx** → Integrar con authStore para sidebar + navbar
3. **Stores** → Conectar authStore a App.jsx como fuente de verdad de sesión
4. **Componentes transversales** → VersionWatcher, D1ChangesWatcher, StorageHealth en Layout
5. **Build** → Verificar que compila sin errores

---

## 🔧 Notas Técnicas para Próxima Sesión

- El `App.jsx` actual usa un estado local `view` en lugar de React Router. Hay que migrar a `react-router-dom` v7.
- `authStore.js` (Zustand) debe ser la fuente de verdad de autenticación, no el estado local.
- Las 31 páginas en `src/pages/` están listas para importarse lazy.
- `Layout.jsx` ya existe en `src/app/Layout.jsx` y debe ser el wrapper principal.
- Verificar que `package.json` tiene `react-router-dom` como dependencia.

---

## ⚠️ Errores Pendientes
_(ninguno por ahora)_

---

## ✅ Historial de Checkpoints

| Fecha | Sprint | Paso | Estado | Descripción |
|-------|--------|------|--------|-------------|
| 2026-06-18 | 0 | 1 | ✅ | Diagnóstico inicial completado. Estructura auditada. |
| 2026-06-18 | 0 | 2 | 🔄 | Integrando App.jsx con Router + Stores + Páginas |

---

## → CONTINUAR AQUÍ
**Sprint:** 0
**Paso pendiente:** Paso 2 — Integrar App.jsx con react-router-dom + todas las páginas
**Acción exacta:** Reescribir `src/App.jsx` para usar lazy imports de todas las páginas, conectar authStore y Layout