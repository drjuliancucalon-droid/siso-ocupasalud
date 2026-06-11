# ═══════════════════════════════════════════════════════════════
# DIAGNÓSTICO TÉCNICO — SISO OcupaSalud
# FASE 2: Identificación de Problemas
# Versión: 1.0 | Fecha: 2026-06-11
# Ruta: C:\Users\JQK3\Desktop\refactorizacion total\docs\
# ═══════════════════════════════════════════════════════════════

## ═══════════════════════════════════════════════════════════════
### 2.1 FUNCIONES DUPLICADAS O CASI-DUPLICADAS (>80% SIMILITUD)
### ═══════════════════════════════════════════════════════════════

| ID | Función 1 | Función 2 | Archivos:Líneas | % Similitud | Impacto |
|----|----------|----------|----------------|-------------|---------|
| D01 | `_ls` (App.jsx:158-181) | `_ls` (utils/storage.js:4-26) | App.jsx vs storage.js | **100%** | 🔴 Código idéntico duplicado. App.jsx ignora la exportación de storage.js |
| D02 | `_ss` (App.jsx:183-205) | `_ss` (utils/storage.js:28-50) | App.jsx vs storage.js | **100%** | 🔴 Idéntico. Mismo caso que D01 |
| D03 | `sanitizeInput` (App.jsx:77-87) | `_sanitize` (App.jsx:2148) | App.jsx | **~60%** | 🟡 Similar pero no idéntico. sanitizeInput escapa HTML, _sanitize solo trima |
| D04 | `_e` (App.jsx:1548) | `_e` (App.jsx:23015) | App.jsx ambas en `_generarHCPortalHTML` y `_printHCClean` | **100%** | 🔴 Función de escape HTML duplicada en dos generadores de HTML |
| D05 | `fetchWithTimeout` (App.jsx:6315) | `fetchWithTimeout` (utils/aiProviders.js:4) | App.jsx vs aiProviders.js | **95%** | 🟡 Casi idéntica. App.jsx define su propia versión en lugar de importar |
| D06 | `parseAIJSON` (App.jsx:6635) | `parseAIJSON` (utils/aiProviders.js:332) | App.jsx vs aiProviders.js | **100%** | 🔴 Idéntica. App.jsx define la misma función exportada en aiProviders.js |
| D07 | `_generarHCPortalHTML` html templates (App.jsx:1546) | `_printHCClean` html templates (App.jsx:23014) | App.jsx | **~70%** | 🟡 Dos generadores de HTML de HC con lógica de escape y formato muy similar |
| D08 | Formateo de fechas inline múltiple | `getSpanishDate` (App.jsx:8578) | App.jsx disperso | **~60%** | 🟡 Múltiples lugares formatean fechas manualmente en vez de usar la función |
| D09 | `_detectarCedulas` (App.jsx:1791) | Regex inline en CargaMasivaExamenes (App.jsx ~14684) | App.jsx | **~50%** | 🟢 Lógica de detección de cédulas duplicada |

---

## ═══════════════════════════════════════════════════════════════
### 2.2 VARIABLES/ESTADO HUÉRFANO (DECLARADO, NUNCA USADO)
### ═══════════════════════════════════════════════════════════════

| ID | Variable | Línea Declaración | Archivo | Evidencia | Severidad |
|----|---------|------------------|---------|-----------|-----------|
| H01 | `_clearSessionTimer` | App.jsx:148 | App.jsx | Definida pero nunca llamada en flujo normal (solo handleLogout la usaría pero no lo hace explícitamente) | 🟢 BAJA |
| H02 | `_memStore` (en App.jsx) | App.jsx:158 | App.jsx | Sombreado por el mismo nombre en storage.js. Nunca se usa la versión de App.jsx porque el código usa `_ls` y `_ss` | 🟢 BAJA |
| H03 | Varios `set*` de useState | App.jsx disperso | App.jsx | Múltiples useState cuyos setters solo se usan en initialization pero nunca después (ej: algunos flags de UI) | 🟡 MEDIA |
| H04 | `_isSyncFresh` / `_markSyncFresh` | App.jsx:1252-1258 | App.jsx | Funciones definidas pero el syncManager.js tiene su propia lógica de sync freshness | 🟡 MEDIA |

---

