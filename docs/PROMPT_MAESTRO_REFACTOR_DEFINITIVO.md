# ╔══════════════════════════════════════════════════════════════════════╗
# ║  PROMPT MAESTRO DEFINITIVO — SISO OcupaSalud Refactorización 100%  ║
# ║  Versión: 3.0 FINAL | Fecha: 2026-06-12                            ║
# ╚══════════════════════════════════════════════════════════════════════╝

## INSTRUCCIÓN INICIAL OBLIGATORIA

Este prompt debe ser entregado íntegro a Claude Code (o cualquier agente con
acceso al filesystem). El agente debe leerlo completo antes de escribir UNA
SOLA línea de código.

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

### REPO B — MÁS AVANZADO (refactorización más completa)
- **GitHub:** `https://github.com/drjuliancucalon-droid/siso-appultimo`
- **Rama:** `main`
- **Descripción:** React Router v7 + Zustand + React Query + 44 páginas +
  77 módulos + backend Node.js + 14 test suites + offlineDB + syncManager.
  Es la arquitectura más cercana al objetivo final. Tiene stores, hooks,
  módulos por dominio, tests, y capa shared completa.
- **Stack:** react-router-dom v7, zustand v5, @tanstack/react-query v5,
  vite, vitest, lucide-react
- **Uso:** BASE PRINCIPAL del refactor. Copiar su estructura y completarla.

### REPO C — PARCIALMENTE AVANZADO
- **Local:** `C:\Users\JQK3\Desktop\refactorizacion total`
- **GitHub:** `https://github.com/drjuliancucalon-droid/siso-ocupasalud`
- **Rama:** `master`
- **Descripción:** Tiene CI/CD funcionando (.github/workflows/deploy.yml),
  package-lock.json, vite.config.js con version.json plugin, componentes
  VersionWatcher/D1ChangesWatcher/StorageHealth, siso-worker actualizado,
  y shared/utils + shared/storage básicos (~30% del trabajo).
- **Uso:** Destino final. Ya tiene la infraestructura de deploy. Completarlo.

---

## 3. ESTRATEGIA DE FUSIÓN

**NO iniciar desde cero.** Combinar lo mejor de cada repo:

```
REPO B (siso-appultimo) → Estructura, módulos, páginas, hooks, stores, tests
REPO C (refactorizacion total) → CI/CD, Worker, VersionWatcher, D1ChangesWatcher
REPO A (monolito) → Fuente de verdad de TODA la lógica de negocio
```

### Plan de fusión concreto:

1. Copiar TODA la estructura `src/` de REPO B a REPO C (manteniendo CI/CD de C)
2. Completar cada módulo/página consultando REPO A (monolito) para lógica faltante
3. Sustituir todas las llamadas a Supabase por llamadas al Worker D1
4. Integrar los componentes de REPO C que faltan en B: VersionWatcher, etc.
5. Garantizar que el build + tests pasan antes de cada commit

---

## 4. INVENTARIO COMPLETO DE FUNCIONALIDADES A IMPLEMENTAR

Todo lo que está en el monolito (REPO A) DEBE existir en el repo final.
Verifica cada item contra `src/App.jsx` del monolito.

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
- [ ] Antecedentes agrupados (8 categorías: personalMedicos, familiares,
      toxicológicos, laborales, quirúrgicos, traumáticos, alérgicos, hospitalarios)
- [ ] Exploración física completa (29+ sistemas)
- [ ] Riesgos ocupacionales GTC-45 (físicos, químicos, biológicos,
      mecánicos, psicosociales, ergonómicos, locativos)
