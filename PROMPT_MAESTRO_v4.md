# ╔══════════════════════════════════════════════════════════════════════╗
# ║  PROMPT MAESTRO — SISO OcupaSalud Refactorización 100%             ║
# ║  Versión: 4.0 | Fecha: 2026-06-18                                  ║
# ║  NUEVO: Sistema de memoria + checkpoint por sesión                 ║
# ╚══════════════════════════════════════════════════════════════════════╝

---

## ⚡ PROTOCOLO DE SESIÓN — LEER PRIMERO, SIEMPRE

### AL INICIO DE CADA SESIÓN (obligatorio)

1. Leer `docs/ESTADO_SPRINT.md` ANTES de escribir UNA SOLA línea de código
2. Identificar el sprint activo y el último paso marcado como completado (✅)
3. Confirmar en voz alta: **"Retomando Sprint N, paso X. Próxima acción: [descripción]"**
4. NO repetir pasos ya marcados como ✅
5. NO avanzar al siguiente sprint sin confirmación del usuario
6. Continuar exactamente donde dice `→ CONTINUAR AQUÍ` en `ESTADO_SPRINT.md`

### DURANTE LA SESIÓN (monitoreo continuo)

- Después de completar CADA PASO de un sprint, actualizar `docs/ESTADO_SPRINT.md`
- Marcar el paso como ✅ inmediatamente al terminarlo
- Hacer mini-commit de estado: `git add docs/ESTADO_SPRINT.md && git commit -m "checkpoint: sprint-N paso-X completado"`

### ANTES DE QUE SE ACABE EL CONTEXTO (checkpoint de emergencia)

Cuando detectes que te quedan aproximadamente 20.000 tokens libres de contexto:
1. **DETÉN la generación de código inmediatamente**
2. Actualiza `docs/ESTADO_SPRINT.md` con el estado exacto actual
3. Documenta en `## Errores Pendientes` cualquier error sin resolver
4. Documenta en `## Notas Técnicas` el contexto técnico crítico para la próxima sesión
5. Ejecuta el commit de checkpoint:
   ```bash
   git add docs/ESTADO_SPRINT.md
   git commit -m "checkpoint: sprint-N paso-X — contexto lleno, retomar aquí"
   ```
6. Avisa al usuario: **"⚠️ Contexto casi lleno. Checkpoint guardado en Sprint N, paso X. Inicia nueva sesión con: `@docs/PROMPT_MAESTRO_v4.md @docs/ESTADO_SPRINT.md`"**

### AL FINAL DE SPRINT COMPLETO

1. Ejecutar `npm run build` — DEBE pasar sin errores
2. Ejecutar `npm test` — DEBEN pasar todos los tests
3. Marcar el sprint completo como ✅ en `docs/ESTADO_SPRINT.md`
4. Commit final del sprint:
   ```bash
   git add -A
   git commit -m "sprint-N: [descripción] — build ✅ tests ✅"
   git push origin master
   ```
5. Avisar al usuario: **"✅ Sprint N completado. Build y tests pasan. Listo para Sprint N+1. ¿Continúo?"**
6. **ESPERAR confirmación del usuario antes de iniciar el siguiente sprint**

---

## 1. MISIÓN

Entregar UN ÚNICO repositorio con el 100% de la funcionalidad del monolito
`ocupasaludparadesplegar`, completamente refactorizado en arquitectura modular,
usando como base el trabajo ya avanzado en los 3 repos existentes.

**Repositorio destino:** `drjuliancucalon-droid/siso-ocupasalud` (rama `master`)
**URL deploy destino:** `https://siso-refactor.pages.dev`

---

## 2. LOS 3 REPOSITORIOS DE ENTRADA

### REPO A — BASE DE CÓDIGO (monolito de producción, 100% funcional)
- **GitHub:** `https://github.com/drjuliancucalon-droid/ocupasaludparadesplegar`
- **Local:** `C:\Users\JQK3\Desktop\ocupasaludparadesplegar`
- **Rama:** `main`
- **Descripción:** El monolito completo. `src/App.jsx` de 58.389 líneas.
  Es la referencia absoluta de verdad. TODO debe replicar lo que hace este repo.
- **Uso:** Solo lectura. No tocar. Es la fuente de verdad funcional.
- **⚠️ IMPORTANTE:** Nunca incluir este archivo completo en el contexto.
  Usar SOLO las líneas específicas listadas en la Sección 11.

### REPO B — MÁS AVANZADO (refactorización más completa)
- **GitHub:** `https://github.com/drjuliancucalon-droid/siso-appultimo`
- **Rama:** `main`
- **Descripción:** React Router v7 + Zustand + React Query + 44 páginas +
  77 módulos + backend Node.js + 14 test suites + offlineDB + syncManager.
  Es la arquitectura más cercana al objetivo final.
- **Stack:** react-router-dom v7, zustand v5, @tanstack/react-query v5,
  vite, vitest, lucide-react
- **Uso:** BASE PRINCIPAL del refactor. Copiar su estructura y completarla.

### REPO C — DESTINO FINAL (parcialmente avanzado)
- **Local:** `C:\Users\JQK3\Desktop\refactorizacion total`
- **GitHub:** `https://github.com/drjuliancucalon-droid/siso-ocupasalud`
- **Rama:** `master`
- **Descripción:** Tiene CI/CD funcionando, package-lock.json, vite.config.js
  con version.json plugin, VersionWatcher/D1ChangesWatcher/StorageHealth,
  siso-worker actualizado, y shared/utils + shared/storage básicos (~30%).
