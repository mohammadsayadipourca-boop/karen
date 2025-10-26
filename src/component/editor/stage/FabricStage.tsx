// src/component/editor/stage/FabricStage.tsx
"use client";
/**
 * Fabric stage with correct print layout + toggles respected.
 * OUTER = Trim + 2×Bleed (when enabled)
 * TRIM  = real canvas (width×height)
 * SAFE  = inside Trim by (Bleed + Safe) when enabled
 * Ruler zero aligns to OUTER top-left
 */
import React, { useMemo, useRef } from "react";
import { useEditor } from "../store/editorStore";
import { unitToPx } from "../utils/units";

// Split parts
import GuidesOverlay from "./fabricComponent/GuidesOverlay";
import { useFabricInit } from "./fabricComponent/useFabricInit";
import { useCanvasSizing } from "./fabricComponent/useCanvasSizing";
import { useClearActions } from "./fabricComponent/useClearActions";
import { useFitZoom } from "./fabricComponent/useFitZoom";
import { useRulerOffset } from "./fabricComponent/useRulerOffset";

export const FabricStage: React.FC = () => {
  const {
    side, zoom,
    units, dpi, width, height, cornerRadius,
    bleedEnabled, bleedAmount, safeEnabled, safeAmount,
    requestClearSide, requestClearBoth, setRequestClearSide, setRequestClearBoth,
  } = useEditor();

  // refs
  const outerRef = useRef<HTMLDivElement | null>(null);

  // logical → px (no zoom)
  const pxW = useMemo(() => unitToPx(width,  units, dpi), [width, units, dpi]);
  const pxH = useMemo(() => unitToPx(height, units, dpi), [height, units, dpi]);
  const rPx = useMemo(() => unitToPx(cornerRadius, units, dpi), [cornerRadius, units, dpi]);

  // guides (no zoom)
  const bPx = useMemo(() => unitToPx(bleedAmount, units, dpi), [bleedAmount, units, dpi]);
  const sPx = useMemo(() => unitToPx(safeAmount,  units, dpi), [safeAmount,  units, dpi]);

  // effective values based on toggles
  const effBleed = bleedEnabled ? bPx : 0;
  const effSafe  = safeEnabled  ? sPx : 0;

  // OUTER size (Trim + 2×effective Bleed), then zoom
  const overallW = Math.round((pxW + 2 * effBleed) * zoom);
  const overallH = Math.round((pxH + 2 * effBleed) * zoom);

  // radii with zoom
  const trimRadius  = Math.max(0, Math.round(rPx * zoom));
  const outerRadius = 0;
  const safeRadius  = Math.max(
    0,
    Math.round((rPx > 0 ? Math.max(0, rPx - (effBleed + effSafe)) : 0) * zoom)
  );

  // container style
  const containerStyle: React.CSSProperties = {
    width: overallW,
    height: overallH,
    borderRadius: outerRadius,
    overflow: "hidden",
    position: "relative",
  };

  // init fabric + keep sizing, zoom, clear
  const { frontRef, backRef, front, back } = useFabricInit();
  useCanvasSizing([front.current, back.current], pxW, pxH, zoom);
  useClearActions({
    side,
    requestClearSide,
    requestClearBoth,
    setRequestClearSide,
    setRequestClearBoth,
    front: front.current,
    back: back.current,
  });

  // fit zoom (same triggers as قبل)
  useFitZoom(
    { pxW, pxH, effBleed },
    [width, height, units, dpi, bleedAmount, bleedEnabled]
  );

  // ruler zero offset to OUTER
  useRulerOffset(outerRef, [overallW, overallH, zoom, bleedEnabled]);

  // render
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Apple-ish stage pad */}
        <div className="absolute -inset-6 rounded-[24px] bg-white/60 backdrop-blur-xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)]" />
        <div className="relative p-2">
          <div ref={outerRef} style={containerStyle} className="bg-white border border-neutral-200 shadow-sm">
            {/* TRIM wrapper (Fabric sits inside) inset by effective Bleed */}
            <div
              className="absolute"
              style={{
                top: Math.round(effBleed * zoom),
                left: Math.round(effBleed * zoom),
                right: Math.round(effBleed * zoom),
                bottom: Math.round(effBleed * zoom),
                borderRadius: trimRadius,
                overflow: "hidden",
              }}
            >
              <canvas ref={frontRef} style={{ display: side === "front" ? "block" : "none" }} />
              <canvas ref={backRef}  style={{ display: side === "back"  ? "block" : "none"  }} />
            </div>

            {/* Guides (DOM-only; not exported) */}
            <GuidesOverlay
              zoom={zoom}
              bleedEnabled={bleedEnabled}
              safeEnabled={safeEnabled}
              effBleed={effBleed}
              effSafe={effSafe}
              trimRadius={trimRadius}
              safeRadius={safeRadius}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
