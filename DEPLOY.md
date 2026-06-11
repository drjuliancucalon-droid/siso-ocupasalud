# SISO OcupaSalud — Guía de GitHub y Despliegue

## 1. Configurar variables de entorno

Copia `.env.example` como `.env` y rellena tus credenciales:

```
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

> **Nunca subas `.env` a GitHub** — ya está en `.gitignore`.

---

## 2. Subir a GitHub

### Primera vez (repo nuevo)

```bash
# En la carpeta del proyecto:
cd "C:\Users\JQK3\Desktop\refactorizacion total"

# 1. Crear el repo en github.com (sin inicializar con README)
#    Luego conectar el remoto:
git remote add origin https://github.com/TU_USUARIO/siso-ocupasalud.git

# 2. Subir
git push -u origin master
```

### Siguientes cambios

```bash
git add -A
git commit -m "descripcion del cambio"
git push
```

> **Nota sobre index.lock:** Si aparece el error `fatal: Unable to create '.git/index.lock'`,
> borra manualmente el archivo `C:\Users\JQK3\Desktop\refactorizacion total\.git\index.lock`
> desde el Explorador de archivos o con PowerShell:
> ```powershell
> Remove-Item "C:\Users\JQK3\Desktop\refactorizacion total\.git\index.lock"
> ```

---

## 3. Instalar dependencias y compilar

Ejecuta esto en una terminal de Windows (CMD, PowerShell o Git Bash) desde la carpeta del proyecto:

```bash
cd "C:\Users\JQK3\Desktop\refactorizacion total"
npm install
npm run build
```

Esto genera la carpeta `dist/` lista para desplegar.

---

## 4. Despliegue — Opción A: Cloudflare Pages (recomendado)

### 4a. Worker D1 (backend)

```bash
# Instalar Wrangler si no lo tienes:
npm install -g wrangler

cd "C:\Users\JQK3\Desktop\refactorizacion total\siso-worker"

# Autenticarse en Cloudflare:
wrangler login

# Crear la base de datos D1 (solo la primera vez):
wrangler d1 create siso-db

# Copiar el database_id que devuelve el comando al wrangler.json

# Aplicar el schema:
wrangler d1 execute siso-db --file=schema.sql

# Desplegar el Worker:
wrangler deploy
```

### 4b. Frontend en Cloudflare Pages

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project
2. Conectar con el repositorio de GitHub
3. Configurar el build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. En **Environment variables**, agregar:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key
5. Desplegar

---

## 5. Despliegue — Opción B: Manual (drag & drop)

```bash
npm run build
```

Luego arrastra la carpeta `dist/` a [Cloudflare Pages](https://pages.cloudflare.com) o a cualquier hosting estático (Netlify, Vercel, etc.).

---

## 6. Configurar `window.__SISO_CONFIG` en producción (opcional)

Si prefieres no usar variables de entorno de Vite, puedes inyectar la config en el `index.html` antes del `</head>`:

```html
<script>
  window.__SISO_CONFIG = {
    sbUrl: "https://TU_PROYECTO.supabase.co",
    sbKey: "tu_anon_key",
    workerUrl: "https://siso-api.TU_USUARIO.workers.dev"
  };
</script>
```

---

## 7. Ejecutar tests

```bash
npm test
```

Resultado esperado: **51/51 tests pasando**.

---

## Resumen del estado actual

| Item | Estado |
|------|--------|
| Commit en master | ✅ `72e22b8` |
| Secrets removidos | ✅ Movidos a `VITE_*` |
| `.gitignore` actualizado | ✅ |
| `.env.example` creado | ✅ |
| 147/147 funciones migradas | ✅ |
| 51/51 tests | ✅ |
| Listo para `git push` | ✅ |
