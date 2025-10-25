// src/component/editor/side/panels/ImageSettingPanel.tsx
"use client";
import React from "react";
import { useEditor } from "../../store/editorStore";
import {
  unitToPx,
  convertUnits,
  fmt,
  clamp as clampNum,
} from "../../utils/units";

const fmt1 = (n: number) => Number(fmt(n, 1)); // ← فقط 1 رقم اعشار (عرض/ارتفاع/شعاع)
const fmt3 = (n: number) => Number(fmt(n, 3)); // ← فقط 3 رقم اعشار (bleed/safe)

export const ImageSettingPanel: React.FC = () => {
  const {
    units,
    setUnits,
    dpi,
    setDpi,
    width,
    height,
    cornerRadius,
    setSize,
    setCornerRadius,
    bleedEnabled, bleedAmount, safeEnabled, safeAmount,
  } = useEditor();

  // change units keeping physical size (store/show with 1 decimal)
  // هنگام تغییر واحد، مقدار bleed و safe هم تبدیل شود
const onUnitsChange = (nextUnits: "mm" | "inch" | "px") => {
  if (nextUnits === units) return;
  const newW = fmt1(convertUnits(width, units, nextUnits, dpi));
  const newH = fmt1(convertUnits(height, units, nextUnits, dpi));
  const newR = fmt1(convertUnits(cornerRadius, units, nextUnits, dpi));
  const newBleed = fmt3(convertUnits(bleedAmount, units, nextUnits, dpi));
  const newSafe  = fmt3(convertUnits(safeAmount,  units, nextUnits, dpi));
  useEditor.setState({
    units: nextUnits,
    width: newW, height: newH, cornerRadius: newR,
    bleedAmount: newBleed, safeAmount: newSafe,
  });
};


// width/height/radius (1 decimal)
const onWidthChange = (v: string) => {
  const n = Number(v); if (!isFinite(n)) return;
  setSize(fmt1(Math.max(0.1, n)), fmt1(height));
};
const onHeightChange = (v: string) => {
  const n = Number(v); if (!isFinite(n)) return;
  setSize(fmt1(width), fmt1(Math.max(0.1, n)));
};
const onRadiusChange = (v: string) => {
  const n = Number(v); if (!isFinite(n)) return;
  const maxR = Math.min(width, height) / 2;
  setCornerRadius(fmt1(clampNum(Math.max(0, n), 0, maxR)));
};

// bleed/safe (3 decimals)
const onBleedChange = (v: string) => {
  const n = Number(v); if (!isFinite(n)) return;
  useEditor.setState({ bleedAmount: fmt3(Math.max(0, n)) });
};
const onSafeChange = (v: string) => {
  const n = Number(v); if (!isFinite(n)) return;
  useEditor.setState({ safeAmount: fmt3(Math.max(0, n)) });
};

  const onDpiChange = (v: string) => {
    const n = Number(v);
    if (!isFinite(n)) return;
    setDpi(Math.max(72, Math.min(1200, Math.round(n))));
  };

  const pxW = unitToPx(width, units, dpi);
  const pxH = unitToPx(height, units, dpi);

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-600">Width ({units})</span>
          <input
            className="input"
            type="number"
            step="0.1"
            value={fmt1(width)}
            onChange={(e) => onWidthChange(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-600">Height ({units})</span>
          <input
            className="input"
            type="number"
            step="0.1"
            value={fmt1(height)}
            onChange={(e) => onHeightChange(e.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-600">Corner Radius ({units})</span>
          <input
            className="input"
            type="number"
            step="0.1"
            value={fmt1(cornerRadius)}
            onChange={(e) => onRadiusChange(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-600">DPI</span>
          <input
            className="input"
            type="number"
            step="1"
            min={72}
            max={1200}
            value={dpi}
            onChange={(e) => onDpiChange(e.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          className={`btn ${units === "mm" ? "btn-active" : ""}`}
          onClick={() => onUnitsChange("mm")}
          title="Millimeters"
        >
          mm
        </button>
        <button
          className={`btn ${units === "inch" ? "btn-active" : ""}`}
          onClick={() => onUnitsChange("inch")}
          title="Inches"
        >
          in
        </button>
        <button
          className={`btn ${units === "px" ? "btn-active" : ""}`}
          onClick={() => onUnitsChange("px")}
          title="Pixels"
        >
          px
        </button>
      </div>

      {/* Real canvas size in pixels */}
      <div className="text-xs text-neutral-600 border-t pt-2 mt-2">
        Canvas: {Math.round(pxW)} × {Math.round(pxH)} px{" "}
        <span className="opacity-60">@ {dpi} DPI</span>
      </div>

      {/* Quick presets */}
      <div className="border-t pt-2 mt-2 grid grid-cols-2 gap-2">
        <button
          className="btn"
          title="Business Card 85×55mm"
          onClick={() => {
            setSize(fmt1(convertUnits(85, "mm", units, dpi)), fmt1(convertUnits(55, "mm", units, dpi)));
            setCornerRadius(fmt1(convertUnits(3, "mm", units, dpi)));
          }}
        >
          85×55 mm
        </button>
        <button
          className="btn"
          title="US Business Card 3.5×2 in"
          onClick={() => {
            setSize(fmt1(convertUnits(3.5, "inch", units, dpi)), fmt1(convertUnits(2, "inch", units, dpi)));
            setCornerRadius(fmt1(convertUnits(0.125, "inch", units, dpi))); // ≈3.175mm
          }}
        >
          3.5×2 in
        </button>
      </div>
      {/* Guides: Bleed & Safe Area */}
      <div className="border-t pt-3 mt-3 space-y-3">
        <div className="flex items-center gap-2">
          <input
            id="bleedEnabled"
            type="checkbox"
            checked={bleedEnabled}
            onChange={(e) => useEditor.setState({ bleedEnabled: e.target.checked })}
          />
          <label htmlFor="bleedEnabled" className="text-sm">Bleed</label>
          <input
            className="input w-24"
            type="number"
            step="0.001"
            value={fmt3(bleedAmount)}
            onChange={(e) => onBleedChange(e.target.value)}
          />
          <span className="text-xs text-neutral-600">{units}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="safeEnabled"
            type="checkbox"
            checked={safeEnabled}
            onChange={(e) => useEditor.setState({ safeEnabled: e.target.checked })}
          />
          <label htmlFor="safeEnabled" className="text-sm">Safe Area</label>
          <input
            className="input w-24"
            type="number"
            step="0.001"
            value={fmt3(safeAmount)}
            onChange={(e) => onSafeChange(e.target.value)}
          />
          <span className="text-xs text-neutral-600">{units}</span>
        </div>

          
        </div>


{/* Summary: Trim / Overall / Safe — واحد جاری + پیکسل */}
<div className="text-xs text-neutral-700 border-t pt-2 mt-2 space-y-1">
  {(() => {
    // Trim = اندازه واقعی کارت (بدون bleed)
    const trimW = width;
    const trimH = height;

    // Overall = Trim + 2×Bleed (به ازای هر طرف)
    const overallW = trimW + 2 * bleedAmount;
    const overallH = trimH + 2 * bleedAmount;

    // Safe = Trim − 2×Safe (به ازای هر طرف)
    const safeW = Math.max(0, trimW - 2 * safeAmount);
    const safeH = Math.max(0, trimH - 2 * safeAmount);

    // به پیکسل @ DPI
    const trimPxW = unitToPx(trimW, units, dpi);
    const trimPxH = unitToPx(trimH, units, dpi);
    const overallPxW = unitToPx(overallW, units, dpi);
    const overallPxH = unitToPx(overallH, units, dpi);
    const safePxW = unitToPx(safeW, units, dpi);
    const safePxH = unitToPx(safeH, units, dpi);

    return (
      <>
        <div><b>Trim:</b> {fmt(trimW, 1)} × {fmt(trimH, 1)} {units}
          <span className="opacity-60"> — {Math.round(trimPxW)}×{Math.round(trimPxH)} px</span>
        </div>
        <div><b>Overall (Trim + 2×Bleed):</b> {fmt(overallW, 1)} × {fmt(overallH, 1)} {units}
          <span className="opacity-60"> — {Math.round(overallPxW)}×{Math.round(overallPxH)} px</span>
        </div>
        <div><b>Safe (Trim − 2×Safe):</b> {fmt(safeW, 1)} × {fmt(safeH, 1)} {units}
          <span className="opacity-60"> — {Math.round(safePxW)}×{Math.round(safePxH)} px</span>
        </div>
      </>
    );
  })()}
</div>


    </div>
  );
};
