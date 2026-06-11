# PROMPT MAESTRO DE REFACTORIZACIÓN — SISO OcupaSalud

> **Uso:** Copia este archivo completo al inicio de cada nueva sesión de IA para que el asistente entienda el contexto total del proyecto y pueda continuar sin perder información.

---

## 1. CONTEXTO DEL PROYECTO

### Repositorios

| Rol | Ruta |
|-----|------|
| Repo de trabajo (refactor) | `C:\Users\JQK3\Desktop\refactorizacion total\` |
| Repo monolito (referencia) | `C:\Users\JQK3\Desktop\ocupasaludparadesplegar\` |

### Stack tecnológico

- **Frontend:** SPA React + Vite (JSX)
- **Hosting:** Cloudflare Pages (CI/CD desde rama `main`)
- **Backend:** Cloudflare Worker + D1 → `siso-api.dr-juliancucalon.workers.dev`
- **Base de datos primaria:** Cloudflare D1 (`siso_db`)
- **Fallback / legacy:** Supabase (solo lectura para datos históricos)
- **Deploy workflow:** `git push` a `drjuliancucalon-droid` dispara Pages build — **NUNCA** `wrangler deploy` directo a producción

### El monolito

- Archivo: `src/App.jsx`
- Tamaño: **58 389 líneas** (todo el sistema en un solo archivo)
- Objetivo de la refactorización: descomponer en módulos `features/`, `components/`, `utils/`, `storage/` sin alterar comportamiento ni datos

---

## 2. ESTADO ACTUAL DE LA REFACTORIZACIÓN (~30 % completado)

### Completado

| Área | Módulo | Estado |
|------|--------|--------|
| utils | sanitize, validators, formatters, constants, security, helpers, fhir | ✅ 100 % |
| storage | localStorage, sessionStorage, storageKeys, d1Client, supabaseClient | ✅ 100 % |
| components | VersionWatcher, D1ChangesWatcher, StorageHealth | ✅ 100 % |
| features/auth | hooks, context, guards | 🔶 40 % |
| features/pacientes | lista, búsqueda, ficha | 🔶 35 % |
| features/hc-ocupacional | formulario, campos | 🔶 45 % |
| features/portal-empresa | login, dashboard | 🔶 20 % |
| features/agenda | calendario, citas | 🔶 20 % |
| features/encuestas | formularios | 🔶 15 % |
| features/facturacion | facturas, pagos | 🔶 20 % |
| features/informes | reportes | 🔶 10 % |
| features/caja | movimientos | 🔶 15 % |
| features/contabilidad | asientos | 🔶 15 % |
| features/custodia | documentos | 🔶 15 % |
| features/dashboard | panel principal | 🔶 40 % |

### Pendiente

| Área | Estado |
|------|--------|
| features/hc-general | 🔴 15 % |
| features/portal-trabajador | 🔴 20 % |
| features/empresas | 🔴 0 % |
| features/usuarios | 🔴 0 % |
| features/ia | 🔴 0 % |
| features/impresion | 🔴 5 % |
| features/teleconsulta | 🔴 0 % |

---

## 3. BLOQUES DE TRABAJO PENDIENTES

Los bloques están ordenados por dependencia lógica. No iniciar un bloque sin haber cerrado el anterior.

### Bloque 1 — Router completo en App.jsx (estimado: 2-3 días)

- Extraer y reescribir el enrutador central con React Router v6
- Implementar **lazy loading** (`React.lazy` + `Suspense`) para cada feature
- Rutas protegidas por rol (médico, admin, empresa, trabajador, recepción)
- Mantener las mismas rutas públicas y privadas del monolito
- No alterar la lógica de navegación `goTo()` (línea 23 485 del monolito) hasta tener el router estable

### Bloque 2 — HC Ocupacional completa (estimado: 3-4 días)

- Formulario con **100+ campos** (anamnesis, examen físico, paraclínicos, aptitud)
- **Cierre bloqueante** que requiere 6 claves D1 confirmadas antes de permitir firma
- Función MERGE anti-regresión en arrays D1 (`_writeArrayMergeD1`, línea 21 366)
- Firma digital del médico + generación de QR de verificación
- Integración con IA para recomendaciones automáticas de aptitud
- Publicación al portal empresa (`_publicarAlPortalEmpresa`, línea 17 024)
- Cumplir **Resolución 1843/2025** (historia clínica ocupacional) y **Resolución 1995/1999** (custodia HCs)

### Bloque 3 — HC General (estimado: 2 días)

- Formulario completo de historia clínica general
- Buscador y codificación **CIE-10** integrado
- Módulo de fórmula médica (medicamentos, dosis, indicaciones)
- Plan de manejo y evolución
- Impresión directa desde la HC

### Bloque 4 — Portal empresa + Portal trabajador (estimado: 3 días)

- **Portal empresa:** login con NIT + código de empresa, dashboard de atenciones, descarga de certificados, estadísticas de ausentismo
- **Portal trabajador:** login con número de documento, consulta de atenciones propias, descarga de certificados y recomendaciones
- Permisos de lectura estrictamente separados (empresa no puede ver datos clínicos del trabajador)
- Sincronización en tiempo real vía D1 polling

### Bloque 5 — Auth + Usuarios + Empresas (estimado: 2-3 días)

- Sistema de roles: `superadmin`, `medico`, `admin`, `recepcion`, `empresa`, `trabajador`
- Permisos granulares por módulo y acción (CRUD)
- CRUD completo de empresas (NIT, razón social, contacto, configuración de portal)
- CRUD de usuarios con asignación de roles y empresa
- Recuperación de contraseña y gestión de sesiones

### Bloque 6 — Módulos de soporte (estimado: 2 días)

- **Agenda:** calendario semanal/mensual, citas, recordatorios, disponibilidad
- **Encuestas:** formularios configurables, respuestas, estadísticas
- **Facturación:** facturas, notas crédito, pagos, estados de cuenta
- **Informes:** reportes por fecha/empresa/diagnóstico, exportación a Excel/PDF
- **Cartas:** plantillas de cartas médicas, carta de aptitud, derivaciones

### Bloque 7 — Integración IA (estimado: 1-2 días)

- Proveedores soportados: **Gemini** (Google), **Groq**, **OpenRouter**
- Recomendaciones automáticas de aptitud laboral basadas en hallazgos de la HC
- Sugerencias de diagnósticos CIE-10 a partir del motivo de consulta
- Generación de texto para plan de manejo y recomendaciones
- Fallback entre proveedores si uno falla
- Caché de respuestas IA para reducir costos

### Bloque 8 — Módulo de impresión (estimado: 1 día)

- Certificado de aptitud laboral (pre-ocupacional, periódico, retiro)
- Fórmula médica con membrete
- Carta de derivación a especialista
- Solicitud de exámenes paraclínicos
- Factura / recibo de pago
- Todos los documentos deben usar `openPrintWindow()` (línea 11 490 del monolito) como referencia

### Bloque 9 — Tests completos (estimado: 2-3 días)

- **Unitarios:** Vitest — utils, storage, hooks
- **Integración:** Testing Library — flujos de formularios y navegación
- **E2E:** Playwright — flujo completo paciente nuevo → HC → cierre → portal empresa
- Cobertura mínima objetivo: 80 % en utils y storage, 60 % en features críticas
- CI en GitHub Actions que bloquee merge si tests fallan

### Bloque 10 — Deploy + README (estimado: 1 día)

- Pipeline CI/CD documentado en `.github/workflows/`
- Secrets de Cloudflare configurados (`CF_API_TOKEN`, `CF_ACCOUNT_ID`, `D1_DATABASE_ID`)
- Smoke test post-deploy (Playwright headless)
- `README.md` con instrucciones de setup local, variables de entorno y arquitectura
- Checklist de go-live y rollback

---

## 4. CONSTRAINTS ABSOLUTOS — NUNCA VIOLAR

Estas reglas son no negociables. Si un cambio viola alguna de ellas, detener y consultar.

| # | Regla |
|---|-------|
| 1 | **No perder datos D1** — cualquier migración de esquema debe ser aditiva, nunca destructiva |
| 2 | **No cambiar formato de claves D1** — los nombres de clave existentes son inmutables |
| 3 | **No romper HCs cerradas existentes** — las HCs ya firmadas son registros legales inamovibles |
| 4 | **Cumplir Res. 1843/2025 y Res. 1995/1999** — estructura y custodia de HCs obligatoria por ley colombiana |
| 5 | **No `push --force` a main** — rama principal protegida, siempre PR con revisión |
| 6 | **Snapshot D1 antes de cambios** — ejecutar `wrangler d1 export siso_db > snapshot_YYYYMMDD.sql` antes de cualquier migración |
| 7 | **MERGE anti-regresión en arrays D1** — usar siempre `_writeArrayMergeD1()` para actualizar arrays, nunca sobrescribir |
| 8 | **No nuevas dependencias npm sin justificación** — cada nueva dep requiere justificación escrita en el PR |
| 9 | **No cambios visuales** — la refactorización es de arquitectura, no de UI; el usuario no debe notar diferencia |
| 10 | **Cada commit debe compilar** — `npm run build` sin errores antes de cada commit; CI bloquea si falla |

---

## 5. CLAVES D1 CRÍTICAS

Estas son las claves de almacenamiento en Cloudflare D1 que el sistema usa. No renombrar, no eliminar.

```
siso_db_patients_<cedula>          — ficha completa del paciente
siso_db_patients_index             — índice de todos los pacientes
siso_companies_<nit>               — datos de la empresa
siso_companies_index               — índice de empresas
siso_atenciones_cerradas_<cedula>  — array de HCs cerradas del paciente
siso_hc_completa_<cedula>_<fecha>  — snapshot completo de una HC cerrada
siso_portal_doc_<cedula>           — documentos publicados al portal del trabajador
siso_portal_empresa_<nit>          — datos publicados al portal de la empresa
siso_agenda_<fecha>                — citas del día
siso_agenda_index                  — índice de agenda
siso_usuarios_index                — índice de usuarios del sistema
siso_config_global                 — configuración global del sistema
siso_facturacion_<id>              — factura individual
siso_facturacion_index             — índice de facturas
siso_encuestas_<id>                — encuesta individual
siso_encuestas_index               — índice de encuestas
siso_caja_<fecha>                  — movimientos de caja del día
siso_informes_cache_<hash>         — caché de informes generados
siso_custodia_<cedula>             — registro de custodia de documentos
```

> **Regla MERGE:** para claves que contienen arrays (ej. `siso_atenciones_cerradas_*`), siempre leer el valor actual, hacer merge con el nuevo elemento, y escribir el resultado. Nunca hacer `set` directo con solo el nuevo elemento.

---

## 6. FUNCIONES CRÍTICAS DEL MONOLITO (con número de línea)

Estas funciones en `src/App.jsx` del monolito son las más importantes. Antes de refactorizar cualquiera, leer la función completa en el monolito.

| Línea | Función | Descripción |
|-------|---------|-------------|
| 8 630 | `initialOccupPatientState` | Estado inicial del formulario de HC Ocupacional (estructura de datos de referencia) |
| 11 490 | `openPrintWindow()` | Abre ventana de impresión con template HTML inyectado; base para todos los documentos imprimibles |
| 17 024 | `_publicarAlPortalEmpresa()` | Publica resumen de atención al portal de la empresa; crítico para cumplimiento contractual |
| 21 366 | `_writeArrayMergeD1()` | **CRÍTICO** — escribe arrays en D1 con lógica MERGE anti-regresión; nunca reemplazar por `set` directo |
| 21 600 | `(cierre HC bloqueante)` | Lógica de cierre de HC que valida 6 condiciones antes de permitir firma; romperla invalida HCs |
| 23 485 | `goTo()` | Función de navegación interna del SPA; controla toda la lógica de transición de vistas |
| 32 296 | `(botón HC Ocup. en lista)` | Handler que abre la HC Ocupacional desde el listado de pacientes; punto de entrada principal |
| 45 517 | `abrirHCDesdeAgenda()` | Abre HC de un paciente directamente desde la agenda; flujo alternativo de entrada |

---

## 7. FIXES CRÍTICOS YA PRESENTES EN EL MONOLITO

Estos bugs fueron corregidos en el monolito. Al refactorizar, asegurarse de que las correcciones estén presentes en el código nuevo.

| Commit | Descripción del fix |
|--------|---------------------|
| `010db1b` | Fix cierre HC: validación de campos obligatorios antes de firma |
| `14f8c74` | Fix MERGE D1: evitar duplicados en array de atenciones cerradas |
| `f12510d` | Fix portal empresa: permisos de lectura correctos para datos de aptitud |
| `8ab3bd5` | Fix agenda: conflicto de citas en mismo horario |
| `f7489e7` | Fix facturación: cálculo de IVA en servicios exentos |
| `ecc1354` | Fix auth: expiración de sesión no forzaba re-login en rutas protegidas |

---

## 8. INSTRUCCIONES DE INICIO DE NUEVA SESIÓN

Seguir estos 10 pasos al comenzar cualquier sesión de trabajo en este proyecto:

1. **Leer este archivo completo** antes de hacer cualquier cambio.
2. **Revisar `git log --oneline -20`** en el repo de trabajo para saber en qué punto quedó la sesión anterior.
3. **Verificar el estado del build:** `npm run build` — si falla, arreglar antes de continuar.
4. **Identificar el bloque activo** (ver Sección 3) y revisar qué sub-tareas están pendientes.
5. **Consultar el monolito** (`C:\Users\JQK3\Desktop\ocupasaludparadesplegar\src\App.jsx`) para la función que se va a refactorizar; leer la función completa, no asumir comportamiento.
6. **Crear rama de trabajo:** `git checkout -b bloque-N-descripcion` (nunca trabajar directamente en `main`).
7. **Hacer snapshot D1** si el bloque toca almacenamiento: `wrangler d1 export siso_db --output=snapshots/snap_YYYYMMDD.sql`.
8. **Escribir tests primero** (TDD) para la función a refactorizar, basados en el comportamiento del monolito.
9. **Implementar el módulo** — respetar constraints absolutos de Sección 4.
10. **Verificar build + tests** antes de commit: `npm run build && npm test` — ambos deben pasar en verde.

---

## 9. COMANDOS ÚTILES

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview
```