- **Uso:** Destino final. Ya tiene infraestructura de deploy. Completarlo.

---

## 3. ESTRATEGIA DE FUSIÓN

**NO iniciar desde cero.** Combinar lo mejor de cada repo:

```
REPO B (siso-appultimo)      → Estructura, módulos, páginas, hooks, stores, tests
REPO C (refactorizacion total) → CI/CD, Worker, VersionWatcher, D1ChangesWatcher
REPO A (monolito)             → Fuente de verdad de TODA la lógica de negocio
```

### Plan de fusión concreto:
1. Copiar TODA la estructura `src/` de REPO B a REPO C (manteniendo CI/CD de C)
2. Completar cada módulo/página consultando REPO A para lógica faltante
3. Sustituir todas las llamadas a Supabase por llamadas al Worker D1
4. Integrar los componentes de REPO C que faltan en B: VersionWatcher, etc.
5. Garantizar que build + tests pasan antes de cada commit

---

## 4. INVENTARIO COMPLETO DE FUNCIONALIDADES A IMPLEMENTAR

Todo lo que está en el monolito (REPO A) DEBE existir en el repo final.
Verificar cada item contra `src/App.jsx` del monolito.

### 4.1 AUTENTICACIÓN Y USUARIOS
- [ ] Login con usuario/contraseña (hash bcrypt o similar)
- [ ] Logout con limpieza de sesión
- [ ] Cambio de contraseña
- [ ] Recuperación de acceso
- [ ] Rate limiting (bloqueo tras N intentos fallidos)
- [ ] Session timeout configurable
- [ ] Roles: `super_admin`, `administrador`, `medico`, `secretaria`, `admin_empresa`
- [ ] Permisos granulares por funcionalidad (agenda, pacientes, caja, etc.)
- [ ] Multi-médico en la misma cuenta
- [ ] Registro de auditoría de accesos
- [ ] 2FA TOTP (Google Authenticator) — REPO B tiene `TwoFactorAuth.jsx`

### 4.2 PACIENTES
- [ ] Lista de pacientes con búsqueda y filtros
- [ ] CRUD completo (crear, editar, eliminar)
- [ ] Anti-duplicados por docNumero
- [ ] Anti-fantasmas (filtrar pacientes sin id)
- [ ] Importar pacientes desde encuesta
- [ ] Importar pacientes desde Excel/CSV
- [ ] Exportar lista a PDF
- [ ] Historial de atenciones por paciente (múltiples HCs)
- [ ] Badge de estado (Pre-registrado, Abierta, Cerrada)

### 4.3 HISTORIA CLÍNICA OCUPACIONAL (el módulo más crítico)
- [ ] `initialOccupPatientState` con 100+ campos (línea 8630 monolito)
- [ ] Formulario por pestañas: Datos personales, Ocupacional, Antecedentes,
      Exploración física, Riesgos GTC-45, Recomendaciones, Restricciones,
      Perfil de cargo, Consentimiento, Fórmula/Derivaciones
- [ ] Antecedentes agrupados (8 categorías)
- [ ] Exploración física completa (29+ sistemas)
- [ ] Riesgos ocupacionales GTC-45 (físicos, químicos, biológicos,
      mecánicos, psicosociales, ergonómicos, locativos)
- [ ] Concepto de aptitud (5 opciones según Res. 1843/2025)
- [ ] Foliación HC (Res. 1995/1999 Art. 3)
- [ ] Código de verificación: `SISO-YYYYMMDD-PACID-HASH8`
- [ ] Recomendaciones médicas con checklist (categorías A-F)
- [ ] Restricciones laborales con checklist
- [ ] Perfil de cargo (Res. 1843/2025 Art. 29)
- [ ] Consentimiento informado digital (Ley 1581/2012 + Res. 1843/2025 Art. 12)
- [ ] Autoguardado cada 30s en localStorage/IndexedDB
- [ ] Guard "¿Salir sin guardar?"
- [ ] Fecha retroactiva del examen
- [ ] Vigencia del certificado (1, 3, 6, 12 meses)
- [ ] Generación QR del código de verificación
- [ ] **CIERRE BLOQUEANTE a D1 con publicación AUTOMÁTICA a 6 claves:**
  - `siso_hc_completa_<cc>`
  - `siso_portal_doc_<cc>`
  - `siso_portal_<code>`
  - `siso_portal_empresa_atenciones_<NIT>`
  - `siso_portal_empresa_<NIT>`
  - `siso_portal_empresa_docs_<NIT>`
- [ ] MERGE anti-regresión en TODOS los arrays D1
- [ ] Impresión completa: certificado con firma + QR + membrete

### 4.4 HISTORIA CLÍNICA GENERAL
- [ ] `initialGeneralPatientState`
- [ ] Formulario general: motivo, diagnósticos CIE-10, exploración básica
- [ ] Plan: indicaciones, medicamentos, controles
- [ ] Fórmula médica (prescripción)
- [ ] Impresión de fórmula (por medicamento individual y completa)
- [ ] Evolución clínica
- [ ] Incapacidades (días, tipo, origen, prórroga)

