// src/component/editor/stage/FabricStage.tsx
"use client";
/**
 * EN: Fabric stage with correct print layout + toggles respected.
 * - OUTER = Overall (Trim + 2×Bleed when enabled; otherwise Trim)
 * - TRIM  = real canvas (width×height), inset by effective Bleed
 * - SAFE  = inside Trim by (Bleed + Safe) when enabled
 * - Outer corners always sharp (radius 0) per request
 * - Fit zoom recalculates when size/units/dpi/bleed toggle change
 * - Ruler zero aligns to OUTER top-left
 */
import React, { useEffect, useMemo, useRef } from "react";
import * as fabric from "fabric";
import { useEditor } from "../store/editorStore";
import { unitToPx } from "../utils/units";

export const FabricStage: React.FC = () => {
  const {
    // view
    side, zoom,
    // sizing
    units, dpi, width, height, cornerRadius,
    // guides
    bleedEnabled, bleedAmount, safeEnabled, safeAmount,
    // clear flags
    requestClearSide, requestClearBoth, setRequestClearSide, setRequestClearBoth,
  } = useEditor();

  // ───────────────────────────────── refs
  const outerRef = useRef<HTMLDivElement | null>(null);     // OUTER (Overall) container
  const frontRef = useRef<HTMLCanvasElement | null>(null);
  const backRef  = useRef<HTMLCanvasElement | null>(null);
  const front = useRef<fabric.Canvas | null>(null);
  const back  = useRef<fabric.Canvas  | null>(null);

  // ───────────────────────────────── logical → px (no zoom)
  const pxW = useMemo(() => unitToPx(width,  units, dpi), [width, units, dpi]);   // Trim W (px)
  const pxH = useMemo(() => unitToPx(height, units, dpi), [height, units, dpi]);  // Trim H (px)
  const rPx = useMemo(() => unitToPx(cornerRadius, units, dpi), [cornerRadius, units, dpi]);

  // per-side guides in px (no zoom)
  const bPx = useMemo(() => unitToPx(bleedAmount, units, dpi), [bleedAmount, units, dpi]);
  const sPx = useMemo(() => unitToPx(safeAmount,  units, dpi), [safeAmount,  units, dpi]);

  // ✅ effective values based on toggles
  const effBleed = bleedEnabled ? bPx : 0;
  const effSafe  = safeEnabled  ? sPx : 0;

  // OUTER size (Trim + 2×effective Bleed), then zoom
  const overallW = Math.round((pxW + 2 * effBleed) * zoom);
  const overallH = Math.round((pxH + 2 * effBleed) * zoom);

  // corner radii with zoom
  const trimRadius  = Math.max(0, Math.round(rPx * zoom));
  const outerRadius = 0; // outer always sharp per request
  const safeRadius  = Math.max(0, Math.round((rPx > 0 ? Math.max(0, rPx - (effBleed + effSafe)) : 0) * zoom));

  // OUTER container style
  const containerStyle: React.CSSProperties = {
    width:  overallW,
    height: overallH,
    borderRadius: outerRadius,
    overflow: "hidden",
    position: "relative",
  };

  // === Fit Zoom helper: fits OUTER (Trim + 2×effective Bleed) into #stage-container
  const fitZoom = React.useCallback(() => {
    const stageEl = document.getElementById("stage-container");
    if (!stageEl) return;

    const PAD = 24; // px
    const availW = Math.max(50, stageEl.clientWidth  - PAD * 2);
    const availH = Math.max(50, stageEl.clientHeight - PAD * 2);

    const overallPxW = pxW + 2 * effBleed; // ← effective bleed only
    const overallPxH = pxH + 2 * effBleed;

    const zFit = Math.max(0.05, Math.min(availW / overallPxW, availH / overallPxH));
    const zRounded = Math.min(8, Math.max(0.05, Math.round(zFit * 1000) / 1000));

    const curr = useEditor.getState().zoom;
    if (Math.abs(curr - zRounded) > 0.001) {
      useEditor.setState({ zoom: zRounded });
    }
  }, [pxW, pxH, effBleed, bleedEnabled]);

  // Fit whenever size/units/dpi/bleed value or toggle changes
  useEffect(() => {
    fitZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, units, dpi, bleedAmount, bleedEnabled]);

  // Keep fit on container resize
  useEffect(() => {
    const stageEl = document.getElementById("stage-container");
    if (!stageEl) return;
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => fitZoom());
      ro.observe(stageEl);
    } else {
      const onResize = () => fitZoom();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    return () => ro?.disconnect();
  }, [fitZoom]);

  // ───────────────────────────────── init Fabric canvases
  useEffect(() => {
    if (frontRef.current && !front.current) {
      front.current = new (fabric as any).Canvas(frontRef.current, {
        preserveObjectStacking: true,
        selection: true,
      });
    }
    if (backRef.current && !back.current) {
      back.current = new (fabric as any).Canvas(backRef.current, {
        preserveObjectStacking: true,
        selection: true,
      });
    }
    return () => {
      front.current?.dispose();
      back.current?.dispose();
    };
  }, []);

  // ───────────────────────────────── size & zoom (TRIM size)
  useEffect(() => {
    [front.current, back.current].forEach((c) => {
      if (!c) return;
      c.setWidth(Math.round(pxW * zoom));
      c.setHeight(Math.round(pxH * zoom));
      c.setZoom(zoom);
      c.renderAll();
    });
  }, [pxW, pxH, zoom]);

  // ───────────────────────────────── clear actions
  useEffect(() => {
    if (!requestClearSide) return;
    (side === "front" ? front.current : back.current)?.clear();
    setRequestClearSide(false);
  }, [requestClearSide, side, setRequestClearSide]);

  useEffect(() => {
    if (!requestClearBoth) return;
    front.current?.clear();
    back.current?.clear();
    setRequestClearBoth(false);
  }, [requestClearBoth, setRequestClearBoth]);

  // ───────────────────────────────── ruler zero-offset = top-left of OUTER
  useEffect(() => {
    const stageEl = document.getElementById("stage-container");
    const el = outerRef.current;
    if (!stageEl || !el) return;

    const update = () => {
      const a = stageEl.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      useEditor.setState({
        rulerOffsetX: Math.round(b.left - a.left),
        rulerOffsetY: Math.round(b.top  - a.top),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [overallW, overallH, zoom, bleedEnabled]);

  // ───────────────────────────────── render
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Apple-ish stage pad */}
        <div className="absolute -inset-6 rounded-[24px] bg-white/60 backdrop-blur-xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)]" />

        {/* OUTER = Overall container */}
        <div className="relative p-2">
          <div ref={outerRef} style={containerStyle} className="bg-white border border-neutral-200 shadow-sm">

            {/* TRIM wrapper (Fabric sits inside) inset by effective Bleed */}
            <div
              className="absolute"
              style={{
                top:    Math.round(effBleed * zoom),
                left:   Math.round(effBleed * zoom),
                right:  Math.round(effBleed * zoom),
                bottom: Math.round(effBleed * zoom),
                borderRadius: trimRadius,
                overflow: "hidden",
              }}
            >
              <canvas ref={frontRef} style={{ display: side === "front" ? "block" : "none" }} />
              <canvas ref={backRef}  style={{ display: side === "back"  ? "block" : "none"  }} />
            </div>

            {/* === Guides (DOM-only; not exported) ===================================== */}
            {/* Outer overall border (red) — show only when Bleed is enabled for clarity */}
            {bleedEnabled && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: 0, // sharp outer corners
                  boxSizing: "border-box",
                  border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(239,68,68,0.7)`,
                }}
              />
            )}

            {/* Trim border (red) inset by effective Bleed */}
            {bleedEnabled && (
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  top:    Math.round(effBleed * zoom),
                  left:   Math.round(effBleed * zoom),
                  right:  Math.round(effBleed * zoom),
                  bottom: Math.round(effBleed * zoom),
                  borderRadius: trimRadius,
                  boxSizing: "border-box",
                  border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(239,68,68,0.9)`,
                }}
              />
            )}

            {/* Safe area (green) inset by effective Bleed + Safe */}
            {safeEnabled && (
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  top:    Math.round((effBleed + effSafe) * zoom),
                  left:   Math.round((effBleed + effSafe) * zoom),
                  right:  Math.round((effBleed + effSafe) * zoom),
                  bottom: Math.round((effBleed + effSafe) * zoom),
                  borderRadius: safeRadius,
                  boxSizing: "border-box",
                  border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(16,185,129,0.9)`,
                }}
              />
            )}
            {/* ======================================================================== */}
          </div>
        </div>
      </div>
    </div>
  );
};