### Tests

```bash
# Correr todos los tests (Vitest)
npm test

# Tests en modo watch
npm run test:watch

# Cobertura
npm run test:coverage

# Tests E2E (Playwright)
npm run test:e2e
```

### Cloudflare / D1

```bash
# Snapshot de la base de datos D1
wrangler d1 export siso_db --output=snapshots/snap_$(date +%Y%m%d_%H%M%S).sql

# Ejecutar migración en D1 local
wrangler d1 execute siso_db --local --file=migrations/001_init.sql

# Ejecutar migración en D1 producción (con cuidado)
wrangler d1 execute siso_db --file=migrations/001_init.sql

# Ver tablas en D1
wrangler d1 execute siso_db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Deploy del Worker (solo si se cambia el backend)
wrangler deploy
```

### Git

```bash
# Ver estado
git status

# Ver log reciente
git log --oneline -20

# Crear rama de bloque
git checkout -b bloque-N-nombre

# Commit con mensaje descriptivo
git add src/features/nombre-modulo/
git commit -m "feat(bloque-N): descripción del cambio"

# Push a rama (NO a main directamente)
git push origin bloque-N-nombre

# Merge a main solo via PR revisado
# Usar GitHub UI o: gh pr create --title "Bloque N: ..." --base main
```

---