### 4.5 DERIVACIONES Y SOLICITUDES
- [ ] Derivaciones/interconsultas con especialidad, urgencia, motivo
- [ ] Solicitud de exámenes médicos
- [ ] Impresión de derivación (ventana popup con edición)
- [ ] Impresión de solicitud de exámenes
- [ ] Alerta si popup bloqueado por el navegador

### 4.6 FÓRMULA MÉDICA
- [ ] CRUD de medicamentos (nombre, presentación, dosis, frecuencia, duración)
- [ ] Autocompletar desde catálogo de medicamentos
- [ ] Impresión por medicamento individual
- [ ] Impresión de receta completa
- [ ] CIE-10 en diagnóstico de la fórmula

### 4.7 PORTAL TRABAJADOR
- [ ] Acceso por código de verificación o cédula
- [ ] Ver certificado de aptitud
- [ ] Ver historial de todas las atenciones (múltiples HCs separadas)
- [ ] Descargar certificado PDF
- [ ] Firma digital del médico en el certificado
- [ ] QR de verificación
- [ ] Datos del médico y la IPS

### 4.8 PORTAL EMPRESA
- [ ] Login: NIT + código de acceso
- [ ] Ver lista de atenciones de sus trabajadores
- [ ] Filtro por periodo (año-mes)
- [ ] Contador de certificados por periodo
- [ ] Descargar certificados individuales
- [ ] Descargar todos como ZIP
- [ ] Ver informes sociodemográficos publicados
- [ ] Ver cartas de custodia
- [ ] Ver cuentas de cobro

### 4.9 ENCUESTAS SOCIODEMOGRÁFICAS
- [ ] Crear encuesta pública con link único (Worker D1, NO Supabase)
- [ ] Link estable (dominio pages.dev, NO subdominio preview)
- [ ] Formulario público responsive (mobile-first)
- [ ] Ver respuestas recibidas
- [ ] Importar respuestas como pacientes (con MERGE anti-duplicado)
- [ ] Agendar todos los respondentes
- [ ] Exportar respuestas a PDF
- [ ] Importar desde Excel/XLSX

### 4.10 AGENDA
- [ ] Vista diaria (hoy)
- [ ] Vista próximas citas
- [ ] Vista semanal
- [ ] Vista mensual
- [ ] Crear cita con: paciente, médico, hora, tipo de consulta
- [ ] Recurrencia automática (3m, 6m, 1 año para periódicos)
- [ ] Validación de solapamiento de horarios
- [ ] Multi-médico (secretaria puede ver todos)
- [ ] Estado: En espera → Atendiendo → Atendido
- [ ] Iniciar HC desde cita (modal tipo: Ocupacional / General)
- [ ] Al abrir HC desde agenda: cargar TODOS los campos del paciente existente

### 4.11 EMPRESAS
- [ ] CRUD completo (crear, editar, eliminar)
- [ ] NIT, nombre, ciudad, ARL, representante legal, dirección
- [ ] Tarifas: ingreso, periódico, egreso, consulta
- [ ] Código de portal (EMP-XXXX-YYYY, auto-generado)
- [ ] Actividad económica
- [ ] Panel de documentos por empresa
- [ ] MERGE anti-regresión en array de empresas

### 4.12 FACTURACIÓN / CUENTAS DE COBRO
- [ ] Crear cuenta de cobro con items
- [ ] Monto en letras (`numeroALetras`)
- [ ] Datos bancarios del médico
- [ ] Impresión / PDF profesional
- [ ] Histórico de facturas
- [ ] Pestaña "Por facturar" (atenciones cerradas sin facturar)
- [ ] Movimientos de caja (ingresos/egresos)
- [ ] Auto-registro en caja al cerrar HC

### 4.13 INFORMES SOCIODEMOGRÁFICOS
- [ ] Generación automática desde las atenciones de una empresa
- [ ] Gráficos: distribución por sexo, edad, cargo, tipo de examen
- [ ] Publicar informe al portal empresa
- [ ] Exportar como PDF
- [ ] Guardar en D1 con MERGE

### 4.14 CARTAS DE CUSTODIA
- [ ] Generar carta de custodia de historia clínica
- [ ] Datos del paciente, empresa, médico, fecha
- [ ] Descarga en PDF
- [ ] Almacenar en D1

### 4.15 INTELIGENCIA ARTIFICIAL
- [ ] Soporte multi-proveedor: Gemini, Groq, OpenRouter, Together, OpenAI
- [ ] Configuración de provider y API keys por usuario
- [ ] Recomendaciones médicas automáticas
- [ ] Justificación clínica para pruebas especiales
- [ ] Derivaciones automáticas con urgencia y especialidad
- [ ] Descripción del cargo AI-asistida
- [ ] Evolución clínica automática
- [ ] Panel de configuración AI con validación de keys

### 4.16 TELECONSULTA / TELEMEDICINA
- [ ] Agendar teleconsulta
- [ ] Formulario de teleconsulta
- [ ] Crear HC desde teleconsulta finalizada
- [ ] Historial de teleconsultas

