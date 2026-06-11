# ═══════════════════════════════════════════════════════════════
# ETAPA B — Extracción de Capa de Almacenamiento
# Esfuerzo: M (2 días) | Riesgo: 🟡 MEDIO
# ═══════════════════════════════════════════════════════════════

## Objetivo
Extraer la capa de almacenamiento desde App.jsx y utils/ hacia `shared/storage/`, eliminando duplicación de `_ls`, `_ss`.

## Checklist de Archivos a Crear/Modificar

| Archivo | Acción | Contenido |
|---------|--------|-----------|
| shared/storage/localStorage.js | CREAR | `_ls`, `sp`, `sps` (desde App.jsx + utils/storage.js unificados) |
| shared/storage/sessionStorage.js | CREAR | `_ss` (desde App.jsx + utils/storage.js unificados) |
| shared/storage/supabaseClient.js | CREAR | `_securePost`, `_sbSet`, `_sbGetAll`, `_sbDelete`, `marcarAgendaVisto`, `syncArrayToSupabase`, `readArrayFromSupabase` |
| shared/storage/supabaseStorage.js | CREAR | `_sbStorageUpload`, `_sbStorageGetSignedUrl`, `_sbStorageDelete`, `_validateMimeType` |
| shared/storage/d1Client.js | CREAR | `_d1GetAll`, `_d1Get`, `_sync` (desde syncManager.js + App.jsx) |
| shared/storage/cloudinaryClient.js | CREAR | Upload a Cloudinary (desde App.jsx) |
| shared/storage/storageKeys.js | ACTUALIZAR | Agregar claves de LS, SS, D1, IDB |
| utils/storage.js | ELIMINAR | Ya no necesario, reemplazado por shared/storage/ |
| src/App.jsx | MODIFICAR | Eliminar definiciones inline de _ls, _ss (L158-205) |

## Cambios en App.jsx
1. **ELIMINAR** MÓDULO 0 (L72-226): `_memStore`, `_ls`, `_ss`, `sp`, `sps`
2. **AGREGAR** `import { _ls, sp, sps } from './shared/storage/localStorage'`
3. **AGREGAR** `import { _ss } from './shared/storage/sessionStorage'`
4. **ACTUALIZAR** `_sync` → importar desde shared/storage/d1Client.js

## Cambios en syncManager.js y supabase.js
1. Cambiar imports de `'./storage.js'` a `'../shared/storage/localStorage.js'`

## Tests Obligatorios
- `shared/storage/localStorage.test.js`: mockear localStorage, testear set/get/remove/fallback
- `shared/storage/supabaseClient.test.js`: mockear fetch, testear CRUD
- `shared/storage/d1Client.test.js`: mockear fetch, testear sync

## Criterios de Aceptación
- [ ] Build exitoso
- [ ] `import { _ls } from './shared/storage/localStorage'` funciona en App.jsx
- [ ] syncManager.js importa correctamente desde shared/storage/
- [ ] supabase.js importa correctamente desde shared/storage/
- [ ] utils/storage.js eliminado
- [ ] App.jsx eliminó ~100 líneas
- [ ] Tests pasan

## Rollback Plan
```bash
git tag pre-etapa-B-YYYYMMDD
scripts/snapshot.mjs  # Snapshot D1
# Si falla: git checkout -- . && restore snapshot
# Si pasa: git commit -m "refactor(etapa-B): extraer capa de almacenamiento"