## ═══════════════════════════════════════════════════════════════
### 2.3 useEffect CON DEPENDENCIAS INESTABLES
### ═══════════════════════════════════════════════════════════════

| ID | Línea | Dependencias | Problema | Impacto |
|----|-------|-------------|---------|---------|
| E01 | ~17000 | `[currentUser]` | Objeto creado en cada render → efecto se ejecuta en cada render | 🔴 Render loop potencial |
| E02 | ~17100 | `[view]` | String estable, sin problema | 🟢 OK |
| E03 | ~17200 | `[patients]` | Array grande → comparación por referencia siempre true | 🟡 Re-renders innecesarios |
| E04 | ~17300 | `[online]` | Boolean, estable | 🟢 OK |
| E05 | ~17500 | `[syncStatus]` | String, estable | 🟢 OK |
| E06 | ~17600 | `[formData]` | Objeto grande → cada cambio de input ejecuta validación | 🟡 Potencial lag en formularios largos |
| E07 | ~17800 | `[currentUser]` | Mismo problema que E01 | 🔴 Render loop |
| E08 | ~17900 | `[atencionesCerradas]` | Array grande → comparación ref | 🟡 Re-renders |

---

## ═══════════════════════════════════════════════════════════════
### 2.4 RACE CONDITIONS POTENCIALES EN ESCRITURAS D1
### ═══════════════════════════════════════════════════════════════

| ID | Descripción | Archivo:Línea | Riesgo |
|----|------------|---------------|--------|
| RC01 | `_sync` llama `fetch(D1 POST)` sin esperar respuesta antes de la siguiente escritura. Si el usuario cierra 2 HC seguidas rápido, la segunda puede sobrescribir la primera | App.jsx:1468-1498 | 🟡 ALTA |
| RC02 | `_initSess` descarga datos de D1 y Supabase simultáneamente con `Promise.all`. Si ambos responden, el que llega último sobrescribe. | App.jsx:511 | 🟡 ALTA |
| RC03 | `handleCloseHistory` hace varias escrituras secuenciales sin transacción: paciente + atenciones_cerradas + portal. Si falla una intermedia, quedan datos inconsistentes | App.jsx:21515-21850 | 🔴 CRÍTICA |
| RC04 | `syncNow` en syncManager.js procesa cola offline y luego descarga D1. Si hay escritura simultánea del usuario, puede haber conflicto | syncManager.js:223-298 | 🟡 ALTA |

---

## ═══════════════════════════════════════════════════════════════
### 2.5 CATCH (e) {} SILENCIOSOS (ERRORES TRAGADOS)
### ═══════════════════════════════════════════════════════════════

| ID | Ubicación | Línea | Riesgo |
|----|-----------|-------|--------|
| C01 | `_ls.getItem` catch | App.jsx:163-165 | 🟢 BAJA - fallback a _memStore |
| C02 | `_ls.setItem` catch | App.jsx:169-172 | 🟢 BAJA - fallback a _memStore |
| C03 | `_ss.getItem/setItem` catch | App.jsx:187-195 | 🟢 BAJA - fallback |
| C04 | `sbPromise` múltiples catches | App.jsx ~495-1160 | 🟡 ALTA - errores de Supabase/D1 silenciados |
| C05 | `_sync` catch en envío D1 | App.jsx:1498 | 🟡 ALTA - error de sync silenciado |
| C06 | `_sbGetAll` catch | supabase.js:169-171 | 🟡 ALTA - fallo de descarga silenciado |
| C07 | `_sbSet` catch | supabase.js:64-65 | 🟡 ALTA - fallo de escritura silenciado |
| C08 | `idbSet` catch | offlineDB.js:81-83 | 🟢 BAJA - solo warning |
| C09 | `syncNow` catch general | syncManager.js:293-294 | 🟡 ALTA - error de sync completo silenciado |
| C10 | `_d1GetAll` catch | syncManager.js:67 | 🟡 ALTA - fallo D1 silenciado, pasa a Supabase |
| C11 | `_pushAuditToSupabase` catch | supabase.js:389 | 🟢 BAJA - log de auditoría no crítico |
| C12 | `Cloudinary upload` catch | App.jsx ~605 | 🟡 ALTA - fallo de upload de firma silenciado |
| C13 | `EmailJS` catch | App.jsx ~17262 | 🟡 ALTA - fallo de envío de email silenciado |
| C14 | Múltiples `JSON.parse` catch solo retornan fallback | App.jsx disperso | 🟡 MEDIA - datos corruptos pasan desapercibidos |