- [ ] Concepto de aptitud (5 opciones según Res. 1843/2025)
- [ ] Foliación HC (Res. 1995/1999 Art. 3)
- [ ] Código de verificación: `SISO-YYYYMMDD-PACID-HASH8`
- [ ] Recomendaciones médicas con checklist (categorías A-F)
- [ ] Restricciones laborales con checklist
- [ ] Perfil de cargo (Res. 1843/2025 Art. 29: funciones, demandas físicas/mentales,
      factores de riesgo, medidas de control)
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
- [ ] MERGE anti-regresión en TODOS los arrays D1 (nunca sobreescribir)
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
  (NO crear vacío; buscar por docNumero en patientsList)

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
- [ ] Recomendaciones médicas automáticas (basadas en hallazgos del examen)
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
siso_encuesta_resp_<token>             ← Respuestas de encuesta
```

---

## 6. FIXES CRÍTICOS DEL MONOLITO — DEBEN ESTAR EN EL REFACTOR

Los siguientes bugs fueron corregidos en el monolito y DEBEN replicarse:

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
Ver commit del monolito relacionado con "reparar firmas".

### FIX 6 — Deduplicación en importación de pacientes
Al importar pacientes de encuesta, verificar que no existan por docNumero
antes de agregar. Usar MERGE por docNumero, no solo por id.

---

## 7. ARQUITECTURA OBJETIVO FINAL

```
siso-ocupasalud/
├── .github/workflows/deploy.yml    ← CI/CD (ya funciona en REPO C)
├── .env.example                    ← Variables documentadas
├── package.json                    ← deps de REPO B (zustand, react-router, etc.)
├── package-lock.json               ← ya en REPO C
├── vite.config.js                  ← version.json plugin de REPO C
├── vitest.config.js
├── index.html                      ← con Tailwind CDN + SISO config
├── public/
│   ├── _headers                    ← Cache-Control no-cache (REPO C)
│   ├── _redirects                  ← SPA fallback
│   ├── sw.js                       ← Service Worker
│   └── manifest.json
├── siso-worker/                    ← Worker D1 actualizado (REPO C)
│   ├── index.js                    ← con /health + locking If-Match
│   ├── schema.sql
│   └── wrangler.json
└── src/
    ├── App.jsx                     ← Router limpio con React Router v7
    ├── main.jsx
    ├── styles.css
    ├── stores/                     ← Zustand (de REPO B)
    │   ├── authStore.js
    │   ├── companiesStore.js
    │   ├── aiStore.js
    │   └── uiStore.js
    ├── app/
    │   └── Layout.jsx              ← Navbar + sidebar + slot (de REPO B)
    ├── components/                 ← Componentes transversales
    │   ├── VersionWatcher.jsx      ← de REPO C
    │   ├── D1ChangesWatcher.jsx    ← de REPO C
    │   ├── StorageHealth.jsx       ← de REPO C
    │   └── ErrorBoundary.jsx       ← de REPO B
    ├── shared/
    │   ├── lib/
    │   │   ├── storage.js          ← _ls, _ss, sp, sps (de REPO B)
    │   │   ├── d1Client.js         ← CRUD D1 + chunking + MERGE (de REPO C)
    │   │   ├── supabase.js         ← fallback legacy (de REPO B)
    │   │   ├── syncManager.js      ← cola offline (de REPO B)
    │   │   ├── offlineDB.js        ← IndexedDB (de REPO B — preparado)
    │   │   ├── aiProviders.js      ← multi-provider IA (de REPO B)
    │   │   ├── printUtils.js       ← helpers impresión (de REPO B)
    │   │   ├── formatters.js       ← numeroALetras, fechas (de REPO C)
    │   │   ├── security.js         ← auditLog, rate limiting (de REPO C)
    │   │   ├── crypto.js           ← hash, uuid (de REPO B)
    │   │   └── normativa.js        ← constantes legales (de REPO B)
    │   ├── data/
    │   │   ├── initialStates.js    ← initialOccupPatientState (de REPO B)
    │   │   ├── cie10.js, cie11.js, cups.js, medicamentos.js
    │   │   ├── recomendaciones.js, restricciones.js, derivaciones.js
    │   │   └── planConfig.js
    │   ├── components/             ← UI compartidos
    │   │   ├── CIE10Input.jsx, CUPSInput.jsx
    │   │   ├── MedicamentoAutocomplete.jsx
    │   │   ├── DoctorSignature.jsx
    │   │   ├── BrandLogo.jsx, InputGroup.jsx, SelectGroup.jsx
    │   │   ├── PlanGate.jsx, SectionTitle.jsx
    │   │   └── MensajesDrawer.jsx
    │   └── utils/
    │       ├── validators.js, sanitize.js, helpers.js
    │       └── storageKeys.js      ← todas las claves D1/LS
    ├── modules/                    ← lógica por dominio (de REPO B)
    │   ├── auth/
    │   ├── clinical/               ← HC Ocupacional + HC General
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
    └── pages/                      ← rutas (de REPO B, completadas vs monolito)
        ├── LoginPage.jsx
        ├── DashboardPage.jsx
        ├── PatientsPage.jsx
        ├── HistoriaPage.jsx        ← HC Ocupacional
        ├── HistoriaGeneralPage.jsx ← HC General
        ├── CompaniesPage.jsx
        ├── AgendaPage.jsx
        ├── BillingPage.jsx
        ├── CajaPage.jsx
        ├── ReportsPage.jsx
        ├── SGSSTPage.jsx
        ├── TelemedicinePage.jsx
        ├── WorkerPortalPage.jsx    ← Portal trabajador
        ├── PortalEmpresaPage.jsx   ← Portal empresa
        ├── UsersPage.jsx
        ├── SettingsPage.jsx
        ├── PortalCertificadosEmpresa.jsx
        ├── CartaCustodiaPage.jsx
        ├── CertificadoPage.jsx
        ├── VerificacionPage.jsx
        └── ... (resto de páginas de REPO B)
