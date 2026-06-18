# 🏥 Estado del Refactor SISO OcupaSalud
_Actualizado por el agente al final de cada paso. No editar manualmente._

---

## ⚡ Identificación de Sesión
| Campo | Valor |
|-------|-------|
| **Sprint Activo** | 2 |
| **Paso Actual** | 3 de 9 |
| **Última actualización** | 2026-06-18 13:57 |
| **Sesiones completadas** | 1 |
| **Modo** | 🟢 Sprint 2 — Auth + Router + Usuarios |

---

## 📊 Progreso General

- [x] Sprint 0 — Fusión de bases (7/7 pasos) ✅
- [x] Sprint 1 — D1 Client completo (9/9 pasos) ✅
- [ ] Sprint 2 — Auth + Router + Usuarios (2/9 pasos)
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
- Commit `69fef09`

## ✅ SPRINT 1 — D1 CLIENT COMPLETO — COMPLETADO
- `4896c99` d1Client con merge anti-regresión, auto-chunking, retries, If-Match
- `3e0b9c1` tests d1Client (13/13 ✅)
- `5b4fda2` build verde + fix clinicalStore.jsx

---

## 📋 SPRINT 2 — AUTH + ROUTER + USUARIOS

### Paso 1: ✅ Verificar integración authStore en App.jsx / Layout.jsx
> `App.jsx` importa `useAuthStore`, monta `loginLocal` desde `siso-auth`.
> ProtectedRoute usa `currentUser` para redirigir.

### Paso 2: ✅ Mejoras opcionales en ProtectedRoute
> `loginLocal` ya es función permanente.

### Paso 3: ✅ Conectar useAuth con D1Client para sesiones persistentes
> **Actual:** `authStore.js` importa `d1WriteArrayMerge`.
> `loginLocal` y `logout` sincronizan `siso_auth_sessions` a D1.
> Si D1 falla, fallback a localStorage (no bloquea UI).

### Paso 4: ⬜ Refinar login/logout con refresh token
> `login` ya usa `apiClient.post('/auth/login')`.refreshToken se almacena en estado.

### Paso 5: ⬜ Tests `authStore.test.js` y `ProtectedRoute.test.js`
### Paso 6: ⬜ `npm run build && npm test`
### Paso 7: ⬜ Commit `sprint2: auth router usuarios completo`

---

## 🔧 Notas Técnicas

- `d1WriteArrayMerge` guarda en localStorage SIEMPRE antes de escribir a D1.
- `printService.test.js` (legacy) migrar a vitest en próximos sprints.

## → CONTINUAR AQUÍ
**Sprint:** 2
**Paso pendiente:** Paso 5 — Crear `authStore.test.js` + `ProtectedRoute.test.js`
**Acción exacta:** tests para loginLocal (mock D1), logout, canAccess, canUse, ProtectedRoute (redirect si no auth).