### 4.17 SISTEMA DE GESTIÓN SST (SGSST)
- [ ] Dashboard SST
- [ ] Matriz de riesgos GTC-45
- [ ] Plan anual de trabajo
- [ ] Investigación de accidentes
- [ ] Checklists de inspección
- [ ] Módulo de capacitación
- [ ] Repositorio de documentos
- [ ] Generador de políticas
- [ ] Programas de Vigilancia Epidemiológica (SVE)

### 4.18 USUARIOS Y CONFIGURACIÓN
- [ ] Lista de usuarios con roles
- [ ] Crear/editar/desactivar usuarios
- [ ] Datos del médico: nombre, títulos, firma, licencia, ciudad, celular
- [ ] Firma digital: captura por canvas o carga de imagen
- [ ] Datos de la IPS
- [ ] Configuración de email (EmailJS)
- [ ] Configuración general del sistema

### 4.19 NOTIFICACIONES Y MENSAJERÍA
- [ ] Sistema de mensajes internos entre usuarios
- [ ] Notificaciones de nuevas atenciones
- [ ] Alertas de evaluaciones próximas a vencer (max 3 años)
- [ ] Toast/modal de avisos

### 4.20 COMUNICACIONES
- [ ] Envío de certificado por email (EmailJS auto + mailto manual)
- [ ] Envío por WhatsApp (link wa.me con mensaje predefinido)
- [ ] Email con HTML profesional: datos médico, QR, link portal

### 4.21 ALMACENAMIENTO D1 (CRÍTICO)
- [ ] Worker: `siso-api.dr-juliancucalon.workers.dev`
- [ ] Token: del secret `VITE_WORKER_TOKEN`
- [ ] Auto-chunking transparente para payloads >500KB
- [ ] MERGE por id en TODOS los arrays (nunca sobreescribir)
- [ ] Operación bloqueante al cerrar HC (await _workerSet)
- [ ] Fallback a Supabase si D1 falla (solo lectura)
- [ ] Snapshot diario automático (Cron en Worker)
- [ ] `/health` endpoint del Worker

### 4.22 OFFLINE-FIRST (FASE FUTURA — FASE 2)
- [ ] IndexedDB para operaciones offline (NO localStorage que solo tiene 5MB)
- [ ] Cola de operaciones pendientes con UUID anti-duplicado
- [ ] Sincronización automática al recuperar conexión
- [ ] UI: banner "OFFLINE — X operaciones pendientes"
- [ ] Anti-duplicado: cada op tiene UUID, Worker verifica idempotencia

### 4.23 BLINDAJE MULTI-DISPOSITIVO
- [ ] VersionWatcher: detecta bundle nuevo cada 60s → banner update → auto-reload 5min
- [ ] D1ChangesWatcher: poll cada 30s a __meta.ts → refresh silencioso
- [ ] StorageHealth (Alt+H): panel salud + auto-limpieza LS >80%
- [ ] MERGE anti-regresión en todos los writes de arrays

### 4.24 IMPRESIÓN Y PDF
- [ ] Certificado ocupacional completo (firma + QR + membrete + datos médico)
- [ ] HC General completa
- [ ] Fórmula médica (individual y completa)
- [ ] Derivación/interconsulta
- [ ] Solicitud de exámenes
- [ ] Cuenta de cobro/factura
- [ ] Informe sociodemográfico
- [ ] Lista de pacientes
- [ ] Carta de custodia
- [ ] Ventanas popup con edición previa a imprimir
- [ ] Alerta si popup bloqueado: instrucciones claras para el usuario

### 4.25 CUMPLIMIENTO LEGAL
- [ ] Res. 1843/2025 (exámenes médicos ocupacionales)
- [ ] Res. 1995/1999 (foliación de HC)
- [ ] Ley 1581/2012 (protección de datos — consentimiento)
- [ ] GTC-45 (identificación de riesgos)
- [ ] Sistema de verificación de certificados por URL pública

---

## 5. CLAVES D1 CRÍTICAS — NO CAMBIAR NOMBRES

```
siso_db_patients_<userId>              ← Lista pacientes (chunked si >500KB)
siso_patients_<userId>                 ← Alias
siso_companies_drcucalon               ← Lista empresas
siso_companies_shared                  ← Alias compartido
siso_atenciones_cerradas               ← Historial atenciones (chunked)
siso_hc_completa_<cc>                  ← HC completa por cédula
siso_portal_doc_<cc>                   ← Datos portal por cédula (con firma)
siso_portal_<code>                     ← HC por código verificación
siso_portal_CV-<code>                  ← Alias por código
siso_portal_empresa_<NIT>              ← Índice documentos empresa
siso_portal_empresa_atenciones_<NIT>   ← Atenciones por empresa
siso_portal_empresa_docs_<NIT>         ← Periodos y contadores
siso_encuestas                         ← Lista encuestas
siso_encuesta_resp_<token>             ← Respuestas por token
siso_informes                          ← Informes guardados
siso_saved_bills_<userId>              ← Facturas/cuentas cobro
siso_cartas_custodia_<userId>          ← Cartas de custodia
siso_doctor_signature                  ← Firma digital (base64)
siso_doctor_data_<userId>              ← Datos del médico
siso_users                             ← Lista de usuarios
siso_agendados_<userId>                ← Agenda del médico
siso_caja_movs_<userId>                ← Movimientos caja
siso_arl_<userId>                      ← Registros ARL
siso_mensajes                          ← Mensajes internos
```

---