```

---

## 8. METODOLOGÍA DE TRABAJO — 10 SPRINTS

Cada sprint = 1 PR verificable. NO avanzar sin que el sprint anterior
pase build + tests.

### SPRINT 0 — FUSIÓN DE BASES (1 día)
1. Clonar REPO B (`siso-appultimo`) localmente
2. Copiar toda su `src/` a REPO C (`refactorizacion total`)
3. Copiar su `package.json` (con zustand, react-router, etc.) a REPO C
4. Mantener de REPO C: `.github/`, `siso-worker/`, `public/_headers`,
   `vite.config.js` (con version.json plugin), `package-lock.json`
5. Copiar los 3 componentes transversales de REPO C:
   `VersionWatcher.jsx`, `D1ChangesWatcher.jsx`, `StorageHealth.jsx`
6. Ejecutar `npm install && npm run build` — debe pasar
7. Commit: `sprint0: fusion bases REPO-B + infraestructura REPO-C`

### SPRINT 1 — ALMACENAMIENTO D1 COMPLETO (1 día)
1. Crear/verificar `src/shared/lib/d1Client.js` con:
   - `d1Get(key)`, `d1Set(key, value)`
   - `d1GetMany(keys)`, `d1Delete(key)`
   - `d1WriteArrayMerge(key, list, idField='id')` — CRÍTICO
   - Auto-chunking >500KB transparente
   - Retries automáticos (3 intentos, backoff exponencial)
   - Header `If-Match` para locking optimista
2. Integrar VersionWatcher + D1ChangesWatcher en App.jsx
3. Tests: `d1Client.test.js` (get, set, merge, chunked)
4. Commit: `sprint1: d1Client completo con merge anti-regresion`

### SPRINT 2 — AUTH + USUARIOS + ROUTER (1 día)
1. Verificar `authStore.js` (Zustand) con todos los roles
2. Completar `LoginPage` con rate limiting, 2FA
3. Completar `UsersPage` con CRUD de usuarios
4. Conectar authStore a D1 (`siso_users` como fuente)
5. Router completo en App.jsx (todas las rutas del monolito)
6. Layout con navbar + sidebar responsive
7. Tests: auth, roles, permisos
8. Commit: `sprint2: auth + router + usuarios completo`

### SPRINT 3 — HC OCUPACIONAL (2-3 días — el más crítico)
1. Verificar `initialOccupPatientState` contra monolito línea 8630
2. Completar `OccupationalHC.jsx` con TODOS los campos
3. Completar `PhysicalExam.jsx` (29 sistemas)
4. Completar `RecommendationsPanel.jsx` (checklist A-F)
5. Completar `RestrictionsPanel.jsx`
6. Completar `TabFormulaDerivacion.jsx` con impresión
7. Implementar cierre HC bloqueante a D1 (6 claves, FIX 3)
8. Implementar código verificación: `SISO-YYYYMMDD-PACID-HASH8`
9. Implementar QR del código
10. Implementar impresión del certificado completo
11. Tests: cierre HC, publicación portal, código verificación
12. Commit: `sprint3: hc-ocupacional completa con cierre bloqueante`

### SPRINT 4 — HC GENERAL + FÓRMULA + DERIVACIONES (1 día)
1. Completar `GeneralHC.jsx` con todos los campos
2. `PrescriptionTab.jsx`: fórmula con autocompletar medicamentos
3. `ExamRequestTab.jsx`: solicitud de exámenes con impresión
4. Impresión de derivación con popup editable
5. Tests: HC general, impresión
6. Commit: `sprint4: hc-general + formula + derivaciones`

### SPRINT 5 — PORTAL TRABAJADOR + PORTAL EMPRESA (1 día)
1. Completar `WorkerPortalPage.jsx`: login por cédula, ver atenciones
2. Completar `PortalEmpresaPage.jsx`: login NIT+código, periodos
3. Completar `PortalCertificadosEmpresa.jsx`: descargas masivas
4. FIX 5: limpiar firmas con comillas extra
5. Tests: login portal, ver atenciones
6. Commit: `sprint5: portales trabajador y empresa`

### SPRINT 6 — ENCUESTAS + AGENDA + PACIENTES (1 día)
1. Encuestas: crear, link público Worker D1, importar, agendar
2. Agenda: vistas diaria/semanal/mensual, recurrencia, multi-médico
3. FIX 1: HC desde agenda carga datos completos
4. FIX 6: deduplicación en importación
5. Tests: crear encuesta, responder, importar, agendar
6. Commit: `sprint6: encuestas + agenda + pacientes`

### SPRINT 7 — FACTURACIÓN + CAJA + INFORMES (1 día)
1. `BillingPage`: cuentas de cobro, items, monto en letras
2. `CajaPage`: movimientos, auto-registro al cerrar HC
3. Informes sociodemográficos: generar + publicar portal
4. Tests: crear factura, movimiento caja, informe
5. Commit: `sprint7: facturacion + caja + informes`

### SPRINT 8 — IA + TELECONSULTA + SGSST (1-2 días)
1. IA: multi-proveedor, recomendaciones, derivaciones, evolución
2. Teleconsulta: agendar, formulario, crear HC desde teleconsulta
3. SGSST: dashboard, matriz riesgos, plan anual, accidentes
4. Tests: IA (mock), teleconsulta
5. Commit: `sprint8: ia + teleconsulta + sgsst`

### SPRINT 9 — CARTAS, COMUNICACIONES, AJUSTES (medio día)
1. CartaCustodia: generar + descargar + D1
2. Email: EmailJS auto + mailto manual
3. WhatsApp: link wa.me
4. Mensajería interna
5. Tests: email mock, carta
6. Commit: `sprint9: cartas + comunicaciones`

### SPRINT 10 — QA FINAL + PRODUCCIÓN (1 día)
1. Tests E2E completos:
   - Flujo: login → crear paciente → abrir HC → cerrar → ver en portal empresa
   - Flujo: crear encuesta → responder → importar pacientes
   - Flujo: agendar → iniciar HC → cerrar → ver en agenda
   - Flujo: crear empresa → crear cita → portal empresa
2. Comparar conteos D1 antes/después: debe ser ≥ al inicial
3. Verificar firma en portal (sin comillas extra)
4. Verificar VersionWatcher detecta updates
5. Verificar D1ChangesWatcher sincroniza entre tabs
6. Build final + `npm run test` todo verde
7. Push → CI/CD → verificar `siso-refactor.pages.dev`
8. Commit: `sprint10: qa final produccion ready`

---

## 9. CONSTRAINTS ABSOLUTOS — NUNCA VIOLAR

```
1. NUNCA perder datos existentes en D1 (2.441 claves activas)
2. NUNCA cambiar el nombre de una clave D1 existente
3. NUNCA escribir a D1 sin MERGE cuando el valor es un array
4. NUNCA hacer push --force a master
5. NUNCA tocar el repo de PRODUCCIÓN (ocupasaludparadesplegar) durante el refactor
6. NUNCA avanzar al siguiente sprint sin que el actual compile (npm run build pasa)
7. NUNCA usar Supabase para escritura — solo Worker D1 (Supabase = fallback lectura)
8. NUNCA introducir nuevas dependencias npm sin justificar en el commit
9. SIEMPRE snapshot D1 antes de cualquier cambio a datos
10. SIEMPRE usar `await _workerSet(...)` en el cierre de HC (bloqueante, no fire-and-forget)
11. SIEMPRE verificar que los botones de impresión alertan si el popup está bloqueado
12. SIEMPRE que se importe/cargue un paciente existente, hacer spread completo de sus datos
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
# Directorio de trabajo
cd "C:\Users\JQK3\Desktop\refactorizacion total"