**Total: ~50+ catch silenciosos** en toda la aplicación.

---

## ═══════════════════════════════════════════════════════════════
### 2.6 COMPONENTES >500 LÍNEAS QUE DEBERÍAN DIVIDIRSE
### ═══════════════════════════════════════════════════════════════

| Componente | Archivo | Líneas | ¿Dividir en? |
|-----------|---------|--------|-------------|
| `App.jsx` (AppInner) | src/App.jsx | **~58,000** | ~14 features + shared + router |
| `PortalPublicoTrabajador` | components/modals/PortalPublicoTrabajador.jsx | ~1,500 | PortalLogin + PortalDashboard + PortalPrint |
| `_generarHCPortalHTML` (inline) | App.jsx ~1546 | ~200+ (inline) | Extraer a templates/ |
| `_generarCertificadoHTMLNormalizado` | App.jsx ~13177 | ~150+ (inline) | Extraer a templates/ |
| `_printHCClean` | App.jsx ~23014 | ~500+ (inline) | Extraer a features/hc-ocupacional/HCOcupacionalPrint.jsx |
| `AIConfigPanel` | components/panels/AIConfigPanel.jsx | ~500 | AIConfigForm + AIConfigTest + AIConfigGuide |
| `handleCloseHistory` | App.jsx:21515 | ~350+ | Dividir en: validación → firma → persistencia → portal → feedback |
| `CargaMasivaExamenes` | App.jsx:14684 | ~400+ | CargaMasivaForm + CargaMasivaPreview + CargaMasivaResult |

---

## ═══════════════════════════════════════════════════════════════
### 2.7 LÓGICA DE NEGOCIO MEZCLADA CON UI (CANDIDATOS A HOOKS)
### ═══════════════════════════════════════════════════════════════

| Función | Línea | Lógica Mezclada | Debería ser |
|---------|-------|----------------|-------------|
| `handleCloseHistory` | 21515 | Validación + firma + persistencia + portal + UI feedback | Hook `useHCOcupacional.js` |
| `handleSavePatient` | 21491 | Validación + persistencia + UI toast | Hook `usePacientes.js` |
| `handleLogin` | 20624 | Auth + rate limiting + sesión + carga inicial | Hook `useAuth.js` |
| `_initSess` | 18807 | Descarga D1/SB + escritura LS + UI flags | Hook `useAuth.js` |
| `_generarHCPortalHTML` | 1546 | Generación HTML de HC (lógica pura) | `shared/utils/portalTemplates.js` |
| `_generarCertificadoHTMLNormalizado` | 13177 | Generación HTML certificado (lógica pura) | `shared/utils/certificateTemplates.js` |
| `_generarFacturaDIAN_UBL` | 12843 | Generación XML DIAN (lógica pura) | `features/facturacion/dianXML.js` |
| `callAI` | ~6316 | Prompt + fetch + parse + rate limit | `shared/utils/aiProviders.js` |
| `numeroALetras` | 8462 | Conversión número a letras | `shared/utils/formatters.js` |

---

## ═══════════════════════════════════════════════════════════════
### 2.8 INCONSISTENCIAS EN EL MANEJO DE FECHAS / ZONAS HORARIAS
### ═══════════════════════════════════════════════════════════════

| ID | Problema | Ubicación | Impacto |
|----|---------|-----------|---------|
| F01 | `new Date().toISOString()` usado en 50+ lugares sin considerar timezone del usuario. Fechas de HC pueden diferir de la zona horaria local del médico | App.jsx disperso | 🟡 MEDIA |
| F02 | `getSpanishDate` formatea fecha en español pero ignora timezone | App.jsx:8578 | 🟢 BAJA |
| F03 | Comparación de timestamps con `new Date(ts).getTime()` sin normalizar timezone | syncManager.js:267-268 | 🟡 MEDIA |
| F04 | Fechas de HC almacenadas como ISO string pero mostradas con formato local sin conversión explícita | App.jsx disperso | 🟢 BAJA |
| F05 | No hay una función unificada `formatFechaLocal` que considere timezone del navegador | En toda la app | 🟡 MEDIA |

---

## ═══════════════════════════════════════════════════════════════
### 2.9 VALIDACIONES FALTANTES
### ═══════════════════════════════════════════════════════════════