## 6. FIXES CRÍTICOS DEL MONOLITO — DEBEN ESTAR EN EL REFACTOR

### FIX 1 — Abrir HC desde agenda/lista carga datos completos
Cuando el usuario abre una HC desde la lista de pacientes o desde la agenda,
DEBE cargar TODOS los campos del paciente existente (docTipo, fechaNacimiento,
celular, email, residencia, afp, dependencia, tipoContrato, turnoTrabajo, etc.).
NO crear un formulario vacío. Buscar por docNumero en patientsList.
Ver commit `010db1b` del monolito.

### FIX 2 — MERGE anti-regresión en siso_atenciones_cerradas
Antes de escribir a D1, leer el valor remoto y hacer MERGE por `id`.
Nunca puede quedar menor que el remoto.
Ver commit `14f8c74` del monolito.

### FIX 3 — Publicación BLOQUEANTE al portal al cerrar HC
Al cerrar una HC, escribir BLOQUEANTE (await) a las 6 claves del portal.
Si falla D1, mostrar alerta pero NO bloquear el flujo del médico.
Ver commit `f12510d` del monolito.

### FIX 4 — Botones de impresión alertan si popup bloqueado
`window.open()` puede retornar null si el browser bloquea popups.
En ese caso mostrar alert con instrucciones claras.
Ver commit `f12510d` del monolito.

### FIX 5 — Firma en portal sin comillas extra
Las firmas base64 NO deben estar envueltas en comillas extra.
Al guardar: `_firma = cleanFirma(firma)` que quita wrapping de comillas.

### FIX 6 — Deduplicación en importación de pacientes
Al importar pacientes de encuesta, verificar que no existan por docNumero
antes de agregar. Usar MERGE por docNumero, no solo por id.

---

## 7. ARQUITECTURA OBJETIVO FINAL

```
siso-ocupasalud/
├── .github/workflows/deploy.yml    ← CI/CD (ya funciona en REPO C)
├── docs/
│   ├── PROMPT_MAESTRO_v4.md        ← Este archivo
│   ├── PROMPT_MAESTRO_REFACTOR.md  ← Contexto técnico detallado
│   └── ESTADO_SPRINT.md            ← ⭐ ARCHIVO DE MEMORIA DEL AGENTE
├── .env.example
├── package.json
├── vite.config.js
├── vitest.config.js
├── index.html
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── sw.js
│   └── manifest.json
├── siso-worker/
│   ├── index.js
│   ├── schema.sql
│   └── wrangler.json
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── stores/
    │   ├── authStore.js
    │   ├── companiesStore.js
    │   ├── aiStore.js
    │   └── uiStore.js
    ├── app/
    │   └── Layout.jsx
    ├── components/
    │   ├── VersionWatcher.jsx
    │   ├── D1ChangesWatcher.jsx
    │   ├── StorageHealth.jsx
    │   └── ErrorBoundary.jsx
    ├── shared/
    │   ├── lib/
    │   │   ├── storage.js
    │   │   ├── d1Client.js
    │   │   ├── supabase.js
    │   │   ├── syncManager.js
    │   │   ├── offlineDB.js
    │   │   ├── aiProviders.js
    │   │   ├── printUtils.js
    │   │   ├── formatters.js
    │   │   ├── security.js
    │   │   ├── crypto.js
    │   │   └── normativa.js
    │   ├── data/
    │   │   ├── initialStates.js
    │   │   ├── cie10.js, cie11.js, cups.js, medicamentos.js
    │   │   ├── recomendaciones.js, restricciones.js, derivaciones.js
    │   │   └── planConfig.js
    │   ├── components/
    │   │   ├── CIE10Input.jsx, CUPSInput.jsx
    │   │   ├── MedicamentoAutocomplete.jsx
    │   │   ├── DoctorSignature.jsx
    │   │   ├── BrandLogo.jsx, InputGroup.jsx, SelectGroup.jsx
    │   │   ├── PlanGate.jsx, SectionTitle.jsx
    │   │   └── MensajesDrawer.jsx
    │   └── utils/
    │       ├── validators.js, sanitize.js, helpers.js
    │       └── storageKeys.js
    ├── modules/
    │   ├── auth/
    │   ├── clinical/
    │   ├── patients/
    │   ├── companies/
    │   ├── agenda/
    │   ├── billing/
    │   ├── reports/
    │   ├── sgsst/
    │   ├── ai/
    │   ├── users/
    │   ├── telemedicine/
    │   └── notifications/
    └── pages/
        ├── LoginPage.jsx
        ├── DashboardPage.jsx
        ├── PatientsPage.jsx
        ├── HistoriaPage.jsx
        ├── HistoriaGeneralPage.jsx
        ├── CompaniesPage.jsx
        ├── AgendaPage.jsx
        ├── BillingPage.jsx
        ├── CajaPage.jsx
        ├── ReportsPage.jsx
        ├── SGSSTPage.jsx
        ├── TelemedicinePage.jsx
        ├── WorkerPortalPage.jsx
        ├── PortalEmpresaPage.jsx
        ├── UsersPage.jsx
        ├── SettingsPage.jsx
        ├── PortalCertificadosEmpresa.jsx
        ├── CartaCustodiaPage.jsx
        ├── CertificadoPage.jsx
        └── VerificacionPage.jsx
```

