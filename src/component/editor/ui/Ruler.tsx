// src/component/editor/ui/Ruler.tsx
"use client";
import React, { useEffect, useRef } from "react";

type Units = "mm" | "inch" | "px";
const MM_PER_INCH = 25.4;

// pixels per ONE unit (at zoom=1)
function pxPerUnit(units: Units, dpi: number): number {
  if (units === "px") return 1;
  if (units === "inch") return dpi;
  return dpi / MM_PER_INCH; // mm
}

// choose a nice step in *units* so that major ticks ~ 70-120px apart at current zoom
function chooseMajorStep(pxpu: number, zoom: number) {
  const target = 90; // px between major ticks
  const approxUnits = target / (pxpu * zoom);
  const candidates = unitsCandidates();
  let best = candidates[0], diff = Math.abs(candidates[0] - approxUnits);
  for (const c of candidates) {
    const d = Math.abs(c - approxUnits);
    if (d < diff) { best = c; diff = d; }
  }
  return best;
}

function unitsCandidates(): number[] {
  // cover both inch/mm nicely; will still work for px
  return [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100];
}

function formatLabel(u: number, units: Units) {
  // more readable labels with one decimal for inch/mm when needed
  if (units === "px") return Math.round(u).toString();
  const a = Math.abs(u);
  const digits = a < 1 ? 2 : 1;
  const s = u.toFixed(digits);
  return s.replace(/\.0+$/, "");
}

/** Horizontal ruler (top) */
export const RulerHorizontal: React.FC<{
  zoom: number; units: Units; dpi: number; offsetX?: number;
}> = ({ zoom, units, dpi, offsetX = 0 }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const parentRect = el.parentElement?.getBoundingClientRect();
    const w = Math.max(1, Math.floor(parentRect?.width || 0));
    const h = Math.max(1, Math.floor(parentRect?.height || 24));
    const dpr = window.devicePixelRatio || 1;

    el.width = w * dpr; el.height = h * dpr;
    el.style.width = `${w}px`; el.style.height = `${h}px`;

    const ctx = el.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // background
    ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, w, h);
    // baseline
    ctx.strokeStyle = "#d1d5db"; ctx.beginPath(); ctx.moveTo(0, h - 0.5); ctx.lineTo(w, h - 0.5); ctx.stroke();

    const pxpu = pxPerUnit(units, dpi);
    const majorU = chooseMajorStep(pxpu, zoom);
    const majorPx = majorU * pxpu * zoom;

    // ticks
    ctx.strokeStyle = "#9ca3af";
    ctx.fillStyle = "#111827";
    ctx.font = "10px ui-sans-serif, system-ui, -apple-system";
    ctx.textBaseline = "top";

    const startX = -offsetX;               // 0 in world space is at offsetX px
    const endX   = w - offsetX;

    // draw minor and subminor ticks between majors
    const minorPerMajor = 5; // 5 minor per major
    const subPerMinor   = 2; // 2 sub per minor → 10 sub per major

    // first major tick index so that it covers left side
    const firstMajorWorldX = Math.floor(startX / majorPx) * majorPx;

    for (let xw = firstMajorWorldX; xw <= endX + majorPx; xw += majorPx) {
      const X = Math.round(xw + offsetX) + 0.5;

      // major tick
      ctx.beginPath(); ctx.moveTo(X, h); ctx.lineTo(X, h - 10); ctx.stroke();

      // label (unit value at this major)
      const worldUnits = (xw) / (pxpu * zoom); // in current units
      const label = formatLabel(worldUnits, units);
      ctx.fillText(label, X + 3, 2);

      // minors
      const minorStepPx = majorPx / minorPerMajor;
      for (let i = 1; i < minorPerMajor; i++) {
        const Xm = Math.round(xw + i * minorStepPx + offsetX) + 0.5;
        ctx.beginPath(); ctx.moveTo(Xm, h); ctx.lineTo(Xm, h - 7); ctx.stroke();

        // sub-minors
        const subStepPx = minorStepPx / subPerMinor;
        for (let j = 1; j < subPerMinor; j++) {
          const Xs = Math.round(xw + i * minorStepPx + j * subStepPx + offsetX) + 0.5;
          ctx.beginPath(); ctx.moveTo(Xs, h); ctx.lineTo(Xs, h - 4); ctx.stroke();
        }
      }
    }

    // zero marker + crosshair cap
    ctx.strokeStyle = "#6b7280";
    ctx.beginPath();
    ctx.moveTo(Math.round(offsetX) + 0.5, 0);
    ctx.lineTo(Math.round(offsetX) + 0.5, h);
    ctx.stroke();
    ctx.fillStyle = "#374151";
    ctx.fillRect(Math.round(offsetX) - 3, 0, 7, 2);
  }, [zoom, units, dpi, offsetX]);

  return <canvas ref={ref} className="w-full h-full block" />;
};

