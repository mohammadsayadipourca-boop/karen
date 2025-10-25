"use client";
/* EN: Central Zustand store for karen editor
   FA: استور مرکزی وضعیت برای ادیتور کارن */
import { create } from "zustand";

export type Side = "front" | "back";

export interface EditorState {
  side: Side; setSide: (s: Side) => void;

  zoom: number; setZoom: (z: number | ((z:number)=>number)) => void;

  showGrid: boolean; snapEnabled: boolean; snapSize: number;
  setShowGrid: (v: boolean) => void; setSnapEnabled: (v: boolean) => void; setSnapSize: (n: number) => void;

  units: "mm"|"inch"|"px"; dpi: number;
  setUnits: (u: "mm"|"inch"|"px") => void; setDpi: (d: number) => void;

  width: number; height: number; cornerRadius: number;
  setSize: (w: number, h: number) => void; setCornerRadius: (r: number) => void;

  requestClearSide: boolean; requestClearBoth: boolean;
  setRequestClearSide: (v: boolean) => void; setRequestClearBoth: (v: boolean) => void;

  panels: Record<string, boolean>;
  setPanel: (k: string, v?: boolean) => void;
  closeAllPanels: () => void;
}

// Named export ✅
export const useEditor = create<EditorState>((set) => ({
  side: "front", setSide: (s) => set({ side: s }),

  zoom: 1,
  setZoom: (z) => set((st:any)=>({
    zoom: typeof z === "function" ? (z as any)(st.zoom) : Math.min(8, Math.max(0.1, z))
  })),

  showGrid: true, snapEnabled: true, snapSize: 8,
  setShowGrid: (v) => set({ showGrid: v }),
  setSnapEnabled: (v) => set({ snapEnabled: v }),
  setSnapSize: (n) => set({ snapSize: Math.max(1, Math.min(64, n)) }),

  units: "inch", dpi: 300,
  setUnits: (u) => set({ units: u }),
  setDpi: (d) => set({ dpi: Math.max(72, Math.min(1200, d)) }),

  width: 3.5, height: 2, cornerRadius: 0.125,
  setSize: (w, h) => set({ width: w, height: h }),
  setCornerRadius: (r) => set({ cornerRadius: Math.max(0, r) }),

  requestClearSide: false, requestClearBoth: false,
  setRequestClearSide: (v) => set({ requestClearSide: v }),
  setRequestClearBoth: (v) => set({ requestClearBoth: v }),

  panels: { imageSetting:true, move:false, properties:true, layers:true, image:false, text:false, shape:false, qr:false, export:false, import:false },
  setPanel: (k, v) => set((s)=>({ panels: { ...s.panels, [k]: v ?? !s.panels[k] } })),
  closeAllPanels: () => set({ panels: { imageSetting:false, move:false, properties:false, layers:false, image:false, text:false, shape:false, qr:false, export:false, import:false }}),
  togglePanel: (key: keyof EditorState["panels"]) =>
    set((s) => ({
      panels: { ...s.panels, [key]: !s.panels[key] },
    })),

      // --- guides (bleed & safe) ---
  bleedEnabled: true,
  bleedAmount: 0.25,     // در واحد جاری (default: 0.25 in)
  safeEnabled: true,
  safeAmount: 0.125,     // فاصله از خط trim به داخل
  
      // داخل create(...)
  rulerOffsetX: 0,
  rulerOffsetY: 0,
  // (اختیاری) اکشن اگر می‌خواهی:
  setRulerOffset: (x: number, y: number) => set({ rulerOffsetX: x, rulerOffsetY: y }),

}));