## 10. TABLA DE PROGRESO HISTÓRICO

| Fecha | Sesión | Bloque | Logros | Problemas encontrados |
|-------|--------|--------|--------|----------------------|
| 2026-05-01 | 1 | Setup | Estructura de carpetas, utils completos | — |
| 2026-05-05 | 2 | Setup | storage completo (d1Client, supabaseClient) | Tipos TypeScript en d1Client |
| 2026-05-08 | 3 | Setup | components: VersionWatcher, D1ChangesWatcher | — |
| 2026-05-12 | 4 | Bloque 5 | auth hooks 40 % completado | Refresh token no persiste entre tabs |
| 2026-05-15 | 5 | Bloque 1 | Pacientes lista + búsqueda 35 % | Paginación D1 lenta con +500 pacientes |
| 2026-05-20 | 6 | Bloque 2 | HC Ocup. formulario 45 % | Campo aptitud no refleja reglas Res. 1843 |
| 2026-05-25 | 7 | Bloque 4 | Portal empresa login 20 % | — |
| 2026-06-01 | 8 | Bloque 6 | Agenda 20 %, Facturación 20 % | — |
| 2026-06-11 | 9 | — | Creación de este PROMPT_MAESTRO | — |

> **Nota:** actualizar esta tabla al final de cada sesión con los logros y problemas encontrados.

