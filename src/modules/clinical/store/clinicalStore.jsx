// ═══════════════════════════════════════════════════════════════
// ClinicalStore — Estado global de Historia Clínica (Zustand)
// ═══════════════════════════════════════════════════════════════
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClinicalStore = create(
  persist(
    (set, get) => ({
      // ── Estado actual ───────────────────────────────────────
      hcActiva: null,           // Historia clínica abierta
      pestañaActiva: 'general', // 'general' | 'ocupacional' | 'adjuntos'
      cargando: false,
      error: null,

      // ── Acciones ───────────────────────────────────────────
      abrirHC: (hc) => set({ hcActiva: hc, pestañaActiva: 'general', error: null }),
      cerrarHC: () => set({ hcActiva: null }),
      cambiarPestaña: (p) => set({ pestañaActiva: p }),
      setCargando: (c) => set({ cargando: c }),
      setError: (e) => set({ error: e }),

      // ── Helpers ─────────────────────────────────────────────
      getHC: () => get().hcActiva,
      getPestana: () => get().pestañaActiva,
      isCargando: () => get().cargando,
    }),
    {
      name: 'siso_clinical_store',
      partialize: (state) => ({ hcActiva: state.hcActiva }),
    }
  )
);

export default useClinicalStore;