# Desarrollo
npm install
npm run dev

# Tests
npm test
npm run test:watch

# Build
npm run build

# Push (activa CI/CD automático)
git add -A
git commit -m "sprint-X: descripción"
git push origin master

# Deploy Worker (solo cuando se modifica siso-worker/)
cd siso-worker && wrangler deploy
```

---

## 11. REFERENCIAS DE LÍNEAS EN EL MONOLITO

Para completar cada funcionalidad, consultar estas líneas en
`C:\Users\JQK3\Desktop\ocupasaludparadesplegar\src\App.jsx`:

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
45517  abrirHCDesdeAgenda()          ← HC desde cita (FIX 1)
```

---

## 12. VERIFICACIÓN DE COMPLETITUD

Al finalizar los 10 sprints, ejecutar este checklist:

```bash
# 1. Build sin errores
npm run build

# 2. Tests todos verdes
npm test

# 3. Contar funcionalidades implementadas vs inventario (sección 4)
# Debe ser ≥ 95% (mínimo aceptable para producción)

# 4. Verificar datos D1 intactos
node -e "
const T='[VITE_WORKER_TOKEN — ver GitHub Secrets]';
fetch('https://siso-api.dr-juliancucalon.workers.dev/health', {
  headers:{'X-Siso-Token':T}
}).then(r=>r.json()).then(d=>console.log('D1 OK:', d.counts))
"

# 5. E2E manual en navegador:
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
- Archivo `docs/PROMPT_MAESTRO_REFACTOR.md` con contexto de sesiones anteriores

**NO crear un nuevo repo.** Trabajar sobre este existente.

---

## 14. INICIO DE SESIÓN

Para cualquier IA o agente que empiece a trabajar en este proyecto:

1. Leer este prompt completo
2. Leer `docs/PROMPT_MAESTRO_REFACTOR.md` (contexto técnico detallado)
3. Clonar/actualizar los 3 repos
4. Ejecutar `npm install && npm run build` en REPO C para confirmar estado
5. Confirmar: "Entendido. Estado actual: X% completado. Empiezo por SPRINT N."
6. NO escribir código hasta tener confirmación del usuario

---

*Generado: 2026-06-12 | Basado en análisis de 3 repositorios existentes*
*Monolito base: 58.389 líneas | Meta: arquitectura modular 100% funcional*