---

## 8. METODOLOGÍA DE TRABAJO — 10 SPRINTS CON CHECKPOINT

Cada sprint = 1 PR verificable. **NO avanzar sin confirmación del usuario.**
El agente ejecuta UN sprint por sesión y espera aprobación.

### SPRINT 0 — FUSIÓN DE BASES (1 día)
**Pasos con checkpoint:**
- [ ] Paso 1: Clonar/actualizar REPO B localmente
- [ ] Paso 2: Copiar toda la `src/` de REPO B a REPO C
- [ ] Paso 3: Copiar `package.json` de REPO B a REPO C
- [ ] Paso 4: Verificar que se mantienen de REPO C: `.github/`, `siso-worker/`, `public/_headers`, `vite.config.js`, `package-lock.json`
- [ ] Paso 5: Copiar los 3 componentes transversales de REPO C: `VersionWatcher.jsx`, `D1ChangesWatcher.jsx`, `StorageHealth.jsx`
- [ ] Paso 6: Ejecutar `npm install && npm run build` — DEBE pasar
- [ ] Paso 7: Commit `sprint0: fusion bases REPO-B + infraestructura REPO-C`

### SPRINT 1 — ALMACENAMIENTO D1 COMPLETO (1 día)
- [ ] Paso 1: Crear/verificar `src/shared/lib/d1Client.js` con `d1Get`, `d1Set`, `d1GetMany`, `d1Delete`
- [ ] Paso 2: Implementar `d1WriteArrayMerge(key, list, idField='id')` — CRÍTICO
- [ ] Paso 3: Implementar auto-chunking >500KB transparente
- [ ] Paso 4: Implementar retries automáticos (3 intentos, backoff exponencial)
- [ ] Paso 5: Implementar header `If-Match` para locking optimista
- [ ] Paso 6: Integrar VersionWatcher + D1ChangesWatcher en App.jsx
- [ ] Paso 7: Crear tests `d1Client.test.js` (get, set, merge, chunked)
- [ ] Paso 8: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 9: Commit `sprint1: d1Client completo con merge anti-regresion`

### SPRINT 2 — AUTH + USUARIOS + ROUTER (1 día)
- [ ] Paso 1: Verificar `authStore.js` (Zustand) con todos los roles
- [ ] Paso 2: Completar `LoginPage` con rate limiting, 2FA
- [ ] Paso 3: Completar `UsersPage` con CRUD de usuarios
- [ ] Paso 4: Conectar authStore a D1 (`siso_users` como fuente)
- [ ] Paso 5: Router completo en App.jsx (todas las rutas del monolito)
- [ ] Paso 6: Layout con navbar + sidebar responsive
- [ ] Paso 7: Tests: auth, roles, permisos
- [ ] Paso 8: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 9: Commit `sprint2: auth + router + usuarios completo`

### SPRINT 3 — HC OCUPACIONAL (2-3 días — el más crítico)
- [ ] Paso 1: Verificar `initialOccupPatientState` contra monolito línea 8630
- [ ] Paso 2: Completar `OccupationalHC.jsx` con TODOS los campos
- [ ] Paso 3: Completar `PhysicalExam.jsx` (29 sistemas)
- [ ] Paso 4: Completar `RecommendationsPanel.jsx` (checklist A-F)
- [ ] Paso 5: Completar `RestrictionsPanel.jsx`
- [ ] Paso 6: Completar `TabFormulaDerivacion.jsx` con impresión
- [ ] Paso 7: Implementar cierre HC bloqueante a D1 (6 claves, FIX 3)
- [ ] Paso 8: Implementar código verificación `SISO-YYYYMMDD-PACID-HASH8`
- [ ] Paso 9: Implementar QR del código
- [ ] Paso 10: Implementar impresión del certificado completo
- [ ] Paso 11: Tests: cierre HC, publicación portal, código verificación
- [ ] Paso 12: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 13: Commit `sprint3: hc-ocupacional completa con cierre bloqueante`

### SPRINT 4 — HC GENERAL + FÓRMULA + DERIVACIONES (1 día)
- [ ] Paso 1: Completar `GeneralHC.jsx` con todos los campos
- [ ] Paso 2: `PrescriptionTab.jsx` con autocompletar medicamentos
- [ ] Paso 3: `ExamRequestTab.jsx` con impresión
- [ ] Paso 4: Impresión de derivación con popup editable
- [ ] Paso 5: Tests: HC general, impresión
- [ ] Paso 6: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 7: Commit `sprint4: hc-general + formula + derivaciones`

### SPRINT 5 — PORTAL TRABAJADOR + PORTAL EMPRESA (1 día)
- [ ] Paso 1: Completar `WorkerPortalPage.jsx`
- [ ] Paso 2: Completar `PortalEmpresaPage.jsx`
- [ ] Paso 3: Completar `PortalCertificadosEmpresa.jsx`
- [ ] Paso 4: FIX 5 — limpiar firmas con comillas extra
- [ ] Paso 5: Tests: login portal, ver atenciones
- [ ] Paso 6: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 7: Commit `sprint5: portales trabajador y empresa`