/** Vertical ruler (left) */
export const RulerVertical: React.FC<{
  zoom: number; units: Units; dpi: number; offsetY?: number;
}> = ({ zoom, units, dpi, offsetY = 0 }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const el = ref.current; if (!el) return;
  const parentRect = el.parentElement?.getBoundingClientRect();

  // ↑ پهنای بیشتر برای برچسب‌ها
  const w = Math.max(28, Math.floor(parentRect?.width || 0));   // ← قبلاً ~8 بود
  const h = Math.max(1, Math.floor(parentRect?.height || 200));
  const dpr = window.devicePixelRatio || 1;

  el.width = w * dpr; el.height = h * dpr;
  el.style.width = `${w}px`; el.style.height = `${h}px`;

  const ctx = el.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // پس‌زمینه و خط پایه
  ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#d1d5db"; ctx.beginPath(); ctx.moveTo(w - 0.5, 0); ctx.lineTo(w - 0.5, h); ctx.stroke();

  const pxpu = pxPerUnit(units, dpi);
  const majorU = chooseMajorStep(pxpu, zoom);
  const majorPx = majorU * pxpu * zoom;

  // فونت درشت‌تر، کنتراست بهتر
  ctx.font = "600 11px ui-sans-serif, system-ui, -apple-system";
  ctx.fillStyle = "#111827";
  ctx.strokeStyle = "#9ca3af";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const startY = -offsetY;
  const endY   = h - offsetY;

  const minorPerMajor = 5;
  const subPerMinor   = 2;

  const firstMajorWorldY = Math.floor(startY / majorPx) * majorPx;

  for (let yw = firstMajorWorldY; yw <= endY + majorPx; yw += majorPx) {
    const Y = Math.round(yw + offsetY) + 0.5;

    // تیک major بلندتر
    ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(12, Y); ctx.stroke();

    // برچسب (با بک‌گراند نیمه‌شفاف برای خوانایی)
    const worldUnits = (yw) / (pxpu * zoom);
    const label = formatLabel(worldUnits, units);

    // موقعیت برچسب: وسط پهنا با کمی فاصله از لبه
    const labelX = Math.floor(w / 2) + 1;

    // اندازه برای بک‌گراند
    ctx.save();
    ctx.translate(labelX, Y);
    ctx.rotate(-Math.PI / 2);
    const metrics = ctx.measureText(label);
    const lw = Math.ceil(metrics.width) + 6; // padding 3px دو طرف
    const lh = 14; // ارتفاع پس‌زمینه

    // بک‌گراند روشن
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(-3, -lh / 2, lw, lh);

    // متن با کنتراست
    ctx.fillStyle = "#111827";
    ctx.fillText(label, 0, 0);
    ctx.restore();

    // تیک‌های ریزتر
    const minorStepPx = majorPx / minorPerMajor;
    for (let i = 1; i < minorPerMajor; i++) {
      const Ym = Math.round(yw + i * minorStepPx + offsetY) + 0.5;
      ctx.beginPath(); ctx.moveTo(0, Ym); ctx.lineTo(8, Ym); ctx.stroke();

      const subStepPx = minorStepPx / subPerMinor;
      for (let j = 1; j < subPerMinor; j++) {
        const Ys = Math.round(yw + i * minorStepPx + j * subStepPx + offsetY) + 0.5;
        ctx.beginPath(); ctx.moveTo(0, Ys); ctx.lineTo(5, Ys); ctx.stroke();
      }
    }
  }

  // خط صفر عمودی + کلاهک
  ctx.strokeStyle = "#6b7280";
  ctx.beginPath(); ctx.moveTo(0, Math.round(offsetY) + 0.5); ctx.lineTo(w, Math.round(offsetY) + 0.5); ctx.stroke();
  ctx.fillStyle = "#374151";
  ctx.fillRect(0, Math.round(offsetY) - 3, 2, 7);
}, [zoom, units, dpi, offsetY]);


  return <canvas ref={ref} className="w-full h-full block" />;
};