---

## APÉNDICE A — Estructura de carpetas objetivo

```
src/
├── App.jsx                    ← router + providers (slim, <200 líneas)
├── main.jsx
├── utils/
│   ├── sanitize.js
│   ├── validators.js
│   ├── formatters.js
│   ├── constants.js
│   ├── security.js
│   ├── helpers.js
│   └── fhir.js
├── storage/
│   ├── localStorage.js
│   ├── sessionStorage.js
│   ├── storageKeys.js
│   ├── d1Client.js
│   └── supabaseClient.js
├── components/
│   ├── VersionWatcher.jsx
│   ├── D1ChangesWatcher.jsx
│   ├── StorageHealth.jsx
│   └── ui/                   ← componentes UI genéricos reutilizables
├── features/
│   ├── auth/
│   ├── pacientes/
│   ├── hc-ocupacional/
│   ├── hc-general/
│   ├── portal-empresa/
│   ├── portal-trabajador/
│   ├── agenda/
│   ├── encuestas/
│   ├── facturacion/
│   ├── informes/
│   ├── caja/
│   ├── contabilidad/
│   ├── custodia/
│   ├── dashboard/
│   ├── empresas/
│   ├── usuarios/
│   ├── ia/
│   ├── impresion/
│   └── teleconsulta/
├── hooks/                    ← hooks globales compartidos
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## APÉNDICE B — Variables de entorno requeridas

```env
# Cloudflare
VITE_CF_ACCOUNT_ID=<account_id>
VITE_D1_DATABASE_ID=<database_id>
VITE_WORKER_URL=https://siso-api.dr-juliancucalon.workers.dev

# Supabase (legacy fallback)
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>

# IA (al menos uno requerido para Bloque 7)
VITE_GEMINI_API_KEY=<key>
VITE_GROQ_API_KEY=<key>
VITE_OPENROUTER_API_KEY=<key>

# Solo en Cloudflare Worker (secrets, no en .env del frontend)
D1_DATABASE_ID=<database_id>
CF_API_TOKEN=<token>
```

---

*Última actualización: 2026-06-11 — Sesión 9*