### SPRINT 6 — ENCUESTAS + AGENDA + PACIENTES (1 día)
- [ ] Paso 1: Encuestas: crear, link público Worker D1, importar, agendar
- [ ] Paso 2: Agenda: vistas diaria/semanal/mensual, recurrencia, multi-médico
- [ ] Paso 3: FIX 1 — HC desde agenda carga datos completos
- [ ] Paso 4: FIX 6 — deduplicación en importación
- [ ] Paso 5: Tests: crear encuesta, responder, importar, agendar
- [ ] Paso 6: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 7: Commit `sprint6: encuestas + agenda + pacientes`

### SPRINT 7 — FACTURACIÓN + CAJA + INFORMES (1 día)
- [ ] Paso 1: `BillingPage`: cuentas de cobro, items, monto en letras
- [ ] Paso 2: `CajaPage`: movimientos, auto-registro al cerrar HC
- [ ] Paso 3: Informes sociodemográficos: generar + publicar portal
- [ ] Paso 4: Tests: crear factura, movimiento caja, informe
- [ ] Paso 5: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 6: Commit `sprint7: facturacion + caja + informes`

### SPRINT 8 — IA + TELECONSULTA + SGSST (1-2 días)
- [ ] Paso 1: IA: multi-proveedor, recomendaciones, derivaciones, evolución
- [ ] Paso 2: Teleconsulta: agendar, formulario, crear HC desde teleconsulta
- [ ] Paso 3: SGSST: dashboard, matriz riesgos, plan anual, accidentes
- [ ] Paso 4: Tests: IA (mock), teleconsulta
- [ ] Paso 5: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 6: Commit `sprint8: ia + teleconsulta + sgsst`

### SPRINT 9 — CARTAS, COMUNICACIONES, AJUSTES (medio día)
- [ ] Paso 1: CartaCustodia: generar + descargar + D1
- [ ] Paso 2: Email: EmailJS auto + mailto manual
- [ ] Paso 3: WhatsApp: link wa.me
- [ ] Paso 4: Mensajería interna
- [ ] Paso 5: Tests: email mock, carta
- [ ] Paso 6: `npm run build && npm test` — DEBEN pasar
- [ ] Paso 7: Commit `sprint9: cartas + comunicaciones`

### SPRINT 10 — QA FINAL + PRODUCCIÓN (1 día)
- [ ] Paso 1: Tests E2E: login → crear paciente → abrir HC → cerrar → ver en portal empresa
- [ ] Paso 2: Tests E2E: crear encuesta → responder → importar pacientes
- [ ] Paso 3: Tests E2E: agendar → iniciar HC → cerrar → ver en agenda
- [ ] Paso 4: Tests E2E: crear empresa → crear cita → portal empresa
- [ ] Paso 5: Comparar conteos D1 antes/después: debe ser ≥ al inicial
- [ ] Paso 6: Verificar firma en portal (sin comillas extra)
- [ ] Paso 7: Verificar VersionWatcher detecta updates
- [ ] Paso 8: Verificar D1ChangesWatcher sincroniza entre tabs
- [ ] Paso 9: Build final + `npm run test` todo verde
- [ ] Paso 10: Push → CI/CD → verificar `siso-refactor.pages.dev`
- [ ] Paso 11: Commit `sprint10: qa final produccion ready`

---

## 9. CONSTRAINTS ABSOLUTOS — NUNCA VIOLAR

```
1.  NUNCA perder datos existentes en D1 (2.441 claves activas)
2.  NUNCA cambiar el nombre de una clave D1 existente
3.  NUNCA escribir a D1 sin MERGE cuando el valor es un array
4.  NUNCA hacer push --force a master
5.  NUNCA tocar el repo de PRODUCCIÓN (ocupasaludparadesplegar) durante el refactor
6.  NUNCA avanzar al siguiente sprint sin confirmación del usuario
7.  NUNCA avanzar al siguiente sprint sin que el actual compile (npm run build pasa)
8.  NUNCA usar Supabase para escritura — solo Worker D1 (Supabase = fallback lectura)
9.  NUNCA introducir nuevas dependencias npm sin justificar en el commit
10. SIEMPRE actualizar docs/ESTADO_SPRINT.md después de cada paso completado
11. SIEMPRE hacer commit de checkpoint antes de que el contexto se llene
12. SIEMPRE snapshot D1 antes de cualquier cambio a datos
13. SIEMPRE usar `await _workerSet(...)` en el cierre de HC (bloqueante, no fire-and-forget)
14. SIEMPRE verificar que los botones de impresión alertan si el popup está bloqueado
15. SIEMPRE que se importe/cargue un paciente existente, hacer spread completo de sus datos
```

---

## 10. CONFIGURACIÓN DE ENTORNO

### Variables de entorno requeridas (.env)
```
VITE_WORKER_URL=https://siso-api.dr-juliancucalon.workers.dev
VITE_WORKER_TOKEN=[VITE_WORKER_TOKEN — ver GitHub Secrets]
VITE_STABLE_DOMAIN=https://siso-refactor.pages.dev
```

### GitHub Secrets ya configurados en siso-ocupasalud:
```
CF_API_TOKEN       = [CF_API_TOKEN — ver GitHub Secrets]
CF_ACCOUNT_ID      = [CF_ACCOUNT_ID — ver GitHub Secrets]
CF_PAGES_PROJECT   = siso-refactor
VITE_WORKER_URL    = https://siso-api.dr-juliancucalon.workers.dev
VITE_WORKER_TOKEN  = [VITE_WORKER_TOKEN — ver GitHub Secrets]
```