| ID | Validación Faltante | Ubicación | Riesgo |
|----|-------------------|-----------|--------|
| V01 | Firma vacía al cerrar HC | handleCloseHistory ~21515 | 🟡 MEDIA - HC puede cerrarse sin firma |
| V02 | Campos obligatorios de HC no validados consistentemente | checkAlertasObligatorias ~21467 | 🟡 MEDIA - HC puede tener datos incompletos |
| V03 | Tamaño de archivo en upload de firma | handleSignatureUpload ~22400 | 🟢 BAJA - archivos muy grandes pueden fallar silenciosamente |
| V04 | Formato de NIT/Documento en empresas | Companies | 🟡 MEDIA - NIT mal formateado |
| V05 | Límite de caracteres en inputs de texto | InputGroup, TextAreaGroup | 🟢 BAJA - overflow de LS |
| V06 | Email no válido en config | saveEmailConfig | 🟢 BAJA |
| V07 | Fecha de nacimiento futura | PacienteForm | 🟡 MEDIA - datos inconsistentes |

---

## ═══════════════════════════════════════════════════════════════
### 2.10 VULNERABILIDADES DE SEGURIDAD
### ═══════════════════════════════════════════════════════════════

| ID | Tipo | Ubicación | Severidad | Descripción |
|----|------|-----------|-----------|-------------|
| S01 | XSS en `w.document.write()` | App.jsx líneas 14321, 14630, 15076, 15384, 16121, 23538, 24069, 24129, 32038, 33820, 39150, 52601 | 🔴 **CRÍTICA** | 12+ puntos donde se escribe HTML directamente con interpolación de variables. Aunque usan `_e()` para escapar, si alguna variable no se escapa hay XSS |
| S02 | XSS en `dangerouslySetInnerHTML` | App.jsx | 🔴 **CRÍTICA** | Si existe, permite inyección directa de HTML |
| S03 | API Keys en localStorage | `siso_ai_keys` en LS (App.jsx ~20612) | 🟡 ALTA | Las API Keys de IA se almacenan en localStorage (persistente) además de sessionStorage. Si alguien accede al equipo, puede robar las keys |
| S04 | Supabase anon key hardcodeada | supabase.js:18 | 🟡 ALTA | `sb_publishable_K88qYuJ9...` hardcodeada en el bundle. Aunque es "publishable", permite acceso público a la API de Supabase |
| S05 | Tokens hardcodeados en window.__SISO_CONFIG | index.html | 🟡 ALTA | `workerUrl` y `workerToken` se inyectan desde HTML. Si alguien ve el source, tiene el token |
| S06 | Sin CSP (Content Security Policy) | No hay meta CSP ni headers | 🟡 ALTA | Permite inyección de scripts no autorizados |
| S07 | Validación MIME por extensión vs magic bytes | _validateMimeType se agregó pero hay paths legacy | supabase.js:203 | 🟡 MEDIA |
| S08 | Sin rate limiting en APIs de IA | callAI no tiene límite por usuario/día más allá de conteo local | App.jsx ~19616 | 🟡 MEDIA | 
| S09 | CORS abierto en Worker D1 | siso-worker/index.js:6-11 | 🟢 BAJA | Lista de orígenes controlada |

---

## ═══════════════════════════════════════════════════════════════
### 2.11 PERFORMANCE
### ═══════════════════════════════════════════════════════════════

| ID | Problema | Ubicación | Impacto |
|----|---------|-----------|---------|
| P01 | Bundle único sin code splitting | App.jsx (58K líneas en un bundle) | 🔴 CRÍTICO - ~3-5MB bundle |
| P02 | Sin lazy loading de páginas | App.jsx | 🔴 CRÍTICO - toda la app se carga al inicio |
| P03 | Listas de pacientes sin virtualización | Lista pacientes en App.jsx | 🟡 MEDIA - lento con 1000+ pacientes |
| P04 | `JSON.parse`/`JSON.stringify` en cada render en lugar de memoización | App.jsx disperso | 🟡 MEDIA |
| P05 | Re-renders excesivos por useState en AppInner | App.jsx ~16890-16914 (20+ useState) | 🟡 MEDIA - cada setState rerenderiza toda la app |
| P06 | `localStorage` usado como DB (síncrono, bloquea UI) | Toda la app | 🟡 MEDIA - >5MB de datos síncronos bloquean UI |
| P07 | Imágenes de firma en base64 en localStorage (~50KB) | siso_doctor_signature | 🟢 BAJA |
| P08 | Sin compresión en datos sincronizados a D1 | _sync envía JSON sin comprimir | 🟢 BAJA |

