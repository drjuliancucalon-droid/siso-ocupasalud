# ═══════════════════════════════════════════════════════════════
# PLAN DE REFACTORIZACIÓN — SISO OcupaSalud
# FASE 3: Plan Detallado
# Versión: 1.0 | Fecha: 2026-06-11
# ═══════════════════════════════════════════════════════════════

## ═══════════════════════════════════════════════════════════════
## 1. OBJETIVO GENERAL
## ═══════════════════════════════════════════════════════════════

Convertir el monolito `src/App.jsx` (~58,000 líneas) en una arquitectura
modular basada en features, con separación clara de responsabilidades,
manteniendo 100% de retrocompatibilidad funcional y de datos.

## ═══════════════════════════════════════════════════════════════
## 2. CRITERIOS DE ÉXITO
## ═══════════════════════════════════════════════════════════════

1. App.jsx pasa de ~58,000 líneas a <500 líneas (solo router + composición)
2. Cada archivo < 300 líneas de código
3. 100% de funcionalidad existente preservada
4. Build exitoso después de cada etapa
5. Tests unitarios para shared/utils/* + tests de integración para storage
6. Sin pérdida de datos en D1 ni localStorage
7. Sin cambios visuales en UI

## ═══════════════════════════════════════════════════════════════
## 3. ESTRATEGIA DE MIGRACIÓN
## ═══════════════════════════════════════════════════════════════

### Principios:
1. **Extraer, no reescribir**: Cada función se mueve a su nuevo archivo SIN cambiar su lógica interna
2. **Importar, no duplicar**: Las funciones extraídas se importan en App.jsx mientras dure la transición
3. **Un PR por etapa**: Cada etapa es un cambio atómico verificable
4. **Snapshot antes de cada etapa**: Scripts/snapshot.mjs guarda estado D1 pre-cambio
5. **Rollback plan**: git tag pre-etapa, git checkout si falla

### Orden de migración:
De menor a mayor riesgo:
1. Utils puras (sin efectos secundarios)
2. Capa de almacenamiento (ya existe parcialmente en utils/)
3. Features sin estado global (Dashboard, Caja)
4. Features con estado (Pacientes, Auth)
5. Features críticas (HC Ocupacional, Portal)
6. Router final (App.jsx slim)

## ═══════════════════════════════════════════════════════════════
## 4. ESTRUCTURA DE CARPETAS DESTINO
## ═══════════════════════════════════════════════════════════════

```
C:\Users\JQK3\Desktop\refactorizacion total\src\
├── features/
│   ├── auth/           → Autenticación, usuarios, roles, sesión
│   ├── pacientes/      → CRUD pacientes, búsqueda, historial
│   ├── hc-ocupacional/ → HC Ocupacional (form, print, close)
│   ├── hc-general/     → HC General
│   ├── portal-empresa/ → Portal empresa, certificados, dashboard
│   ├── facturacion/    → Cuentas de cobro, DIAN
│   ├── informes/       → Informes periódicos
│   ├── agenda/         → Agenda médica
│   ├── dashboard/      → Dashboard y estadísticas
│   ├── caja/           → Caja menor
│   ├── custodia/       → Cartas de custodia
│   ├── contabilidad/   → Contabilidad V2
│   └── encuestas/      → Encuestas sociodemográficas
├── shared/
│   ├── storage/        → localStorage, sessionStorage, supabase, D1, IndexedDB
│   ├── sync/           → syncManager, syncQueue, syncAudit
│   ├── hooks/          → Hooks reutilizables
│   ├── components/     → UI atómica (ui/, ai/, layout/)
│   └── utils/          → Lógica pura (formatters, validators, sanitize, etc.)
├── pages/              → Rutas slim
├── App.jsx             → Solo router + composición
├── AppInner.jsx        → Inner app state (temporal, se disuelve en features)
└── main.jsx            → Entry point (sin cambios)
```

## ═══════════════════════════════════════════════════════════════
## 5. MAPA DE MIGRACIÓN DETALLADO
## ═══════════════════════════════════════════════════════════════

### 5.1 Funciones Puras → shared/utils/

| Función Actual | Archivo Destino | Línea Origen | Tipo |
|---------------|----------------|-------------|------|
| `sanitizeInput` | `shared/utils/sanitize.js` | App.jsx:77 | Escape HTML |
| `_sanitize` | `shared/utils/sanitize.js` | App.jsx:2148 | Trim |
| `validatePasswordStrength` | `shared/utils/validators.js` | App.jsx:90 | Validación |
| `analyzeBP` | `shared/utils/validators.js` | App.jsx:8542 | Análisis clínico |
| `analyzeHR` | `shared/utils/validators.js` | App.jsx:8558 | Análisis clínico |
| `analyzeBMI` | `shared/utils/validators.js` | App.jsx:8566 | Análisis clínico |
| `_validarContrasena` | `shared/utils/validators.js` | App.jsx:9134 | Validación |
| `numeroALetras` | `shared/utils/formatters.js` | App.jsx:8462 | Formateo |
| `getSpanishDate` | `shared/utils/formatters.js` | App.jsx:8578 | Formateo |
| `_auditLog` | `shared/utils/security.js` | App.jsx:100 | Auditoría |
| `_rl` | `shared/utils/security.js` | App.jsx:117 | Rate limiting |
| `_sisoStableOrigin` | `shared/utils/constants.js` | App.jsx:283 | Constante |
| `_hash64` | `shared/utils/hashHelpers.js` | App.jsx:337 | Hashing |
| `_equivalenciaCIE11` | `shared/utils/normativa.js` | App.jsx:7278 | Normativa |
| `_generarCodigoQR` | `shared/utils/fhir.js` | App.jsx:6758 | QR |
| `_formatFirmaDigital` | `shared/utils/fhir.js` | App.jsx:6766 | Firma |
| `_generarFHIRPatient` | `shared/utils/fhir.js` | App.jsx:6789 | FHIR |
| `_generarFHIRPractitioner` | `shared/utils/fhir.js` | App.jsx:6830 | FHIR |
| `_generarFHIRObservation` | `shared/utils/fhir.js` | App.jsx:6865 | FHIR |
| `_generarFHIRBundle` | `shared/utils/fhir.js` | App.jsx:6900 | FHIR |
| `validarRIPSPaciente` | `shared/utils/fhir.js` | App.jsx:6935 | RIPS |
| `validarRIPSLote` | `shared/utils/fhir.js` | App.jsx:6944 | RIPS |
| `_generarRIPSJson` | `shared/utils/fhir.js` | App.jsx:6955 | RIPS |
| `_descargarRIPSJson` | `shared/utils/fhir.js` | App.jsx:7040 | RIPS |
| `_generarRDA` | `shared/utils/fhir.js` | App.jsx:7064 | RDA |
| `_descargarRDA` | `shared/utils/fhir.js` | App.jsx:7115 | RDA |
| `parseAIJSON` | `shared/utils/aiProviders.js` | App.jsx:6635 | IA |
| `fetchWithTimeout` | `shared/utils/aiProviders.js` | App.jsx:6315 | IA |
| `callAI` | `shared/utils/aiProviders.js` | App.jsx:6316 | IA |
| `_generarHCPortalHTML` | `shared/utils/portalTemplates.js` | App.jsx:1546 | Templates |
| `_generarCertificadoHTMLNormalizado` | `shared/utils/certificateTemplates.js` | App.jsx:13177 | Templates |
| `_generarFacturaDIAN_UBL` | `shared/utils/dianXML.js` | App.jsx:12843 | DIAN |
| `_generarEmailHTML` | `shared/utils/emailTemplates.js` | App.jsx:17262 | Email |

### 5.2 Almacenamiento → shared/storage/

| Función Actual | Archivo Destino | Notas |
|---------------|----------------|-------|
| `_ls` (App.jsx:158) | `shared/storage/localStorage.js` | Eliminar duplicado de App.jsx |
| `_ss` (App.jsx:183) | `shared/storage/sessionStorage.js` | Eliminar duplicado de App.jsx |
| `sp`, `sps` | `shared/storage/localStorage.js` | Ya existen en utils/storage.js |
| Supabase functions | `shared/storage/supabaseClient.js` | Unificar con utils/supabase.js |
| Supabase Storage | `shared/storage/supabaseStorage.js` | Extraer de utils/supabase.js |
| D1 functions | `shared/storage/d1Client.js` | Extraer de syncManager.js |
| Storage keys | `shared/storage/storageKeys.js` | Nuevo: todas las constantes |
| Cloudinary | `shared/storage/cloudinaryClient.js` | Extraer de App.jsx |

### 5.3 Componentes UI → shared/components/

| Componente Actual | Archivo Destino | 
|------------------|----------------|
| InputGroup | `shared/components/ui/InputGroup.jsx` |
| SelectGroup | `shared/components/ui/SelectGroup.jsx` |
| TextAreaGroup | `shared/components/ui/TextAreaGroup.jsx` |
| SectionTitle | `shared/components/ui/SectionTitle.jsx` |
| BrandLogo | `shared/components/ui/BrandLogo.jsx` |
| DoctorSignature | `shared/components/ui/DoctorSignature.jsx` |
| CIE10Input | `shared/components/ui/CIE10Input.jsx` |
| CUPSInput | `shared/components/ui/CUPSInput.jsx` |
| MedicamentoAutocomplete | `shared/components/ui/MedicamentoAutocomplete.jsx` |
| FortalezaPass | `shared/components/ui/FortalezaPass.jsx` |
| NotificacionModal | `shared/components/ui/NotificacionModal.jsx` |
| ConsentimientoModal | `shared/components/ui/ConsentimientoModal.jsx` |
| PrivacyModal | `shared/components/ui/PrivacyModal.jsx` |
| PlanGate | `shared/components/ui/PlanGate.jsx` |
| BrandLogo | `shared/components/ui/BrandLogo.jsx` |
| AIConfigPanel | `shared/components/ai/AIConfigPanel.jsx` |
| Navbar | `shared/components/layout/Navbar.jsx` |
| MainLayout | `shared/components/layout/MainLayout.jsx` |
| AuthGuard | `shared/components/layout/AuthGuard.jsx` |
| AlertDialog | `shared/components/ui/AlertDialog.jsx` |
| LoadingSpinner | `shared/components/ui/LoadingSpinner.jsx` |

### 5.4 Lógica de Features → features/

| Feature | Archivos a crear | Funciones de App.jsx |
|---------|-----------------|---------------------|
| **Auth** | `features/auth/LoginForm.jsx`<br/>`features/auth/UsersPage.jsx`<br/>`features/auth/ChangePasswordForm.jsx`<br/>`features/auth/useAuth.js` | `LoginForm`, `RecuperarAcceso`, `ChangePasswordForm`, `handleLogin`, `handleLogout`, `handleSaveAIConfig`, `_initSess`, `sessionUser`, `_isAdmin`, `_canUse`, `_secretariaPuede`, |
| **Pacientes** | `features/pacientes/PacientesPage.jsx`<br/>`features/pacientes/usePacientes.js` | `handleSavePatient`, `handleDeletePatient`, `handleExportData`, `_syncPatients`, `_slimPatient`, `_stripBase64Deep`, `canViewPatient`, `isHcOwner`, `openPatient`, `_detectarCedulas`, `CargaMasivaExamenes` |
| **HC Ocupacional** | `features/hc-ocupacional/HCOcupacionalForm.jsx`<br/>`features/hc-ocupacional/sections/` (6 archivos)<br/>`features/hc-ocupacional/HCOcupacionalPrint.jsx`<br/>`features/hc-ocupacional/HCOcupacionalClose.jsx`<br/>`features/hc-ocupacional/useHCOcupacional.js` | `handleNewOccupHistory`, `handleCloseHistory`, `handleEditHistory`, `_printHCClean`, `checkAlertasObligatorias`, `RestriccionesChecklistPanel`, `RecomendacionesChecklistPanel`, `TabFormulaDerivacion` |
| **HC General** | `features/hc-general/HCGeneralForm.jsx`<br/>`features/hc-general/HCGeneralPrint.jsx`<br/>`features/hc-general/useHCGeneral.js` | `handleNewGeneralHistory` |
| **Portal Empresa** | `features/portal-empresa/PortalEmpresa.jsx`<br/>`features/portal-empresa/PortalLogin.jsx`<br/>`features/portal-empresa/PortalDashboard.jsx`<br/>`features/portal-empresa/PortalCertificados.jsx`<br/>`features/portal-empresa/PortalCuentasCobro.jsx`<br/>`features/portal-empresa/PortalCustodia.jsx`<br/>`features/portal-empresa/PortalInformes.jsx`<br/>`features/portal-empresa/usePortal.js` | `PortalPublicoTrabajador`, `PortalCustodiaViewer`, `PortalCuentaCobroCard`, `PortalInformeViewer`, `PortalEmpresaDocsPeriodos`, `EncuestaPublicaForm` |
| **Facturación** | `features/facturacion/BillPage.jsx`<br/>`features/facturacion/BillForm.jsx`<br/>`features/facturacion/BillPrint.jsx`<br/>`features/facturacion/BillDIAN.jsx`<br/>`features/facturacion/useBills.js` | `BillDoc`, `_getAllBillAtenciones`, `_getBillAtencionesFiltradas`, `_getBillTrabajadores`, `_getBillTotalSeleccionado` |
| **Informes** | `features/informes/InformePage.jsx`<br/>`features/informes/InformeForm.jsx`<br/>`features/informes/InformePrint.jsx`<br/>`features/informes/useInformes.js` | `_allInformes`, `exportPatientTable`, `StatBar` |
| **Dashboard** | `features/dashboard/DashboardPage.jsx`<br/>`features/dashboard/useDashboard.js` | `_contarHC`, stats aggregators |
| **Agenda** | `features/agenda/AgendaPage.jsx`<br/>`features/agenda/AgendaCalendar.jsx`<br/>`features/agenda/AgendaForm.jsx`<br/>`features/agenda/useAgenda.js` | `AgendaFieldF` |
| **Caja** | `features/caja/CajaPage.jsx`<br/>`features/caja/useCaja.js` | `_v2MarcarCajaMovCobrado`, `_v2VincularCajaMov` |
| **Custodia** | `features/custodia/CustodiaPage.jsx`<br/>`features/custodia/CustodiaForm.jsx`<br/>`features/custodia/CustodiaPrint.jsx`<br/>`features/custodia/useCustodia.js` | `_allCustodias`, `CartaCustodia` |
| **Contabilidad** | `features/contabilidad/ContabilidadPage.jsx`<br/>`features/contabilidad/useContabilidad.js` | `_allBills` (shared con facturacion) |
| **Encuestas** | `features/encuestas/EncuestaPage.jsx`<br/>`features/encuestas/EncuestaForm.jsx`<br/>`features/encuestas/useEncuestas.js` | `EncuestaPublicaForm` |

## ═══════════════════════════════════════════════════════════════
## 6. ORDEN DE EJECUCIÓN POR ETAPAS
## ═══════════════════════════════════════════════════════════════

```
ETAPA A (S - 1 día)    → Utils puras + constantes
ETAPA B (M - 2 días)   → Capa de almacenamiento
ETAPA C (M - 2 días)   → Feature: Pacientes
ETAPA D (XL - 5 días)  → Feature: HC Ocupacional
ETAPA E (L - 3 días)   → Feature: HC General
ETAPA F (L - 3 días)   → Feature: Portal Empresa
ETAPA G (M - 2 días)   → Feature: Auth + Usuarios
ETAPA H (S - 1 día)    → Feature: Dashboard
ETAPA I (M - 2 días)   → Feature: Facturación
ETAPA J (M - 2 días)   → Feature: Informes
ETAPA K (S - 1 día)    → Feature: Agenda
ETAPA L (S - 2 días)   → Features: Caja + Custodia + Contabilidad
ETAPA M (M - 2 días)   → Router + App.jsx slim
ETAPA N (M - 3 días)   → Tests + Documentación final
```

**Total estimado: ~30 días hábiles**

## ═══════════════════════════════════════════════════════════════
## 7. ESTRATEGIA DE TESTING POR ETAPA
## ═══════════════════════════════════════════════════════════════

### 7.1 Tests Unitarios (Etapas A-B)
- `shared/utils/sanitize.test.js`
- `shared/utils/validators.test.js`
- `shared/utils/formatters.test.js`
- `shared/utils/security.test.js`
- `shared/storage/localStorage.test.js`

### 7.2 Tests de Integración (Etapas C-L)
- `features/pacientes/usePacientes.test.js`
- `features/hc-ocupacional/useHCOcupacional.test.js`
- `features/auth/useAuth.test.js`
- `features/facturacion/useBills.test.js`

### 7.3 Tests E2E (Etapa N)
- Login → crear paciente → llenar HC → cerrar HC → verificar D1
- Portal empresa: login → ver certificados
- Portal trabajador: buscar por código → descargar certificado

## ═══════════════════════════════════════════════════════════════
## 8. PLAN DE ROLLBACK
## ═══════════════════════════════════════════════════════════════

```bash
# Antes de cada etapa:
git tag pre-etapa-X-YYYYMMDD
node scripts/snapshot.mjs  # Snapshot D1

# Si la etapa falla:
git checkout -- .
node scripts/restore-from-snapshot.mjs  # Restaurar D1
git checkout pre-etapa-X-YYYYMMDD

# Si la etapa pasa:
git add .
git commit -m "refactor(etapa-X): descripción"
git tag post-etapa-X-YYYYMMDD
```

---

*Documento generado como parte de FASE 3 del Protocolo Maestro de Refactorización.*
*Próxima actualización: Arquitectura Objetivo + Documentos de ETAPAS*