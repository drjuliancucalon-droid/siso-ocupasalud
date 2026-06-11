# SISO OcupaSalud — Sistema de Salud Ocupacional

Sistema completo de Historia Clínica Ocupacional, Agenda Médica, Facturación, Portal Empresa y Gestión de Pacientes.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite 6 + Tailwind CSS (CDN)
- **Backend**: Cloudflare Workers (D1 Database) + Supabase (legacy)
- **PWA**: Service Worker offline-first + Background Sync
- **Testing**: Vitest + React Testing Library
- **Despliegue**: Cloudflare Pages + Workers

## 📁 Estructura del Proyecto

```
ocupasalud/
├── public/                 # Assets estáticos + PWA
│   ├── _headers           # Headers de seguridad (Cloudflare Pages)
│   ├── _redirects         # SPA routing
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # App principal (198 líneas)
│   ├── features/          # Módulos por dominio
│   │   ├── auth/          # Autenticación + Login
│   │   ├── pacientes/     # Gestión pacientes
│   │   ├── hc-ocupacional/# Historia Clínica Ocupacional
│   │   ├── hc-general/    # Historia Clínica General
│   │   ├── dashboard/     # Dashboard + métricas
│   │   ├── facturacion/   # Facturación + RIPS
│   │   ├── informes/      # Informes médicos
│   │   ├── agenda/        # Agenda médica
│   │   ├── caja/          # Caja / pagos
│   │   ├── custodia/      # Custodia documentos
│   │   ├── contabilidad/  # Contabilidad
│   │   ├── encuestas/     # Encuestas satisfacción
│   │   └── portal-empresa/# Portal empresa/trabajador
│   ├── shared/
│   │   ├── components/    # UI reutilizable + AI
│   │   ├── storage/       # localStorage, sessionStorage, D1, Supabase
│   │   └── utils/         # sanitize, validators, formatters, security, fhir
│   └── test/              # Setup de tests
├── siso-worker/           # Cloudflare Worker (API D1)
│   ├── index.js           # Worker principal
│   ├── wrangler.json      # Configuración Worker
│   └── schema.sql         # Schema D1
├── docs/                  # Documentación completa
│   ├── AUDITORIA_FINAL_100.md
│   ├── DIAGNOSTICO.md
│   ├── PLAN_REFACTOR.md
│   ├── ARQUITECTURA_OBJETIVO.md
│   └── ETAPAS/
└── package.json
```

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev          # Vite dev server (puerto 5173)
npm run start        # Vite en puerto 3000

# Build
npm run build        # Build producción → dist/
npm run preview      # Preview build local

# Tests
npm run test         # Ejecutar tests (51 tests)
npm run test:watch   # Tests en modo watch

# Despliegue Worker
cd siso-worker
wrangler deploy      # Desplegar a Cloudflare Workers
wrangler d1 execute siso-db --file=schema.sql  # Inicializar D1
```

## 🔐 Variables de Entorno

Crear `.env` en la raíz (no commitear):

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_SISO_TOKEN=xxx
```

Para Worker (Cloudflare Dashboard → Workers → Variables):
- `SISO_TOKEN` = token compartido

## 📦 Despliegue Completo

### 1. Frontend (Cloudflare Pages)
```bash
npm run build
# Conectar repo a Cloudflare Pages
# Build command: npm run build
# Output directory: dist
```

### 2. Backend (Cloudflare Workers)
```bash
cd siso-worker
wrangler deploy
# Configurar D1 database en Cloudflare Dashboard
# Ejecutar schema.sql en D1 Console
```

### 3. Configurar DNS
- `ocupasaludparadesplegar.pages.dev` → Pages
- `api.ocupasaludparadesplegar.pages.dev` → Worker (custom domain)

## ✅ Estado Actual

| Métrica | Valor |
|---------|-------|
| **App.jsx** | 198 líneas (era 58,000) |
| **Módulos** | 72 archivos |
| **Funciones migradas** | 147/147 (100%) |
| **Tests** | 51/51 pasando |
| **Cobertura** | 100% |
| **Duplicados** | 0 |

## 📚 Documentación

- `docs/AUDITORIA_FINAL_100.md` — Auditoría completa 100%
- `docs/DIAGNOSTICO.md` — Diagnóstico inicial
- `docs/PLAN_REFACTOR.md` — Plan de refactorización
- `docs/ARQUITECTURA_OBJETIVO.md` — Arquitectura objetivo
- `docs/ETAPAS/` — Etapas A-N documentadas

## 🏥 Funcionalidades Principales

- **Historia Clínica Ocupacional** (ingreso, periódico, retiro, altura, ruido, etc.)
- **Historia Clínica General** (consulta, evolución, receta, ordenes)
- **Gestión de Pacientes** (CRUD, carga masiva, búsqueda)
- **Agenda Médica** (citas, disponibilidad, recordatorios)
- **Facturación** (cuentas de cobro, RIPS, RDA)
- **Portal Empresa** (documentos, certificados, trabajadores)
- **Portal Trabajador** (consulta pública, encuestas)
- **Custodia Documental** (firmas, PDF, versionado)
- **Dashboard** (KPIs, métricas, alertas)
- **PWA Offline** (Service Worker, Background Sync)
- **FHIR/RIPS/RDA** (interoperabilidad)

## 📄 Licencia

Privado — OcupaSalud / SISO