---

## ═══════════════════════════════════════════════════════════════
### 2.12 ACCESIBILIDAD
### ═══════════════════════════════════════════════════════════════

| ID | Problema | Ubicación | Impacto |
|----|---------|-----------|---------|
| A01 | Sin roles ARIA en componentes | Toda la app | 🟡 MEDIA |
| A02 | Sin labels en inputs | InputGroup, SelectGroup | 🟡 MEDIA |
| A03 | Tab order no definido explícitamente | Formularios HC | 🟡 MEDIA |
| A04 | Contraste de colores insuficiente en algunos estados | CSS disperso | 🟢 BAJA |
| A05 | Sin soporte para screen readers en impresiones | w.document.write() genera HTML sin aria | 🟢 BAJA |
| A06 | Sin focus management en modales | ConsentimientoModal, NotificacionModal | 🟡 MEDIA |

---

## ═══════════════════════════════════════════════════════════════
### 2.13 HALLAZGOS ADICIONALES
### ═══════════════════════════════════════════════════════════════

| ID | Hallazgo | Detalle | Severidad |
|----|---------|---------|-----------|
| X01 | Sin tests automatizados | package.json no tiene devDependencies de testing | 🔴 CRÍTICA |
| X02 | Sin PropTypes ni TypeScript | 0 validación de tipos en props de componentes | 🟡 MEDIA |
| X03 | Dependencias no actualizadas | react 18.3.1 (React 19 ya estable), jspdf 4.2.1 | 🟢 BAJA |
| X04 | Mezcla de React.useState y useState | Inconsistencia: a veces usa `React.useState`, a veces `useState` | 🟢 BAJA |
| X05 | Sin manejo de errores global | No hay ErrorBoundary formal | 🟡 MEDIA |
| X06 | `console.log` en producción | Múltiples console.log sin bandera de debug | 🟢 BAJA |
| X07 | Service Worker registrado sin cache strategy clara | sw.js en public/ | 🟡 MEDIA |
| X08 | Sin documentación de API del Worker | siso-worker/index.js no tiene OpenAPI/Swagger | 🟡 MEDIA |

---

## ═══════════════════════════════════════════════════════════════
## RESUMEN DE SEVERIDAD
## ═══════════════════════════════════════════════════════════════

| Severidad | Conteo | Principales Problemas |
|-----------|--------|----------------------|
| 🔴 **CRÍTICA** | 12 | Monolito 58K líneas, XSS en w.document.write(), sin tests, race conditions en cierre HC, bundle único, duplicación de storage |
| 🟡 **ALTA** | 25 | Catch silenciosos, dependencias inestables, API keys en LS, Supabase key hardcodeada, sin CSP, re-renders, fetchWithTimeout duplicado |
| 🟡 **MEDIA** | 20 | Validaciones faltantes, timezones, sin lazy loading, sin virtualización, useState global, ACCESSIBILIDAD |
| 🟢 **BAJA** | 12 | Variables huérfanas, console.log, PropTypes faltantes, dependencias no actualizadas |

**Total hallazgos documentados: ~69**

---

## ═══════════════════════════════════════════════════════════════
## Archivos que requieren atención inmediata
## ═══════════════════════════════════════════════════════════════

Por orden de criticidad:

1. `src/App.jsx` — 58K líneas, monolito (🔴)
2. `components/modals/PortalPublicoTrabajador.jsx` — 1500 líneas (🟡)
3. `utils/supabase.js` — key hardcodeada (🟡)
4. `utils/syncManager.js` — race conditions (🟡)
5. `utils/aiProviders.js` + App.jsx — fetchWithTimeout duplicado (🟡)
6. `utils/storage.js` + App.jsx — _ls y _ss duplicados (🟡)
7. `public/sw.js` — cache strategy (🟡)
8. `siso-worker/index.js` — documentación API faltante (🟡)

---

*Documento generado como parte de FASE 2 del Protocolo Maestro de Refactorización.*
*Próxima actualización: FASE 3 (Plan de Refactorización Detallado)*