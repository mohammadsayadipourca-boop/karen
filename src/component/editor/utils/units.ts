// src/component/editor/utils/units.ts
// EN: Precise conversion helpers between mm, inch, and px at a given DPI.
// FA: توابع دقیق تبدیل بین میلی‌متر، اینچ و پیکسل با DPI مشخص.

export type Units = "mm" | "inch" | "px";

const MM_PER_INCH = 25.4;

// EN: Convert a logical value in given units to CSS pixels at 'dpi'.
// FA: تبدیل مقدار منطقی بر اساس واحد انتخابی به پیکسل (با DPI).
export function unitToPx(value: number, units: Units, dpi: number): number {
  if (!isFinite(value)) return 0;
  switch (units) {
    case "px":
      return value;
    case "inch":
      return value * dpi;
    case "mm":
      return (value / MM_PER_INCH) * dpi;
    default:
      return value;
  }
}

// EN: Convert from CSS pixels to target units at 'dpi'.
// FA: تبدیل از پیکسل به واحد مقصد با DPI.
export function pxToUnit(px: number, units: Units, dpi: number): number {
  if (!isFinite(px)) return 0;
  switch (units) {
    case "px":
      return px;
    case "inch":
      return px / dpi;
    case "mm":
      return (px / dpi) * MM_PER_INCH;
    default:
      return px;
  }
}

// EN: Convert a value from 'from' units to 'to' units keeping physical size.
// FA: تبدیل مقدار از واحد مبدا به مقصد با حفظ اندازهٔ فیزیکی.
export function convertUnits(value: number, from: Units, to: Units, dpi: number): number {
  if (from === to) return value;
  const px = unitToPx(value, from, dpi);
  return pxToUnit(px, to, dpi);
}

// EN: Helpers for mm/inch ⇄ inch/mm directly (not using DPI).
// FA: مبدل مستقیم بین میلی‌متر و اینچ (بدون DPI).
export function mmToInch(mm: number): number {
  return mm / MM_PER_INCH;
}
export function inchToMm(inch: number): number {
  return inch * MM_PER_INCH;
}

// EN: Pretty formatter for labels.
// FA: قالب‌بندی برای نمایش.
export function fmt(n: number, digits = 2): string {
  // Avoid -0
  const v = Math.abs(n) < 1e-8 ? 0 : n;
  return Number(v.toFixed(digits)).toString();
}

// EN: Clamp utility.
// FA: محدودکنندهٔ بازه.
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