### Comandos de trabajo
```bash
cd "C:\Users\JQK3\Desktop\refactorizacion total"
npm install
npm run dev
npm test
npm run build
git add -A && git commit -m "sprint-X: descripción" && git push origin master
cd siso-worker && wrangler deploy   # solo cuando se modifica siso-worker/
```

---

## 11. REFERENCIAS DE LÍNEAS EN EL MONOLITO

⚠️ **NUNCA abrir el App.jsx completo en contexto. Leer SOLO las líneas necesarias.**

```
8630   initialOccupPatientState       ← Estado inicial HC Ocup (100+ campos)
8960   Roles y permisos               ← ROLES, permisos por funcionalidad
11490  openPrintWindow()              ← Impresión fórmula/derivación
16853  function AppInner()            ← Componente principal
17024  _publicarAlPortalEmpresa()     ← Publicar informe al portal
17127  saveInforme()                  ← Guardar informe + publicar
19600  cierre HC (bloqueante)         ← Las 6 claves D1 del portal
21366  _writeArrayMergeD1()           ← MERGE anti-regresión (CRÍTICO)
23485  goTo()                         ← Navegación con guard HC dirty
32296  botón "HC Ocup." en lista      ← spread completo del paciente
45517  abrirHCDesdeAgenda()           ← HC desde cita (FIX 1)
```

---

## 12. VERIFICACIÓN DE COMPLETITUD

Al finalizar los 10 sprints:

```bash
# 1. Build sin errores
npm run build

# 2. Tests todos verdes
npm test

# 3. Verificar datos D1 intactos
node -e "
const T='[VITE_WORKER_TOKEN — ver GitHub Secrets]';
fetch('https://siso-api.dr-juliancucalon.workers.dev/health', {
  headers:{'X-Siso-Token':T}
}).then(r=>r.json()).then(d=>console.log('D1 OK:', d.counts))
"

# 4. E2E manual en navegador:
# → siso-refactor.pages.dev
# → Login con admin/admin123
# → Crear paciente → abrir HC → cerrar → verificar en portal empresa
# → Badge versión visible en esquina inferior
# → Alt+H muestra panel de salud
```

---

## 13. NOTA SOBRE EL REPO DESTINO

El repo `drjuliancucalon-droid/siso-ocupasalud` ya tiene:
- CI/CD configurado (push → build → test → deploy Worker → deploy Pages)
- 5 secrets de GitHub configurados
- CF Pages project `siso-refactor` creado
- Rama predeterminada: `master`

**NO crear un nuevo repo.** Trabajar sobre este existente.

---

## 14. CÓMO INICIAR CADA SESIÓN DE TRABAJO

Comando exacto para Gemini CLI u otro agente:

```
gemini --model gemini-2.5-pro

> @docs/PROMPT_MAESTRO_v4.md @docs/ESTADO_SPRINT.md
  Sigue el Protocolo de Sesión de la Sección 0.
  Lee ESTADO_SPRINT.md, identifica dónde estamos y confírmame
  antes de escribir cualquier código.
```

---

## 15. PLANTILLA INICIAL — docs/ESTADO_SPRINT.md

Crear este archivo en el repo antes de iniciar la primera sesión:

```markdown
# Estado del Refactor SISO OcupaSalud
_Actualizado por el agente al final de cada paso. No editar manualmente._

## Sprint Activo: 0
## Paso Actual: 1 de 7
## Última actualización: 2026-06-18
## Sesiones completadas: 0

## Progreso General
- [ ] Sprint 0 — Fusión de bases (0/7 pasos)
- [ ] Sprint 1 — D1 Client (0/9 pasos)
- [ ] Sprint 2 — Auth + Router (0/9 pasos)
- [ ] Sprint 3 — HC Ocupacional ⚠️ CRÍTICO (0/13 pasos)
- [ ] Sprint 4 — HC General (0/7 pasos)
- [ ] Sprint 5 — Portales (0/7 pasos)
- [ ] Sprint 6 — Encuestas + Agenda (0/7 pasos)
- [ ] Sprint 7 — Facturación (0/6 pasos)
- [ ] Sprint 8 — IA + Teleconsulta (0/6 pasos)
- [ ] Sprint 9 — Cartas + Comunicaciones (0/7 pasos)
- [ ] Sprint 10 — QA Final (0/11 pasos)

## → CONTINUAR AQUÍ
**Sprint:** 0
**Paso pendiente:** Paso 1 — Clonar/actualizar REPO B localmente
**Acción exacta:** `git clone https://github.com/drjuliancucalon-droid/siso-appultimo ../siso-appultimo`

## Archivos Modificados en Última Sesión
_(ninguno aún)_

## Errores Pendientes
_(ninguno)_

## Notas Técnicas para Próxima Sesión
_(ninguna aún)_

## Historial de Checkpoints
| Fecha | Sprint | Paso | Estado |
|-------|--------|------|--------|
| -     | -      | -    | Inicio |
```

---

*Versión 4.0 — 2026-06-18*
*Cambios vs v3.0: Sistema de memoria por sesión + checkpoint automático + protocolo de continuidad*
*Monolito base: 58.389 líneas | Meta: arquitectura modular 100% funcional*
