// src/component/editor/utils/panelStorage.ts
// EN: LocalStorage helper for floating panels (position/size/open)
// FA: یوتیل ذخیره‌سازی محلی برای پنل‌های شناور (مختصات/اندازه/بازبودن)

export type PanelKey =
  | "imageSetting" | "move" | "properties" | "layers"
  | "image" | "text" | "shape" | "qr" | "export" | "import";

type Rect = { x: number; y: number; w: number; h: number };
type Layout = {
  open: Partial<Record<PanelKey, boolean>>;
  rects: Partial<Record<PanelKey, Rect>>;
  version: number;
};

const STORAGE_KEY = "karen.panel.layout.v1";
const isClient = typeof window !== "undefined";

function getViewport() {
  // EN: SSR-safe fallback viewport
  // FA: ویوپورت پیش‌فرض در SSR
  if (!isClient) return { vw: 1280, vh: 800 };
  return { vw: window.innerWidth, vh: window.innerHeight };
}

// EN: Safe read/write — SSR guarded
function read(): Layout {
  if (!isClient) return { open: {}, rects: {}, version: 1 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { open: {}, rects: {}, version: 1 };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { open: {}, rects: {}, version: 1 };
    return {
      open: parsed.open ?? {},
      rects: parsed.rects ?? {},
      version: 1,
    };
  } catch {
    return { open: {}, rects: {}, version: 1 };
  }
}

function write(next: Layout) {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function update(partial: Partial<Layout>) {
  const cur = read();
  write({ ...cur, ...partial, version: 1 });
}

// EN: Clamp rect to viewport with margin | FA: محدودکردن با حاشیه
export function clampRectToViewport(rect: Rect, margin = 12): Rect {
  const { vw, vh } = getViewport();
  const w = Math.min(rect.w, Math.max(250, vw - margin * 2));
  const h = Math.min(rect.h, Math.max(200, vh - margin * 2));
  let x = rect.x;
  let y = rect.y;
  x = Math.max(margin, Math.min(x, vw - w - margin));
  y = Math.max(margin + 48 /* toolbar approx */, Math.min(y, vh - h - margin));
  return { x, y, w, h };
}

export const panelStorage = {
  // EN: open-state
  loadOpen(): Partial<Record<PanelKey, boolean>> {
    return read().open;
  },
  saveOpen(map: Partial<Record<PanelKey, boolean>>) {
    update({ open: { ...read().open, ...map } });
  },
  saveOpenFor(key: PanelKey, open: boolean) {
    const cur = read().open;
    cur[key] = open;
    update({ open: cur });
  },

  // EN: rects
  loadRect(key: PanelKey): Rect | null {
    const r = read().rects[key];
    if (!r) return null;
    return clampRectToViewport(r);
  },
  saveRect(key: PanelKey, rect: Rect) {
    const rects = { ...read().rects, [key]: clampRectToViewport(rect) };
    update({ rects });
  },
};
